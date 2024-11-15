from django.urls import path
from ninja import NinjaAPI, Query, Body, File
from django.contrib import admin
from typing import List
from ninja.files import UploadedFile

from .models import llmmodels, responses, files_upload
from .schemas import add_models, add_responses, add_tests
from .processors.llm_models import LLMModels
from .processors.evaluation import EvaluationProcessor
import uuid
import pandas as pd
from datetime import datetime
from django.db import connection

api = NinjaAPI()


#ADD MODELS------------------------------------------------------------
@api.post("/add-model")
def add_model(
        request,
        provider: str = Body(...),
        model: str = Body(...),
        temperature: float = Body(...),
        max_length: int = Body(...),
        top_p: float = Body(...),
        prompt: str = Body(...),
        token: str = Body(...),
    ):
    data = {
        "model_id": str(uuid.uuid4()),
        "provider": provider,
        "model": model,
        "temperature": temperature,
        "max_length": max_length,
        "top_p": top_p,
        "prompt": prompt,
        "token": token
    }
    new_model = add_models(data)
    return {"model_id": str(new_model.model_id)}

@api.get("/models")
def models(request):
    records = llmmodels.objects.all()
    if not records.exists():
        return {"error": "No records found"}
    
    models = {}
    for record in records[::-1]:
        if record.provider not in models:
            models[record.provider] = {
                "model_id": record.model_id,
                "model": record.model,
                "temperature": record.temperature,
                "maxLength": record.max_length,
                "topP": record.top_p,
                'apiKey': record.token,
            }
        
    return {
        "models": models
    }

def new_func():
    subquery = llmmodels.objects.order_by('provider', '-created_at').distinct('provider').values('provider', 'model_id')
    records = llmmodels.objects.filter(model_id__in=[item['model_id'] for item in subquery])
    return records

#-------------ADD FILES-----------------------------------------------
@api.post("/upload-file")
def upload_file(request, file: UploadedFile = File(...)):
    try:
        file_id = str(uuid.uuid4())
        file_name = file.name

        # Assuming the file is either CSV or XLSX
        if file_name.endswith('.csv'):
            df = pd.read_csv(file)
        elif file_name.endswith('.xlsx'):
            df = pd.read_excel(file)
        else:
            return {"error": "Unsupported file format"}

        for index, row in df.iterrows():
            test_index = index
            test_input = row.iloc[0]
            label = row.iloc[1]
            data = {
                "test_id": f"{file_id}_{test_index}",
                "file_id": file_id,
                "file_name": file_name,
                "test_index": test_index,
                "test_input": test_input,
                "label": label,
                "uploaded_at": datetime.now()
            }
            print(data)
            new_file = add_tests(data)

        return {"success": True, "file_id": file_id}
    except Exception as e:
        print(f"Error processing file: {str(e)}")  # For debugging
        return {"success": False, "error": str(e)}  

@api.get("/files")
def files(request):
    records = files_upload.objects.all()
    if not records.exists():
        return {"error": "No records found"}
    
    file_summary = {}
    for record in records[::-1]:
        if record.file_name not in file_summary:
            file_summary[record.file_name] = {
                "file_id": record.file_id,
                "uploaded_at": record.uploaded_at,
                "test_count": len(files_upload.objects.filter(file_id=record.file_id))
            }
    file_list = [{"file_name": key, **value} for key, value in file_summary.items()]

    return {"files": file_list}

#-------------ADD RESPONSES-----------------------------------------------
@api.post("/add-response")
def add_response(
        request,
        model_id: str = Body(...),
        file_id: str = Body(...)
    ):
    model_record = llmmodels.objects.get(model_id=model_id)
    file_record = files_upload.objects.filter(file_id=file_id)

    if not model_record or not file_record:
        return {"error": "Invalid model_id or file_id"}

    model = LLMModels(
        provider=model_record.provider,
        model=model_record.model,
        temperature=model_record.temperature,
        max_length=model_record.max_length,
        top_p=model_record.top_p,
        prompt=model_record.prompt,
        token=model_record.token
        )

    #for each file_record, get the test_index, test_input, loop through the test_input
    responses_id = []
    for record in file_record:
        test_index = record.test_index
        test_input = record.test_input
        try:
            model.call_llm(input_data=test_input)
            status = 'success'
            error = ''
            print(f"Response: {model.response}")
        except Exception as e:
            status = 'failed'
            error = str(e)
            print(f"Error: {error}")
        data = {
            "response_id": str(uuid.uuid4()),
            "response": model.response,
            "log": model.response_log,
            "model_id": model_id,
            "test_index": test_index,
            "status": status,
            "error_text": error
        }
        new_response = add_responses(data)
        responses_id.append(new_response.response_id)
    return {"responses_id": responses_id}


@api.get("/llm-responses")
def llm_responses(request, 
                  file_id: str = Query(...), 
                  model_id: str = Query(...), 
                  evaluation_type: str = Query(...)):
    
    file_records = files_upload.objects.filter(file_id=file_id)
    response_records = responses.objects.filter(model_id=model_id)
    print(file_records)
    print(response_records)
    print(evaluation_type)
    if not file_records.exists() or not response_records.exists():
        return {"error": "Invalid file_id or model_id"}

    file_data = {record.test_index: {"test": record.test_input, "label": record.label} for record in file_records}
    response_data = {record.test_index: record.response for record in response_records}

    evaluation_data = []
    for test_index, file_info in file_data.items():
        if test_index in response_data:
            evaluation_data.append({
                "test_index": test_index,
                "test": file_info["test"],
                "label": file_info["label"],
                "response": response_data[test_index]
            })

    evaluation_result = EvaluationProcessor(evaluation_data, evaluation_type)
    return evaluation_result

#----GET PROMPTS-----------------------------------------------
@api.get("/prompts")
def get_prompts(request):
    records = llmmodels.objects.values('created_at', 'prompt')
    if not records.exists():
        return {"error": "No records found"}
    
    prompt_dict = {}
    for record in records[::-1]:
        print(record)
        if record['prompt'] not in prompt_dict:
            prompt_dict[record['prompt']] = {
                "created_at": record['created_at']
            }
            
    prompt_list = [{"prompt": key, **value} for key, value in prompt_dict.items()]
            
    return {
        "prompts": prompt_list
    }
    
    

urlpatterns = [
    path('api/', api.urls),
]


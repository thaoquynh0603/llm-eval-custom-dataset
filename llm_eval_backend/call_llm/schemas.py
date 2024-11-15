from .models import llmmodels, responses, files_upload

def add_models(data):
    new_record = llmmodels(**data)
    new_record.save()
    return new_record

def add_responses(data):
    new_record = responses(**data)
    new_record.save()
    return new_record

def add_tests(data):
    new_record = files_upload(**data)
    new_record.save()
    return new_record
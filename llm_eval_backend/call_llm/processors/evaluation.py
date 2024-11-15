import pandas as pd 
import spacy
import math

#the df have 4 columns: test_index, test_input, label, response
def absolute(evaluation_df):
    evaluation_df['output'] = evaluation_df['label'] == evaluation_df['response']
    evaluation_df['output'] = evaluation_df['output'].astype(int)
    #return a dictionary of overall accuracy, and accuracy for each label
    return {
        "output":{
            "overall_accuracy": evaluation_df['output'].mean(),
            "accuracy_per_label": evaluation_df.groupby('label')['output'].mean().to_dict()
        },
        "table": evaluation_df.to_dict()
    }
    
def relative(evaluation_df):
    nlp = spacy.load("en_core_web_sm")
    evaluation_df['output'] = evaluation_df.apply(lambda x: nlp(x['label']).similarity(nlp(x['response'])), axis=1)
    evaluation_df['output'] = evaluation_df['output'].astype(float)
    #return the average similarity score
    return {
        "output": {
                "avg": evaluation_df['output'].mean(),
                "max": evaluation_df['output'].max(),
                "min": evaluation_df['output'].min(),
                "square_avg": math.sqrt((evaluation_df['output'] ** 2).mean())
        },
        "table": evaluation_df.to_dict()
    }
    
def EvaluationProcessor(evaluation_data, evaluation_type):
    evaluation_df = pd.DataFrame(evaluation_data)
    if evaluation_type == 'absolute':
        return absolute(evaluation_df)
    elif evaluation_type == 'relative':
        return relative(evaluation_df)
    else:
        return {"error": "Invalid evaluation_type"}
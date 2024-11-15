from django.db import models

class llmmodels(models.Model):
    model_id = models.CharField(max_length=100, primary_key=True)
    provider = models.CharField(max_length=100)
    model = models.CharField(max_length=100)
    temperature = models.FloatField()
    max_length = models.IntegerField()
    top_p = models.FloatField()
    token = models.TextField()
    prompt = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    
class responses(models.Model):
    response_id = models.CharField(max_length=100, primary_key=True)
    response = models.TextField()
    log = models.TextField()
    model_id = models.CharField(max_length=100, default='')
    test_index = models.IntegerField(null=True, blank=True)
    status = models.CharField(max_length=100, default='')
    error_text = models.TextField(default='')
    created_at = models.DateTimeField(auto_now_add=True)
    
class files_upload(models.Model):
    test_id = models.CharField(max_length=100, primary_key=True)
    file_id = models.CharField(max_length=100)
    file_name = models.CharField(max_length=255)
    test_index = models.IntegerField()
    test_input = models.TextField()
    label = models.CharField(max_length=255)
    uploaded_at = models.DateTimeField(null=False, blank=False, verbose_name=u'Uploaded At', auto_now_add=True)
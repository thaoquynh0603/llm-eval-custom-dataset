from django.contrib import admin
from .models import llmmodels, responses, files_upload
# Register your models here.

admin.site.register(llmmodels)
admin.site.register(responses)
admin.site.register(files_upload)
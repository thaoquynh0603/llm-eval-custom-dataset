# Generated by Django 5.1.3 on 2024-11-07 12:55

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('call_llm', '0002_alter_response_llm_index'),
    ]

    operations = [
        migrations.CreateModel(
            name='files_upload',
            fields=[
                ('file_id', models.CharField(max_length=100, primary_key=True, serialize=False)),
                ('file_name', models.CharField(max_length=255)),
                ('uploaded_at', models.DateTimeField(auto_now_add=True)),
                ('test_index', models.IntegerField()),
                ('test_input', models.TextField()),
                ('label', models.CharField(max_length=255)),
            ],
        ),
        migrations.CreateModel(
            name='llmmodels',
            fields=[
                ('model_id', models.CharField(max_length=100, primary_key=True, serialize=False)),
                ('provider', models.CharField(max_length=100)),
                ('model', models.CharField(max_length=100)),
                ('temperature', models.FloatField()),
                ('max_length', models.IntegerField()),
                ('top_p', models.FloatField()),
                ('token', models.TextField()),
                ('prompt', models.TextField()),
                ('created_at', models.DateTimeField(auto_now_add=True)),
            ],
        ),
        migrations.CreateModel(
            name='responses',
            fields=[
                ('response_id', models.CharField(max_length=100, primary_key=True, serialize=False)),
                ('response', models.TextField()),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('log', models.TextField()),
                ('model_id', models.CharField(default='', max_length=100)),
                ('test_index', models.IntegerField(blank=True, null=True)),
                ('status', models.CharField(default='', max_length=100)),
                ('error_text', models.TextField(default='')),
            ],
        ),
        migrations.DeleteModel(
            name='call_llm',
        ),
        migrations.DeleteModel(
            name='response_llm',
        ),
    ]
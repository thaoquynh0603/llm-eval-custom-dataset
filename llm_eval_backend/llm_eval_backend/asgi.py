"""
ASGI config for llm_eval_backend project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.1/howto/deployment/asgi/
"""

import os

from django.core.asgi import get_asgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'llm_eval_backend.settings')
os.environ["NINJA_SKIP_REGISTRY"] = "yes"

application = get_asgi_application()

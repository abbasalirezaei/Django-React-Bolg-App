import os
from celery import Celery

# تنظیم DJANGO_SETTINGS_MODULE
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')

# ایجاد اپ سلری
app = Celery('core')

# بارگذاری تنظیمات از settings.py با پیشوند CELERY
app.config_from_object('django.conf:settings', namespace='CELERY')

# خودکار پیدا کردن تَسک‌ها در اپ‌های جنگو
app.autodiscover_tasks()
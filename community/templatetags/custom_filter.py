from django import template
from django.template.defaultfilters import date
from datetime import datetime, timedelta
from django.utils import timezone

register = template.Library()

@register.filter(name='custom_date_format')
def custom_date_format(value):
    now = timezone.localtime(timezone.now())
    delta = now - value

    if delta < timedelta(days=1):
        return f"{value.hour:02d}:{value.minute:02d}"
    else:
        return date(value, "Y-m-d")
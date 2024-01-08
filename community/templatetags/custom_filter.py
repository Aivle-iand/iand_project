from django import template
from django.template.defaultfilters import date
from django.utils import timezone

register = template.Library()

@register.filter(name='custom_date_format')
def custom_date_format(value):
    now = value.astimezone(timezone.pytz.timezone('Asia/Seoul'))

    if value.day == now.day:
        return f"{value.hour:02d}:{value.minute:02d}"
    else:
        return date(value, "Y-m-d H:i")
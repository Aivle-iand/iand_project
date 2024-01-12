from django import template
from django.template.defaultfilters import date
from django.utils import timezone

register = template.Library()

@register.filter(name='custom_date_format')
def custom_date(value):
    value = timezone.localtime(value, timezone=timezone.get_default_timezone())
    now = timezone.localtime(timezone=timezone.get_default_timezone())
    if value.date() == now.date():
        return value.strftime("%H:%M")  # 현재 날짜와 같은 경우 시간과 분 표시
    else:
        return value.strftime("%Y-%m-%d")  # 다른 경우 연, 월, 일 표시
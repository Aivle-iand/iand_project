from django import template
from django.template.defaultfilters import date
from django.utils import timezone

register = template.Library()

@register.filter(name='custom_date_format')
def custom_date_format(value):
    now = timezone.localtime(value, timezone=timezone.get_default_timezone())

    if isinstance(value, timezone.datetime):

        # 해당 일자에 작성한 글인 경우
        if value.day == now.day:
            return  now.strftime('%H:%M')
    
    else:
        return date(value, "Y-m-d H:i")
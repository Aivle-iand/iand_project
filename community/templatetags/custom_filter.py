from django import template
from django.template.defaultfilters import date
from django.utils import timezone

register = template.Library()

@register.filter(name='custom_date_format')
def custom_date_format(value):

    if isinstance:
        now = timezone.localtime(value, timezone=timezone.get_default_timezone())
        # now = now + timezone.timedelta(minutes=1)
        return now.strftime('%H:%M')
    else:
        return date(value, "Y-m-d H:i")
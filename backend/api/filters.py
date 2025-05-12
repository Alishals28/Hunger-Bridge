from django_filters import rest_framework as filters
from .models import Request
from django.contrib.auth import get_user_model

User = get_user_model()

class RequestFilter(filters.FilterSet):
    start_date = filters.IsoDateTimeFilter(field_name='created_at', lookup_expr='gte')
    end_date = filters.IsoDateTimeFilter(field_name='created_at', lookup_expr='lte')
    user = filters.ModelChoiceFilter(queryset=User.objects.all(), field_name='ngo__user')
    preferred_area = filters.CharFilter(method='filter_by_preferred_area')

    def filter_by_preferred_area(self, queryset, name, value):
        return queryset.filter(
            volunteer__isnull=False, # only if volunteer is assigned
            volunteer__preferred_area__icontains=value
        )
        
    class Meta:
        model = Request
        fields = ['status', 'priority', 'start_date', 'end_date', 'user', 'preferred_area']

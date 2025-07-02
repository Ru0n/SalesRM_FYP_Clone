from django.contrib import admin
from django.utils.translation import gettext_lazy as _
from .models import LeaveRequest


@admin.register(LeaveRequest)
class LeaveRequestAdmin(admin.ModelAdmin):
    """Admin for LeaveRequest model."""
    list_display = ('user', 'leave_type', 'start_date', 'end_date', 'days_count', 'status', 'is_active')
    list_filter = ('status', 'leave_type', 'is_active', 'start_date')
    search_fields = ('user__email', 'user__first_name', 'user__last_name', 'reason', 'manager_comments')
    date_hierarchy = 'start_date'
    readonly_fields = ('requested_at', 'created_at', 'updated_at')
    
    fieldsets = (
        (None, {
            'fields': ('user', 'leave_type', 'start_date', 'end_date', 'reason')
        }),
        (_('Status'), {
            'fields': ('status', 'is_active')
        }),
        (_('Review'), {
            'fields': ('reviewed_by', 'reviewed_at', 'manager_comments')
        }),
        (_('Timestamps'), {
            'fields': ('requested_at', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def days_count(self, obj):
        """Return the number of days requested."""
        return obj.days_count
    days_count.short_description = _('Days')
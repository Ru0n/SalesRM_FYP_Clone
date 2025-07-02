from django.contrib import admin
from django.utils.translation import gettext_lazy as _
from .models import TourProgram


@admin.register(TourProgram)
class TourProgramAdmin(admin.ModelAdmin):
    """Admin for TourProgram model."""
    list_display = ('user', 'month_display', 'year', 'status', 'is_active')
    list_filter = ('status', 'month', 'year', 'is_active')
    search_fields = ('user__email', 'user__first_name', 'user__last_name', 'area_details')
    date_hierarchy = 'submitted_at'
    readonly_fields = ('submitted_at', 'reviewed_at', 'created_at', 'updated_at')
    
    fieldsets = (
        (None, {
            'fields': ('user', 'month', 'year', 'area_details')
        }),
        (_('Status'), {
            'fields': ('status', 'is_active')
        }),
        (_('Review'), {
            'fields': ('reviewed_by', 'reviewed_at', 'manager_comments')
        }),
        (_('Timestamps'), {
            'fields': ('submitted_at', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def month_display(self, obj):
        """Return the month name."""
        return obj.month_name
    month_display.short_description = _('Month')

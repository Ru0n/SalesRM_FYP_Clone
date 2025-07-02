from django.contrib import admin
from django.utils.translation import gettext_lazy as _
from .models import DailyCallReport


class DailyCallReportAdmin(admin.ModelAdmin):
    """Admin for DailyCallReport model."""
    list_display = ('user', 'date', 'work_type', 'summary_short', 'doctor_count', 'chemist_count', 'is_active')
    list_filter = ('is_active', 'work_type', 'date', 'user')
    search_fields = ('user__email', 'user__first_name', 'user__last_name', 'summary')
    date_hierarchy = 'date'
    filter_horizontal = ('doctors_visited', 'chemists_visited')
    readonly_fields = ('submitted_at', 'created_at', 'updated_at')

    fieldsets = (
        (None, {
            'fields': ('user', 'date', 'work_type', 'summary')
        }),
        (_('Contacts Visited'), {
            'fields': ('doctors_visited', 'chemists_visited')
        }),
        (_('Status'), {
            'fields': ('is_active',)
        }),
        (_('Timestamps'), {
            'fields': ('submitted_at', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

    def summary_short(self, obj):
        """Return a shortened version of the summary."""
        return obj.summary[:50] + '...' if len(obj.summary) > 50 else obj.summary
    summary_short.short_description = _('Summary')

    def doctor_count(self, obj):
        """Return the number of doctors visited."""
        return obj.doctors_visited.count()
    doctor_count.short_description = _('Doctors')

    def chemist_count(self, obj):
        """Return the number of chemists visited."""
        return obj.chemists_visited.count()
    chemist_count.short_description = _('Chemists')


admin.site.register(DailyCallReport, DailyCallReportAdmin)

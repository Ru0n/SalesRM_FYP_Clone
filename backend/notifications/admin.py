from django.contrib import admin
from .models import Notification


@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    """Admin configuration for the Notification model."""
    
    list_display = ('recipient', 'actor_object_id', 'verb', 'target_object_id', 'timestamp', 'unread', 'level')
    list_filter = ('unread', 'level', 'timestamp')
    search_fields = ('verb', 'recipient__email', 'recipient__first_name', 'recipient__last_name')
    readonly_fields = ('timestamp',)
    date_hierarchy = 'timestamp'
    
    def get_queryset(self, request):
        """Optimize query by prefetching related objects."""
        qs = super().get_queryset(request)
        return qs.select_related('recipient')

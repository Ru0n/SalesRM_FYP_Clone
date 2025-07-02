from django.contrib import admin
from django.utils.translation import gettext_lazy as _
from .models import ExpenseClaim


@admin.register(ExpenseClaim)
class ExpenseClaimAdmin(admin.ModelAdmin):
    """Admin for ExpenseClaim model."""
    list_display = ('user', 'expense_type', 'amount', 'date', 'status', 'submitted_at', 'is_active')
    list_filter = ('status', 'expense_type', 'date', 'is_active')
    search_fields = ('user__email', 'user__first_name', 'user__last_name', 'description')
    date_hierarchy = 'date'
    readonly_fields = ('submitted_at', 'reviewed_at', 'created_at', 'updated_at')

    fieldsets = (
        (None, {
            'fields': ('user', 'expense_type', 'amount', 'date', 'description', 'attachment')
        }),
        (_('Status'), {
            'fields': ('status', 'submitted_at', 'reviewed_by', 'reviewed_at', 'manager_comments')
        }),
        (_('Metadata'), {
            'fields': ('is_active', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

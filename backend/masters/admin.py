from django.contrib import admin
from django.utils.translation import gettext_lazy as _
from .models import (
    Territory, Position, ProductCategory, Product,
    LeaveType, ExpenseType, Holiday, DoctorSpecialty,
    ChemistCategory, StockistCategory, Doctor, Chemist
)


class BaseModelAdmin(admin.ModelAdmin):
    """Base admin class for all models."""
    list_display = ('__str__', 'is_active', 'created_at', 'updated_at')
    list_filter = ('is_active',)
    readonly_fields = ('created_at', 'updated_at')
    search_fields = ('name',)
    date_hierarchy = 'created_at'
    save_on_top = True


@admin.register(Territory)
class TerritoryAdmin(BaseModelAdmin):
    """Admin for Territory model."""
    list_display = ('name', 'code', 'parent', 'is_active')
    list_filter = ('is_active', 'parent')
    search_fields = ('name', 'code', 'description')
    autocomplete_fields = ('parent',)
    fieldsets = (
        (None, {
            'fields': ('name', 'code', 'description', 'parent')
        }),
        (_('Status'), {
            'fields': ('is_active',)
        }),
        (_('Timestamps'), {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(Position)
class PositionAdmin(BaseModelAdmin):
    """Admin for Position model."""
    list_display = ('name', 'code', 'level', 'is_active')
    list_filter = ('is_active', 'level')
    search_fields = ('name', 'code', 'description')
    fieldsets = (
        (None, {
            'fields': ('name', 'code', 'description', 'level')
        }),
        (_('Status'), {
            'fields': ('is_active',)
        }),
        (_('Timestamps'), {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(ProductCategory)
class ProductCategoryAdmin(BaseModelAdmin):
    """Admin for ProductCategory model."""
    list_display = ('name', 'is_active')
    search_fields = ('name', 'description')
    fieldsets = (
        (None, {
            'fields': ('name', 'description')
        }),
        (_('Status'), {
            'fields': ('is_active',)
        }),
        (_('Timestamps'), {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(Product)
class ProductAdmin(BaseModelAdmin):
    """Admin for Product model."""
    list_display = ('name', 'code', 'category', 'unit_price', 'unit', 'is_prescription_required', 'is_active')
    list_filter = ('is_active', 'category', 'is_prescription_required')
    search_fields = ('name', 'code', 'description')
    autocomplete_fields = ('category',)
    fieldsets = (
        (None, {
            'fields': ('name', 'code', 'description', 'category')
        }),
        (_('Pricing & Units'), {
            'fields': ('unit_price', 'unit')
        }),
        (_('Options'), {
            'fields': ('is_prescription_required', 'is_active')
        }),
        (_('Timestamps'), {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(LeaveType)
class LeaveTypeAdmin(BaseModelAdmin):
    """Admin for LeaveType model."""
    list_display = ('name', 'code', 'max_days_per_year', 'is_paid', 'requires_approval', 'is_active')
    list_filter = ('is_active', 'is_paid', 'requires_approval')
    search_fields = ('name', 'code', 'description')
    fieldsets = (
        (None, {
            'fields': ('name', 'code', 'description')
        }),
        (_('Options'), {
            'fields': ('max_days_per_year', 'is_paid', 'requires_approval', 'is_active')
        }),
        (_('Timestamps'), {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(ExpenseType)
class ExpenseTypeAdmin(BaseModelAdmin):
    """Admin for ExpenseType model."""
    list_display = ('name', 'code', 'max_amount', 'requires_receipt', 'is_active')
    list_filter = ('is_active', 'requires_receipt')
    search_fields = ('name', 'code', 'description')
    fieldsets = (
        (None, {
            'fields': ('name', 'code', 'description')
        }),
        (_('Options'), {
            'fields': ('max_amount', 'requires_receipt', 'is_active')
        }),
        (_('Timestamps'), {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(Holiday)
class HolidayAdmin(BaseModelAdmin):
    """Admin for Holiday model."""
    list_display = ('name', 'date', 'is_national', 'is_active')
    list_filter = ('is_active', 'is_national', 'date')
    search_fields = ('name', 'description')
    filter_horizontal = ('territories',)
    fieldsets = (
        (None, {
            'fields': ('name', 'date', 'description')
        }),
        (_('Options'), {
            'fields': ('is_national', 'territories', 'is_active')
        }),
        (_('Timestamps'), {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(DoctorSpecialty)
class DoctorSpecialtyAdmin(BaseModelAdmin):
    """Admin for DoctorSpecialty model."""
    list_display = ('name', 'is_active')
    search_fields = ('name', 'description')
    fieldsets = (
        (None, {
            'fields': ('name', 'description')
        }),
        (_('Status'), {
            'fields': ('is_active',)
        }),
        (_('Timestamps'), {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(ChemistCategory)
class ChemistCategoryAdmin(BaseModelAdmin):
    """Admin for ChemistCategory model."""
    list_display = ('name', 'is_active')
    search_fields = ('name', 'description')
    fieldsets = (
        (None, {
            'fields': ('name', 'description')
        }),
        (_('Status'), {
            'fields': ('is_active',)
        }),
        (_('Timestamps'), {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(StockistCategory)
class StockistCategoryAdmin(BaseModelAdmin):
    """Admin for StockistCategory model."""
    list_display = ('name', 'is_active')
    search_fields = ('name', 'description')
    fieldsets = (
        (None, {
            'fields': ('name', 'description')
        }),
        (_('Status'), {
            'fields': ('is_active',)
        }),
        (_('Timestamps'), {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(Doctor)
class DoctorAdmin(BaseModelAdmin):
    """Admin for Doctor model."""
    list_display = ('name', 'specialty', 'location', 'contact_number', 'added_by', 'is_active')
    list_filter = ('is_active', 'specialty', 'added_by')
    search_fields = ('name', 'location', 'contact_number', 'email')
    autocomplete_fields = ('specialty', 'added_by')
    fieldsets = (
        (None, {
            'fields': ('name', 'specialty', 'location')
        }),
        (_('Contact Information'), {
            'fields': ('contact_number', 'email')
        }),
        (_('Metadata'), {
            'fields': ('added_by', 'is_active')
        }),
        (_('Timestamps'), {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(Chemist)
class ChemistAdmin(BaseModelAdmin):
    """Admin for Chemist model."""
    list_display = ('name', 'category', 'location', 'contact_number', 'added_by', 'is_active')
    list_filter = ('is_active', 'category', 'added_by')
    search_fields = ('name', 'location', 'contact_number', 'email')
    autocomplete_fields = ('category', 'added_by')
    fieldsets = (
        (None, {
            'fields': ('name', 'category', 'location')
        }),
        (_('Contact Information'), {
            'fields': ('contact_number', 'email')
        }),
        (_('Metadata'), {
            'fields': ('added_by', 'is_active')
        }),
        (_('Timestamps'), {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

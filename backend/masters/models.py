from django.db import models
from django.utils.translation import gettext_lazy as _
from django.conf import settings


class BaseModel(models.Model):
    """Base model with common fields for all models."""
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        abstract = True


class Territory(BaseModel):
    """Territory model for geographical divisions."""
    name = models.CharField(max_length=100, unique=True)
    code = models.CharField(max_length=20, unique=True)
    description = models.TextField(blank=True, null=True)
    parent = models.ForeignKey('self', on_delete=models.SET_NULL, null=True, blank=True, related_name='children')

    class Meta:
        verbose_name = _('Territory')
        verbose_name_plural = _('Territories')
        ordering = ['name']

    def __str__(self):
        return f"{self.name} ({self.code})"


class Position(BaseModel):
    """Position model for job roles."""
    name = models.CharField(max_length=100, unique=True)
    code = models.CharField(max_length=20, unique=True)
    description = models.TextField(blank=True, null=True)
    level = models.PositiveSmallIntegerField(default=0, help_text=_('Hierarchy level (higher number = higher position)'))

    class Meta:
        verbose_name = _('Position')
        verbose_name_plural = _('Positions')
        ordering = ['-level', 'name']

    def __str__(self):
        return self.name


class ProductCategory(BaseModel):
    """Product category model."""
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True, null=True)

    class Meta:
        verbose_name = _('Product Category')
        verbose_name_plural = _('Product Categories')
        ordering = ['name']

    def __str__(self):
        return self.name


class Product(BaseModel):
    """Product model."""
    name = models.CharField(max_length=100)
    code = models.CharField(max_length=20, unique=True)
    description = models.TextField(blank=True, null=True)
    category = models.ForeignKey(ProductCategory, on_delete=models.CASCADE, related_name='products')
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)
    unit = models.CharField(max_length=20, default='Each')
    is_prescription_required = models.BooleanField(default=False)

    class Meta:
        verbose_name = _('Product')
        verbose_name_plural = _('Products')
        ordering = ['name']
        unique_together = ['name', 'category']

    def __str__(self):
        return f"{self.name} ({self.code})"


class LeaveType(BaseModel):
    """Leave type model."""
    name = models.CharField(max_length=100, unique=True)
    code = models.CharField(max_length=20, unique=True)
    description = models.TextField(blank=True, null=True)
    max_days_per_year = models.PositiveSmallIntegerField(default=0, help_text=_('Maximum days allowed per year (0 = unlimited)'))
    is_paid = models.BooleanField(default=True)
    requires_approval = models.BooleanField(default=True)

    class Meta:
        verbose_name = _('Leave Type')
        verbose_name_plural = _('Leave Types')
        ordering = ['name']

    def __str__(self):
        return self.name


class ExpenseType(BaseModel):
    """Expense type model."""
    name = models.CharField(max_length=100, unique=True)
    code = models.CharField(max_length=20, unique=True)
    description = models.TextField(blank=True, null=True)
    max_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0, help_text=_('Maximum amount allowed (0 = unlimited)'))
    requires_receipt = models.BooleanField(default=True)

    class Meta:
        verbose_name = _('Expense Type')
        verbose_name_plural = _('Expense Types')
        ordering = ['name']

    def __str__(self):
        return self.name


class Holiday(BaseModel):
    """Holiday model."""
    name = models.CharField(max_length=100)
    date = models.DateField()
    description = models.TextField(blank=True, null=True)
    is_national = models.BooleanField(default=True, help_text=_('National or regional holiday'))
    territories = models.ManyToManyField(Territory, blank=True, related_name='holidays', help_text=_('Applicable territories (empty = all)'))

    class Meta:
        verbose_name = _('Holiday')
        verbose_name_plural = _('Holidays')
        ordering = ['date']
        unique_together = ['name', 'date']

    def __str__(self):
        return f"{self.name} ({self.date.strftime('%d-%b-%Y')})"


class DoctorSpecialty(BaseModel):
    """Doctor specialty model."""
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True, null=True)

    class Meta:
        verbose_name = _('Doctor Specialty')
        verbose_name_plural = _('Doctor Specialties')
        ordering = ['name']

    def __str__(self):
        return self.name


class ChemistCategory(BaseModel):
    """Chemist category model."""
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True, null=True)

    class Meta:
        verbose_name = _('Chemist Category')
        verbose_name_plural = _('Chemist Categories')
        ordering = ['name']

    def __str__(self):
        return self.name


class StockistCategory(BaseModel):
    """Stockist category model."""
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True, null=True)

    class Meta:
        verbose_name = _('Stockist Category')
        verbose_name_plural = _('Stockist Categories')
        ordering = ['name']

    def __str__(self):
        return self.name


class Doctor(BaseModel):
    """Doctor model for healthcare professionals targeted by MRs."""
    name = models.CharField(_('Name'), max_length=100)
    specialty = models.ForeignKey(
        DoctorSpecialty,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='doctors',
        verbose_name=_('Specialty')
    )
    location = models.TextField(_('Location'), blank=True, null=True)
    contact_number = models.CharField(_('Contact Number'), max_length=20, blank=True, null=True)
    email = models.EmailField(_('Email'), blank=True, null=True)
    added_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='added_doctors',
        verbose_name=_('Added By')
    )

    class Meta:
        verbose_name = _('Doctor')
        verbose_name_plural = _('Doctors')
        ordering = ['name']
        unique_together = ['name', 'added_by']

    def __str__(self):
        specialty_name = self.specialty.name if self.specialty else 'Unknown'
        return f"{self.name} ({specialty_name})"


class Chemist(BaseModel):
    """Chemist model for pharmacies visited by MRs."""
    name = models.CharField(_('Name'), max_length=100)
    category = models.ForeignKey(
        ChemistCategory,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='chemists',
        verbose_name=_('Category')
    )
    location = models.TextField(_('Location'), blank=True, null=True)
    contact_number = models.CharField(_('Contact Number'), max_length=20, blank=True, null=True)
    email = models.EmailField(_('Email'), blank=True, null=True)
    added_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='added_chemists',
        verbose_name=_('Added By')
    )

    class Meta:
        verbose_name = _('Chemist')
        verbose_name_plural = _('Chemists')
        ordering = ['name']
        unique_together = ['name', 'added_by']

    def __str__(self):
        category_name = self.category.name if self.category else 'Unknown'
        return f"{self.name} ({category_name})"

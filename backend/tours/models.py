from django.db import models
from django.utils.translation import gettext_lazy as _
from django.conf import settings
from masters.models import BaseModel
import calendar
from django.core.validators import MinValueValidator, MaxValueValidator


class TourProgram(BaseModel):
    """Model for tour programs submitted by users."""
    
    STATUS_CHOICES = (
        ('draft', 'Draft'),
        ('submitted', 'Submitted'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    )
    
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='tour_programs',
        verbose_name=_('User')
    )
    month = models.IntegerField(
        _('Month'),
        validators=[MinValueValidator(1), MaxValueValidator(12)]
    )
    year = models.IntegerField(_('Year'))
    area_details = models.TextField(_('Area Details'))
    status = models.CharField(
        _('Status'),
        max_length=10,
        choices=STATUS_CHOICES,
        default='draft'
    )
    submitted_at = models.DateTimeField(_('Submitted At'), null=True, blank=True)
    reviewed_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        related_name='reviewed_tours',
        verbose_name=_('Reviewed By'),
        null=True,
        blank=True
    )
    reviewed_at = models.DateTimeField(_('Reviewed At'), null=True, blank=True)
    manager_comments = models.TextField(_('Manager Comments'), null=True, blank=True)
    
    class Meta:
        verbose_name = _('Tour Program')
        verbose_name_plural = _('Tour Programs')
        ordering = ['-year', '-month']
        unique_together = ['user', 'month', 'year']
    
    def __str__(self):
        return f"{self.user} - {self.month_name} {self.year}"
    
    @property
    def month_name(self):
        """Return the month name."""
        return calendar.month_name[self.month]

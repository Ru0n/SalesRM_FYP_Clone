from django.db import models
from django.utils.translation import gettext_lazy as _
from django.conf import settings
from masters.models import BaseModel, Doctor, Chemist


class DailyCallReport(BaseModel):
    """Model for daily call reports submitted by MRs."""

    WORK_TYPE_CHOICES = (
        ('field_work', 'Field Work'),
        ('office_work', 'Office Work'),
        ('leave', 'Leave'),
        ('holiday', 'Holiday'),
    )

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='daily_call_reports',
        verbose_name=_('User')
    )
    date = models.DateField(_('Date'))
    work_type = models.CharField(
        _('Work Type'),
        max_length=20,
        choices=WORK_TYPE_CHOICES,
        default='field_work'
    )
    summary = models.TextField(_('Summary'))
    doctors_visited = models.ManyToManyField(
        Doctor,
        blank=True,
        related_name='dcr_visits',
        verbose_name=_('Doctors Visited')
    )
    chemists_visited = models.ManyToManyField(
        Chemist,
        blank=True,
        related_name='dcr_visits',
        verbose_name=_('Chemists Visited')
    )
    submitted_at = models.DateTimeField(_('Submitted At'), auto_now_add=True)

    class Meta:
        verbose_name = _('Daily Call Report')
        verbose_name_plural = _('Daily Call Reports')
        ordering = ['-date', '-submitted_at']
        unique_together = ['user', 'date']

    def __str__(self):
        return f"{self.user} - {self.date} - {self.get_work_type_display()}"

    @property
    def days_count(self):
        """Return the number of days (always 1 for DCR)."""
        return 1

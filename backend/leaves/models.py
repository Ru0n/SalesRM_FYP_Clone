from django.db import models
from django.utils.translation import gettext_lazy as _
from django.conf import settings
from masters.models import LeaveType, BaseModel


class LeaveRequest(BaseModel):
    """Model for leave requests submitted by users."""
    
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
        ('cancelled', 'Cancelled'),
    )
    
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='leave_requests',
        verbose_name=_('User')
    )
    leave_type = models.ForeignKey(
        LeaveType,
        on_delete=models.PROTECT,
        related_name='leave_requests',
        verbose_name=_('Leave Type')
    )
    start_date = models.DateField(_('Start Date'))
    end_date = models.DateField(_('End Date'))
    reason = models.TextField(_('Reason'))
    status = models.CharField(
        _('Status'),
        max_length=10,
        choices=STATUS_CHOICES,
        default='pending'
    )
    requested_at = models.DateTimeField(_('Requested At'), auto_now_add=True)
    reviewed_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        related_name='reviewed_leaves',
        verbose_name=_('Reviewed By'),
        null=True,
        blank=True
    )
    reviewed_at = models.DateTimeField(_('Reviewed At'), null=True, blank=True)
    manager_comments = models.TextField(_('Manager Comments'), null=True, blank=True)
    
    class Meta:
        verbose_name = _('Leave Request')
        verbose_name_plural = _('Leave Requests')
        ordering = ['-requested_at']
    
    def __str__(self):
        return f"{self.user} - {self.leave_type} ({self.start_date} to {self.end_date})"
    
    @property
    def days_count(self):
        """Calculate the number of days requested."""
        delta = self.end_date - self.start_date
        return delta.days + 1  # Include both start and end dates
from django.db import models
from django.utils.translation import gettext_lazy as _
from django.conf import settings
from masters.models import ExpenseType, BaseModel


class ExpenseClaim(BaseModel):
    """Model for expense claims submitted by users."""

    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
        ('queried', 'Queried'),
    )

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='expense_claims',
        verbose_name=_('User')
    )
    expense_type = models.ForeignKey(
        ExpenseType,
        on_delete=models.PROTECT,
        related_name='expense_claims',
        verbose_name=_('Expense Type')
    )
    amount = models.DecimalField(
        _('Amount'),
        max_digits=10,
        decimal_places=2
    )
    date = models.DateField(_('Date Incurred'))
    description = models.TextField(_('Description'))
    status = models.CharField(
        _('Status'),
        max_length=10,
        choices=STATUS_CHOICES,
        default='pending'
    )
    submitted_at = models.DateTimeField(_('Submitted At'), auto_now_add=True)
    reviewed_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        related_name='reviewed_expenses',
        verbose_name=_('Reviewed By'),
        null=True,
        blank=True
    )
    reviewed_at = models.DateTimeField(_('Reviewed At'), null=True, blank=True)
    manager_comments = models.TextField(_('Manager Comments'), null=True, blank=True)
    attachment = models.FileField(
        _('Attachment'),
        upload_to='expense_attachments/',
        null=True,
        blank=True
    )

    class Meta:
        verbose_name = _('Expense Claim')
        verbose_name_plural = _('Expense Claims')
        ordering = ['-submitted_at']

    def __str__(self):
        return f"{self.user} - {self.expense_type} ({self.date}) - {self.amount}"

from django.db import models
from django.utils.translation import gettext_lazy as _
from django.conf import settings
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType


class Notification(models.Model):
    """Model for storing user notifications."""
    
    LEVEL_CHOICES = (
        ('info', 'Info'),
        ('success', 'Success'),
        ('warning', 'Warning'),
        ('error', 'Error'),
    )
    
    # Who receives the notification
    recipient = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='notifications',
        verbose_name=_('Recipient'),
        db_index=True
    )
    
    # Who performed the action (User or System)
    actor_content_type = models.ForeignKey(
        ContentType,
        on_delete=models.CASCADE,
        related_name='actor_notifications',
        null=True,
        blank=True
    )
    actor_object_id = models.PositiveIntegerField(null=True, blank=True)
    actor = GenericForeignKey('actor_content_type', 'actor_object_id')
    
    # Description of the action
    verb = models.CharField(_('Verb'), max_length=100)
    
    # The object that was acted upon (e.g., LeaveRequest, ExpenseClaim)
    target_content_type = models.ForeignKey(
        ContentType,
        on_delete=models.CASCADE,
        related_name='target_notifications',
        null=True,
        blank=True
    )
    target_object_id = models.PositiveIntegerField(null=True, blank=True)
    target = GenericForeignKey('target_content_type', 'target_object_id')
    
    # Additional related object (e.g., a comment)
    action_object_content_type = models.ForeignKey(
        ContentType,
        on_delete=models.CASCADE,
        related_name='action_object_notifications',
        null=True,
        blank=True
    )
    action_object_object_id = models.PositiveIntegerField(null=True, blank=True)
    action_object = GenericForeignKey('action_object_content_type', 'action_object_object_id')
    
    # Metadata
    timestamp = models.DateTimeField(_('Timestamp'), auto_now_add=True, db_index=True)
    unread = models.BooleanField(_('Unread'), default=True, db_index=True)
    level = models.CharField(_('Level'), max_length=10, choices=LEVEL_CHOICES, default='info')
    
    class Meta:
        ordering = ['-timestamp']
        verbose_name = _('Notification')
        verbose_name_plural = _('Notifications')
    
    def __str__(self):
        ctx = {
            'actor': self.actor,
            'verb': self.verb,
            'target': self.target,
            'timestamp': self.timestamp
        }
        if self.target:
            return "{actor} {verb} {target} at {timestamp}".format(**ctx)
        return "{actor} {verb} at {timestamp}".format(**ctx)

from django.contrib.contenttypes.models import ContentType
from .models import Notification


def create_notification(recipient, actor, verb, target=None, action_object=None, level='info', force=False):
    """
    Create a notification for a user.
    
    Args:
        recipient: User who will receive the notification
        actor: User or object that performed the action
        verb: Description of the action (e.g., 'approved', 'submitted')
        target: Object that was acted upon (e.g., LeaveRequest, ExpenseClaim)
        action_object: Additional related object (e.g., a comment)
        level: Notification level ('info', 'success', 'warning', 'error')
        force: Force creation even if actor == recipient
    
    Returns:
        The created Notification object
    """
    # Avoid notifying users about their own actions unless necessary or forced
    if not force and hasattr(actor, 'pk') and hasattr(recipient, 'pk') and actor.pk == recipient.pk:
        return None
    
    # Create notification
    notification = Notification(
        recipient=recipient,
        verb=verb,
        level=level
    )
    
    # Set actor if provided
    if actor:
        actor_content_type = ContentType.objects.get_for_model(actor)
        notification.actor_content_type = actor_content_type
        notification.actor_object_id = actor.pk
    
    # Set target if provided
    if target:
        target_content_type = ContentType.objects.get_for_model(target)
        notification.target_content_type = target_content_type
        notification.target_object_id = target.pk
    
    # Set action_object if provided
    if action_object:
        action_object_content_type = ContentType.objects.get_for_model(action_object)
        notification.action_object_content_type = action_object_content_type
        notification.action_object_object_id = action_object.pk
    
    notification.save()
    return notification
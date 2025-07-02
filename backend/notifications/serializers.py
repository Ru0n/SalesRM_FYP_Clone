from rest_framework import serializers
from django.contrib.contenttypes.models import ContentType
from users.serializers import UserSerializer
from .models import Notification


class NotificationSerializer(serializers.ModelSerializer):
    """Serializer for the Notification model."""
    
    recipient_details = UserSerializer(source='recipient', read_only=True)
    actor_details = serializers.SerializerMethodField()
    target_details = serializers.SerializerMethodField()
    action_object_details = serializers.SerializerMethodField()
    
    class Meta:
        model = Notification
        fields = [
            'id', 'recipient', 'recipient_details', 'actor_details',
            'verb', 'target_details', 'action_object_details',
            'timestamp', 'unread', 'level'
        ]
        read_only_fields = [
            'id', 'recipient', 'recipient_details', 'actor_details',
            'verb', 'target_details', 'action_object_details',
            'timestamp', 'level'
        ]
    
    def get_actor_details(self, obj):
        """Get details about the actor."""
        if not obj.actor:
            return None
        
        if obj.actor_content_type.model == 'user':
            # If actor is a user, return user details
            return UserSerializer(obj.actor).data
        
        # For other actor types, return basic info
        return {
            'id': obj.actor.pk,
            'type': obj.actor_content_type.model,
            'str': str(obj.actor)
        }
    
    def get_target_details(self, obj):
        """Get details about the target."""
        if not obj.target:
            return None
        
        # Return basic info about the target
        return {
            'id': obj.target.pk,
            'type': obj.target_content_type.model,
            'str': str(obj.target)
        }
    
    def get_action_object_details(self, obj):
        """Get details about the action object."""
        if not obj.action_object:
            return None
        
        # Return basic info about the action object
        return {
            'id': obj.action_object.pk,
            'type': obj.action_object_content_type.model,
            'str': str(obj.action_object)
        }
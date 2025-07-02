from rest_framework import permissions


class IsOwnerOrManager(permissions.BasePermission):
    """
    Custom permission to only allow owners of an object or managers to view it.
    """
    def has_object_permission(self, request, view, obj):
        # Allow admin users full access
        if request.user.is_staff:
            return True
        
        # Allow managers to view all tour programs
        if request.user.role == 'manager':
            return True
        
        # Allow users to view their own tour programs
        return obj.user == request.user


class IsOwner(permissions.BasePermission):
    """
    Custom permission to only allow owners of an object to view or edit it.
    """
    def has_object_permission(self, request, view, obj):
        # Allow admin users full access
        if request.user.is_staff:
            return True
        
        # Allow users to view/edit their own tour programs
        return obj.user == request.user


class IsManager(permissions.BasePermission):
    """
    Custom permission to only allow managers to perform an action.
    """
    def has_permission(self, request, view):
        # Allow admin users full access
        if request.user.is_staff:
            return True
        
        # Allow managers to perform the action
        return request.user.role == 'manager'

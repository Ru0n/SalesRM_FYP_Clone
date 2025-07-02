from rest_framework import permissions


class IsOwnerOrManager(permissions.BasePermission):
    """
    Custom permission to only allow owners of an object or managers to view it.
    """
    def has_object_permission(self, request, view, obj):
        # Allow admin users full access
        if request.user.is_staff:
            return True

        # Allow managers to view all expense claims
        if request.user.role == 'manager':
            return True

        # Allow users to view their own expense claims
        return obj.user == request.user


class IsOwner(permissions.BasePermission):
    """
    Custom permission to only allow owners of an object to view or edit it.
    """
    def has_object_permission(self, request, view, obj):
        # Allow admin users full access
        if request.user.is_staff:
            return True

        # Allow users to view/edit their own expense claims
        return obj.user == request.user


class IsManager(permissions.BasePermission):
    """
    Custom permission to only allow managers to perform certain actions.
    """
    def has_permission(self, request, view):
        # Allow admin users full access
        if request.user.is_staff:
            return True

        # Allow managers to perform actions
        return request.user.role == 'manager'

    def has_object_permission(self, request, view, obj):
        # Allow admin users full access
        if request.user.is_staff:
            return True

        # Allow managers to perform actions
        return request.user.role == 'manager'


class CanApproveExpense(permissions.BasePermission):
    """
    Custom permission to only allow appropriate users to approve expense claims.
    - Managers can approve MR's expense claims
    - Admins can approve Manager's expense claims
    - Superusers can approve any expense claim
    """
    def has_permission(self, request, view):
        # Allow superusers full access
        if request.user.is_superuser:
            return True

        # Allow admins and managers to access the approval endpoints
        return request.user.is_staff or request.user.role == 'manager'

    def has_object_permission(self, request, view, obj):
        # Allow superusers full access
        if request.user.is_superuser:
            return True

        # If the expense claim is from a manager, only admins can approve it
        if obj.user.role == 'manager':
            return request.user.is_staff

        # If the expense claim is from an MR, managers and admins can approve it
        return request.user.role == 'manager' or request.user.is_staff

from rest_framework import permissions


class IsManagerOrAdmin(permissions.BasePermission):
    """
    Custom permission to only allow managers and admins to access analytics.
    """
    
    def has_permission(self, request, view):
        # Allow admin users full access
        if request.user.is_staff or request.user.is_superuser:
            return True
        
        # Allow managers to access analytics
        if request.user.role == 'manager':
            return True
        
        # Deny access to MRs for now (can be modified later to allow self-view)
        return False


class CanViewTeamAnalytics(permissions.BasePermission):
    """
    Permission to check if user can view analytics for specific users.
    """
    
    def has_permission(self, request, view):
        # Allow admin users full access
        if request.user.is_staff or request.user.is_superuser:
            return True
        
        # Allow managers to view their team's analytics
        if request.user.role == 'manager':
            return True
        
        return False

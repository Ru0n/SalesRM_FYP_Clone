from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from .serializers import UserSerializer, UserCreateSerializer

User = get_user_model()


class IsOwnerOrAdmin(permissions.BasePermission):
    """
    Custom permission to only allow owners of an object or admins to access it.
    """
    def has_object_permission(self, request, view, obj):
        # Admin permissions
        if request.user.is_staff:
            return True
        
        # Instance must have an attribute named `user` or be the user themselves
        return obj == request.user


class UserViewSet(viewsets.ModelViewSet):
    """ViewSet for viewing and editing User instances."""
    
    queryset = User.objects.all()
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrAdmin]
    
    def get_serializer_class(self):
        if self.action == 'create':
            return UserCreateSerializer
        return UserSerializer
    
    @action(detail=False, methods=['get'])
    def me(self, request):
        """
        Return the currently authenticated user's information.
        """
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)
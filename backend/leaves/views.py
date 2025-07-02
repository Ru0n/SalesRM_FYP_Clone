from rest_framework import viewsets, permissions, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q

from .models import LeaveRequest
from .serializers import (
    LeaveRequestSerializer, LeaveRequestCreateSerializer,
    LeaveRequestUpdateSerializer, LeaveRequestReviewSerializer,
    LeaveTypeSerializer
)
from .permissions import IsOwnerOrManager, IsOwner, IsManager
from masters.models import LeaveType
from notifications.utils import create_notification


class LeaveTypeViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for viewing LeaveType instances."""
    
    queryset = LeaveType.objects.filter(is_active=True)
    serializer_class = LeaveTypeSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'code']
    ordering_fields = ['name', 'code', 'max_days_per_year']
    ordering = ['name']


class LeaveRequestViewSet(viewsets.ModelViewSet):
    """ViewSet for viewing and editing LeaveRequest instances."""
    
    queryset = LeaveRequest.objects.all()
    serializer_class = LeaveRequestSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrManager]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'leave_type']
    search_fields = ['reason', 'manager_comments']
    ordering_fields = ['start_date', 'end_date', 'requested_at', 'reviewed_at']
    ordering = ['-requested_at']
    
    def get_queryset(self):
        """
        This view should return a list of all leave requests
        for the currently authenticated user or all leave requests
        if the user is a manager or admin.
        """
        user = self.request.user
        
        # Admin users can see all leave requests
        if user.is_staff:
            return LeaveRequest.objects.all()
        
        # Managers can see all leave requests
        if user.role == 'manager':
            return LeaveRequest.objects.all()
        
        # Regular users can only see their own leave requests
        return LeaveRequest.objects.filter(user=user)
    
    def get_serializer_class(self):
        """Return appropriate serializer class based on the action."""
        if self.action == 'create':
            return LeaveRequestCreateSerializer
        elif self.action == 'update' or self.action == 'partial_update':
            return LeaveRequestUpdateSerializer
        elif self.action == 'approve' or self.action == 'reject':
            return LeaveRequestReviewSerializer
        return LeaveRequestSerializer
    
    def perform_create(self, serializer):
        """Set the user when creating a leave request and create notification."""
        leave_request = serializer.save(user=self.request.user)
        
        # Create notification for manager
        user = self.request.user
        managers = [u for u in user._meta.model.objects.filter(role='manager') if u.is_active]
        
        # If there are managers, notify them
        for manager in managers:
            create_notification(
                recipient=manager,
                actor=user,
                verb=f"submitted a leave request from {leave_request.start_date} to {leave_request.end_date}",
                target=leave_request,
                level='info'
            )
    
    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated, IsManager])
    def approve(self, request, pk=None):
        """Approve a leave request."""
        leave_request = self.get_object()
        
        # Check if the leave request is already approved or rejected
        if leave_request.status != 'pending':
            return Response(
                {"detail": f"Leave request is already {leave_request.status}."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Update the leave request
        serializer = self.get_serializer(leave_request, data={
            'status': 'approved',
            'manager_comments': request.data.get('manager_comments', '')
        })
        serializer.is_valid(raise_exception=True)
        leave_request = serializer.save(
            reviewed_by=request.user,
            reviewed_at=timezone.now()
        )
        
        # Create notification for the leave request owner
        create_notification(
            recipient=leave_request.user,
            actor=request.user,
            verb=f"approved your leave request from {leave_request.start_date} to {leave_request.end_date}",
            target=leave_request,
            level='success'
        )
        
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated, IsManager])
    def reject(self, request, pk=None):
        """Reject a leave request."""
        leave_request = self.get_object()
        
        # Check if the leave request is already approved or rejected
        if leave_request.status != 'pending':
            return Response(
                {"detail": f"Leave request is already {leave_request.status}."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Update the leave request
        serializer = self.get_serializer(leave_request, data={
            'status': 'rejected',
            'manager_comments': request.data.get('manager_comments', '')
        })
        serializer.is_valid(raise_exception=True)
        leave_request = serializer.save(
            reviewed_by=request.user,
            reviewed_at=timezone.now()
        )
        
        # Create notification for the leave request owner
        create_notification(
            recipient=leave_request.user,
            actor=request.user,
            verb=f"rejected your leave request from {leave_request.start_date} to {leave_request.end_date}",
            target=leave_request,
            level='warning'
        )
        
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated, IsOwner])
    def cancel(self, request, pk=None):
        """Cancel a leave request."""
        leave_request = self.get_object()
        
        # Check if the leave request is already approved or rejected
        if leave_request.status != 'pending':
            return Response(
                {"detail": f"Leave request is already {leave_request.status} and cannot be cancelled."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Update the leave request
        leave_request.status = 'cancelled'
        leave_request.save()
        
        serializer = self.get_serializer(leave_request)
        return Response(serializer.data)
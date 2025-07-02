from rest_framework import viewsets, permissions, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q

from .models import TourProgram
from .serializers import (
    TourProgramSerializer, TourProgramCreateSerializer,
    TourProgramUpdateSerializer, TourProgramSubmitSerializer,
    TourProgramReviewSerializer
)
from .permissions import IsOwnerOrManager, IsOwner, IsManager
from notifications.utils import create_notification


class TourProgramViewSet(viewsets.ModelViewSet):
    """ViewSet for viewing and editing TourProgram instances."""
    
    queryset = TourProgram.objects.all()
    serializer_class = TourProgramSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrManager]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'month', 'year']
    search_fields = ['area_details', 'manager_comments']
    ordering_fields = ['month', 'year', 'submitted_at', 'reviewed_at']
    ordering = ['-year', '-month']
    
    def get_queryset(self):
        """
        This view should return a list of all tour programs
        for the currently authenticated user or all tour programs
        if the user is a manager or admin.
        """
        user = self.request.user
        
        # Admin users can see all tour programs
        if user.is_staff:
            return TourProgram.objects.all()
        
        # Managers can see all tour programs
        if user.role == 'manager':
            return TourProgram.objects.all()
        
        # Regular users can only see their own tour programs
        return TourProgram.objects.filter(user=user)
    
    def get_serializer_class(self):
        """Return appropriate serializer class based on the action."""
        if self.action == 'create':
            return TourProgramCreateSerializer
        elif self.action in ['update', 'partial_update']:
            return TourProgramUpdateSerializer
        elif self.action == 'submit':
            return TourProgramSubmitSerializer
        elif self.action in ['approve', 'reject']:
            return TourProgramReviewSerializer
        return TourProgramSerializer
    
    def perform_create(self, serializer):
        """Set the user when creating a tour program."""
        serializer.save(user=self.request.user)
    
    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated, IsOwner])
    def submit(self, request, pk=None):
        """Submit a tour program for approval."""
        tour_program = self.get_object()
        
        # Check if the tour program is already submitted, approved, or rejected
        if tour_program.status != 'draft':
            return Response(
                {"detail": f"Tour program is already {tour_program.status}."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Update the tour program
        serializer = self.get_serializer(tour_program, data={'status': 'submitted'})
        serializer.is_valid(raise_exception=True)
        tour_program = serializer.save(submitted_at=timezone.now())
        
        # Create notification for managers
        user = self.request.user
        managers = [u for u in user._meta.model.objects.filter(role='manager') if u.is_active]
        
        # If there are managers, notify them
        for manager in managers:
            create_notification(
                recipient=manager,
                actor=user,
                verb=f"submitted a tour program for {tour_program.month_name} {tour_program.year}",
                target=tour_program,
                level='info'
            )
        
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated, IsManager])
    def approve(self, request, pk=None):
        """Approve a tour program."""
        tour_program = self.get_object()
        
        # Check if the tour program is already approved or rejected
        if tour_program.status != 'submitted':
            return Response(
                {"detail": f"Tour program is already {tour_program.status}."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Update the tour program
        serializer = self.get_serializer(tour_program, data={
            'status': 'approved',
            'manager_comments': request.data.get('manager_comments', '')
        })
        serializer.is_valid(raise_exception=True)
        tour_program = serializer.save(
            reviewed_by=request.user,
            reviewed_at=timezone.now()
        )
        
        # Create notification for the tour program owner
        create_notification(
            recipient=tour_program.user,
            actor=request.user,
            verb=f"approved your tour program for {tour_program.month_name} {tour_program.year}",
            target=tour_program,
            level='success'
        )
        
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated, IsManager])
    def reject(self, request, pk=None):
        """Reject a tour program."""
        tour_program = self.get_object()
        
        # Check if the tour program is already approved or rejected
        if tour_program.status != 'submitted':
            return Response(
                {"detail": f"Tour program is already {tour_program.status}."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Update the tour program
        serializer = self.get_serializer(tour_program, data={
            'status': 'rejected',
            'manager_comments': request.data.get('manager_comments', '')
        })
        serializer.is_valid(raise_exception=True)
        tour_program = serializer.save(
            reviewed_by=request.user,
            reviewed_at=timezone.now()
        )
        
        # Create notification for the tour program owner
        create_notification(
            recipient=tour_program.user,
            actor=request.user,
            verb=f"rejected your tour program for {tour_program.month_name} {tour_program.year}",
            target=tour_program,
            level='warning'
        )
        
        return Response(serializer.data)

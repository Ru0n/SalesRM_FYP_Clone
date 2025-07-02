from rest_framework import viewsets, permissions, filters, status
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q

from .models import DailyCallReport
from .serializers import (
    DailyCallReportSerializer, DailyCallReportCreateSerializer,
    DailyCallReportUpdateSerializer
)
from .permissions import IsOwnerOrManager, IsOwner


class DailyCallReportViewSet(viewsets.ModelViewSet):
    """ViewSet for viewing and editing DailyCallReport instances."""

    queryset = DailyCallReport.objects.all()
    serializer_class = DailyCallReportSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrManager]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['work_type', 'date', 'is_active']
    search_fields = ['summary']
    ordering_fields = ['date', 'submitted_at']
    ordering = ['-date', '-submitted_at']

    def get_queryset(self):
        """
        This view should return a list of all daily call reports
        for the currently authenticated user or all reports
        if the user is a manager or admin.
        """
        user = self.request.user

        # Admin users can see all reports
        if user.is_staff:
            return DailyCallReport.objects.all()

        # Managers can see all reports
        if user.role == 'manager':
            return DailyCallReport.objects.all()

        # Regular users can only see their own reports
        return DailyCallReport.objects.filter(user=user)

    def get_serializer_class(self):
        """Return appropriate serializer class based on the action."""
        if self.action == 'create':
            return DailyCallReportCreateSerializer
        elif self.action in ['update', 'partial_update']:
            return DailyCallReportUpdateSerializer
        return DailyCallReportSerializer

    def perform_create(self, serializer):
        """Set the user when creating a daily call report."""
        serializer.save(user=self.request.user)

from rest_framework import viewsets, permissions, filters
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q

from .models import Doctor, Chemist, DoctorSpecialty, ChemistCategory
from .serializers import (
    DoctorSerializer, DoctorCreateSerializer,
    ChemistSerializer, ChemistCreateSerializer,
    DoctorSpecialtySerializer, ChemistCategorySerializer
)
from .permissions import IsOwnerOrManager, IsOwner


class DoctorSpecialtyViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for viewing DoctorSpecialty instances."""

    queryset = DoctorSpecialty.objects.filter(is_active=True)
    serializer_class = DoctorSpecialtySerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'description']
    ordering_fields = ['name']
    ordering = ['name']


class ChemistCategoryViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for viewing ChemistCategory instances."""

    queryset = ChemistCategory.objects.filter(is_active=True)
    serializer_class = ChemistCategorySerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'description']
    ordering_fields = ['name']
    ordering = ['name']


class DoctorViewSet(viewsets.ModelViewSet):
    """ViewSet for viewing and editing Doctor instances."""

    queryset = Doctor.objects.all()
    serializer_class = DoctorSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrManager]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['specialty', 'is_active']
    search_fields = ['name', 'location', 'contact_number', 'email']
    ordering_fields = ['name', 'specialty__name', 'created_at']
    ordering = ['name']

    def get_queryset(self):
        """
        This view should return a list of all doctors
        for the currently authenticated user or all doctors
        if the user is a manager or admin.
        """
        user = self.request.user

        # Admin users can see all doctors
        if user.is_staff:
            return Doctor.objects.all()

        # Managers can see all doctors
        if user.role == 'manager':
            return Doctor.objects.all()

        # Regular users can only see their own doctors
        return Doctor.objects.filter(added_by=user)

    def get_serializer_class(self):
        """Return appropriate serializer class based on the action."""
        if self.action == 'create':
            return DoctorCreateSerializer
        return DoctorSerializer

    def perform_create(self, serializer):
        """Set the added_by field when creating a doctor."""
        serializer.save(added_by=self.request.user)


class ChemistViewSet(viewsets.ModelViewSet):
    """ViewSet for viewing and editing Chemist instances."""

    queryset = Chemist.objects.all()
    serializer_class = ChemistSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrManager]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'is_active']
    search_fields = ['name', 'location', 'contact_number', 'email']
    ordering_fields = ['name', 'category__name', 'created_at']
    ordering = ['name']

    def get_queryset(self):
        """
        This view should return a list of all chemists
        for the currently authenticated user or all chemists
        if the user is a manager or admin.
        """
        user = self.request.user

        # Admin users can see all chemists
        if user.is_staff:
            return Chemist.objects.all()

        # Managers can see all chemists
        if user.role == 'manager':
            return Chemist.objects.all()

        # Regular users can only see their own chemists
        return Chemist.objects.filter(added_by=user)

    def get_serializer_class(self):
        """Return appropriate serializer class based on the action."""
        if self.action == 'create':
            return ChemistCreateSerializer
        return ChemistSerializer

    def perform_create(self, serializer):
        """Set the added_by field when creating a chemist."""
        serializer.save(added_by=self.request.user)

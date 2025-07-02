from rest_framework import viewsets, permissions, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from django_filters.rest_framework import DjangoFilterBackend
from .models import ExpenseClaim
from .serializers import (
    ExpenseClaimSerializer, ExpenseClaimCreateSerializer,
    ExpenseClaimUpdateSerializer, ExpenseClaimReviewSerializer,
    ExpenseTypeSerializer
)
from .permissions import IsOwnerOrManager, IsOwner, IsManager, CanApproveExpense
from masters.models import ExpenseType
from notifications.utils import create_notification


class ExpenseTypeViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for viewing expense types."""

    queryset = ExpenseType.objects.filter(is_active=True)
    serializer_class = ExpenseTypeSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'code', 'description']
    ordering_fields = ['name', 'code']
    ordering = ['name']


class ExpenseClaimViewSet(viewsets.ModelViewSet):
    """ViewSet for viewing and editing ExpenseClaim instances."""

    queryset = ExpenseClaim.objects.all()
    serializer_class = ExpenseClaimSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrManager]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'expense_type', 'date']
    search_fields = ['description', 'expense_type__name']
    ordering_fields = ['date', 'amount', 'submitted_at', 'status']
    ordering = ['-submitted_at']

    def get_queryset(self):
        """
        Filter queryset based on user role:
        - MRs can only see their own expense claims
        - Managers can see all expense claims
        - Admins can see all expense claims
        """
        user = self.request.user

        if user.is_staff:
            return ExpenseClaim.objects.all()

        if user.role == 'manager':
            # Managers can see all expense claims
            return ExpenseClaim.objects.all()

        # Regular users can only see their own expense claims
        return ExpenseClaim.objects.filter(user=user)

    def get_serializer_class(self):
        """Return appropriate serializer class based on the action."""
        if self.action == 'create':
            return ExpenseClaimCreateSerializer
        elif self.action in ['update', 'partial_update']:
            return ExpenseClaimUpdateSerializer
        elif self.action in ['approve', 'reject', 'query']:
            return ExpenseClaimReviewSerializer
        return ExpenseClaimSerializer

    def perform_create(self, serializer):
        """Set the user when creating an expense claim and create notification."""
        expense_claim = serializer.save(user=self.request.user)
        
        # Create notification for managers
        user = self.request.user
        managers = [u for u in user._meta.model.objects.filter(role='manager') if u.is_active]
        
        # If there are managers, notify them
        for manager in managers:
            create_notification(
                recipient=manager,
                actor=user,
                verb=f"submitted an expense claim for {expense_claim.amount} ({expense_claim.expense_type.name})",
                target=expense_claim,
                level='info'
            )

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated, CanApproveExpense])
    def approve(self, request, pk=None):
        """Approve an expense claim."""
        expense_claim = self.get_object()

        # Check if the expense claim is already approved or rejected
        if expense_claim.status != 'pending' and expense_claim.status != 'queried':
            return Response(
                {"detail": f"Expense claim is already {expense_claim.status}."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Update the expense claim
        serializer = self.get_serializer(expense_claim, data={
            'status': 'approved',
            'manager_comments': request.data.get('manager_comments', '')
        })
        serializer.is_valid(raise_exception=True)
        expense_claim = serializer.save(
            reviewed_by=request.user,
            reviewed_at=timezone.now()
        )
        
        # Create notification for the expense claim owner
        create_notification(
            recipient=expense_claim.user,
            actor=request.user,
            verb=f"approved your expense claim for {expense_claim.amount} ({expense_claim.expense_type.name})",
            target=expense_claim,
            level='success'
        )

        return Response(serializer.data)

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated, CanApproveExpense])
    def reject(self, request, pk=None):
        """Reject an expense claim."""
        expense_claim = self.get_object()

        # Check if the expense claim is already approved or rejected
        if expense_claim.status != 'pending' and expense_claim.status != 'queried':
            return Response(
                {"detail": f"Expense claim is already {expense_claim.status}."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Update the expense claim
        serializer = self.get_serializer(expense_claim, data={
            'status': 'rejected',
            'manager_comments': request.data.get('manager_comments', '')
        })
        serializer.is_valid(raise_exception=True)
        expense_claim = serializer.save(
            reviewed_by=request.user,
            reviewed_at=timezone.now()
        )
        
        # Create notification for the expense claim owner
        create_notification(
            recipient=expense_claim.user,
            actor=request.user,
            verb=f"rejected your expense claim for {expense_claim.amount} ({expense_claim.expense_type.name})",
            target=expense_claim,
            level='warning'
        )

        return Response(serializer.data)

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated, CanApproveExpense])
    def query(self, request, pk=None):
        """Query an expense claim for more information."""
        expense_claim = self.get_object()

        # Check if the expense claim is already approved or rejected
        if expense_claim.status != 'pending':
            return Response(
                {"detail": f"Expense claim is already {expense_claim.status}."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Update the expense claim
        serializer = self.get_serializer(expense_claim, data={
            'status': 'queried',
            'manager_comments': request.data.get('manager_comments', '')
        })
        serializer.is_valid(raise_exception=True)
        expense_claim = serializer.save(
            reviewed_by=request.user,
            reviewed_at=timezone.now()
        )
        
        # Create notification for the expense claim owner
        create_notification(
            recipient=expense_claim.user,
            actor=request.user,
            verb=f"requested more information about your expense claim for {expense_claim.amount} ({expense_claim.expense_type.name})",
            target=expense_claim,
            level='info'
        )

        return Response(serializer.data)

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated, IsOwner])
    def cancel(self, request, pk=None):
        """Cancel an expense claim."""
        expense_claim = self.get_object()

        # Check if the expense claim is already approved or rejected
        if expense_claim.status != 'pending' and expense_claim.status != 'queried':
            return Response(
                {"detail": f"Expense claim is already {expense_claim.status} and cannot be cancelled."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Update the expense claim
        expense_claim.status = 'cancelled'
        expense_claim.save()

        serializer = self.get_serializer(expense_claim)
        return Response(serializer.data)

from rest_framework import generics, permissions, status
from rest_framework.response import Response
from django.db.models import Count, Sum, Q, F, Value, IntegerField, DecimalField
from django.db.models.functions import TruncDate
from django.utils import timezone
from datetime import datetime, timedelta
from collections import defaultdict

from .models import DailyCallReport
from expenses.models import ExpenseClaim
from leaves.models import LeaveRequest
from .report_serializers import DCRSummarySerializer, ExpenseSummarySerializer, LeaveSummarySerializer
from .permissions import IsOwnerOrManager


class DCRSummaryReportAPIView(generics.ListAPIView):
    """API view for DCR summary report."""
    
    serializer_class = DCRSummarySerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrManager]
    
    def get_queryset(self):
        """
        Filter DCRs based on query parameters and user role.
        Returns a queryset of DCRs.
        """
        user = self.request.user
        
        # Get query parameters
        user_id = self.request.query_params.get('user_id')
        start_date = self.request.query_params.get('start_date')
        end_date = self.request.query_params.get('end_date')
        work_type = self.request.query_params.get('work_type')
        
        # Base queryset
        queryset = DailyCallReport.objects.filter(is_active=True)
        
        # Filter by user role
        if user.is_staff or user.role == 'manager':
            # Admin and managers can see all DCRs, but can filter by user
            if user_id:
                queryset = queryset.filter(user_id=user_id)
        else:
            # Regular users can only see their own DCRs
            queryset = queryset.filter(user=user)
        
        # Apply date filters
        if start_date:
            try:
                start_date = datetime.strptime(start_date, '%Y-%m-%d').date()
                queryset = queryset.filter(date__gte=start_date)
            except ValueError:
                pass
        
        if end_date:
            try:
                end_date = datetime.strptime(end_date, '%Y-%m-%d').date()
                queryset = queryset.filter(date__lte=end_date)
            except ValueError:
                pass
        
        # Filter by work type
        if work_type:
            queryset = queryset.filter(work_type=work_type)
        
        return queryset
    
    def list(self, request, *args, **kwargs):
        """
        Override list method to return aggregated data.
        """
        queryset = self.get_queryset()
        
        # Calculate aggregates
        total_dcrs = queryset.count()
        field_work_count = queryset.filter(work_type='field_work').count()
        office_work_count = queryset.filter(work_type='office_work').count()
        leave_count = queryset.filter(work_type='leave').count()
        holiday_count = queryset.filter(work_type='holiday').count()
        
        # Calculate total doctors and chemists visited
        # We need to use distinct() to avoid counting the same doctor/chemist multiple times
        total_doctors_visited = sum(dcr.doctors_visited.count() for dcr in queryset.filter(work_type='field_work'))
        total_chemists_visited = sum(dcr.chemists_visited.count() for dcr in queryset.filter(work_type='field_work'))
        
        # Group DCRs by date
        dcr_by_date = defaultdict(int)
        for dcr in queryset:
            date_str = dcr.date.strftime('%Y-%m-%d')
            dcr_by_date[date_str] += 1
        
        # Prepare data for serializer
        data = {
            'total_dcrs': total_dcrs,
            'field_work_count': field_work_count,
            'office_work_count': office_work_count,
            'leave_count': leave_count,
            'holiday_count': holiday_count,
            'total_doctors_visited': total_doctors_visited,
            'total_chemists_visited': total_chemists_visited,
            'dcr_by_date': dict(dcr_by_date),
        }
        
        # Include detailed DCR data if requested
        if request.query_params.get('detailed') == 'true':
            dcrs = []
            for dcr in queryset.order_by('-date'):
                dcrs.append({
                    'id': dcr.id,
                    'date': dcr.date.strftime('%Y-%m-%d'),
                    'user': dcr.user.get_full_name() or dcr.user.email,
                    'work_type': dcr.get_work_type_display(),
                    'summary': dcr.summary,
                    'doctors_count': dcr.doctors_visited.count(),
                    'chemists_count': dcr.chemists_visited.count(),
                })
            data['dcrs'] = dcrs
        
        serializer = self.get_serializer(data)
        return Response(serializer.data)


class ExpenseSummaryReportAPIView(generics.ListAPIView):
    """API view for expense summary report."""
    
    serializer_class = ExpenseSummarySerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        """
        Filter expense claims based on query parameters and user role.
        Returns a queryset of expense claims.
        """
        user = self.request.user
        
        # Get query parameters
        user_id = self.request.query_params.get('user_id')
        start_date = self.request.query_params.get('start_date')
        end_date = self.request.query_params.get('end_date')
        status = self.request.query_params.get('status')
        expense_type_id = self.request.query_params.get('expense_type')
        
        # Base queryset
        queryset = ExpenseClaim.objects.filter(is_active=True)
        
        # Filter by user role
        if user.is_staff or user.role == 'manager':
            # Admin and managers can see all expense claims, but can filter by user
            if user_id:
                queryset = queryset.filter(user_id=user_id)
        else:
            # Regular users can only see their own expense claims
            queryset = queryset.filter(user=user)
        
        # Apply date filters
        if start_date:
            try:
                start_date = datetime.strptime(start_date, '%Y-%m-%d').date()
                queryset = queryset.filter(date__gte=start_date)
            except ValueError:
                pass
        
        if end_date:
            try:
                end_date = datetime.strptime(end_date, '%Y-%m-%d').date()
                queryset = queryset.filter(date__lte=end_date)
            except ValueError:
                pass
        
        # Filter by status
        if status:
            queryset = queryset.filter(status=status)
        
        # Filter by expense type
        if expense_type_id:
            queryset = queryset.filter(expense_type_id=expense_type_id)
        
        return queryset
    
    def list(self, request, *args, **kwargs):
        """
        Override list method to return aggregated data.
        """
        queryset = self.get_queryset()
        
        # Calculate aggregates
        total_expenses = queryset.count()
        total_amount = queryset.aggregate(total=Sum('amount'))['total'] or 0
        pending_count = queryset.filter(status='pending').count()
        approved_count = queryset.filter(status='approved').count()
        rejected_count = queryset.filter(status='rejected').count()
        queried_count = queryset.filter(status='queried').count()
        
        # Group expenses by type
        expense_by_type = {}
        expense_types = queryset.values('expense_type__name').annotate(total=Sum('amount'))
        for item in expense_types:
            expense_by_type[item['expense_type__name']] = item['total']
        
        # Group expenses by date
        expense_by_date = defaultdict(float)
        for expense in queryset:
            date_str = expense.date.strftime('%Y-%m-%d')
            expense_by_date[date_str] += float(expense.amount)
        
        # Prepare data for serializer
        data = {
            'total_expenses': total_expenses,
            'total_amount': total_amount,
            'pending_count': pending_count,
            'approved_count': approved_count,
            'rejected_count': rejected_count,
            'queried_count': queried_count,
            'expense_by_type': expense_by_type,
            'expense_by_date': dict(expense_by_date),
        }
        
        # Include detailed expense data if requested
        if request.query_params.get('detailed') == 'true':
            expenses = []
            for expense in queryset.order_by('-date'):
                expenses.append({
                    'id': expense.id,
                    'date': expense.date.strftime('%Y-%m-%d'),
                    'user': expense.user.get_full_name() or expense.user.email,
                    'expense_type': expense.expense_type.name,
                    'amount': float(expense.amount),
                    'status': expense.status,
                    'description': expense.description,
                })
            data['expenses'] = expenses
        
        serializer = self.get_serializer(data)
        return Response(serializer.data)


class LeaveSummaryReportAPIView(generics.ListAPIView):
    """API view for leave summary report."""
    
    serializer_class = LeaveSummarySerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        """
        Filter leave requests based on query parameters and user role.
        Returns a queryset of leave requests.
        """
        user = self.request.user
        
        # Get query parameters
        user_id = self.request.query_params.get('user_id')
        start_date = self.request.query_params.get('start_date')
        end_date = self.request.query_params.get('end_date')
        status = self.request.query_params.get('status')
        leave_type_id = self.request.query_params.get('leave_type')
        
        # Base queryset
        queryset = LeaveRequest.objects.filter(is_active=True)
        
        # Filter by user role
        if user.is_staff or user.role == 'manager':
            # Admin and managers can see all leave requests, but can filter by user
            if user_id:
                queryset = queryset.filter(user_id=user_id)
        else:
            # Regular users can only see their own leave requests
            queryset = queryset.filter(user=user)
        
        # Apply date filters
        if start_date:
            try:
                start_date = datetime.strptime(start_date, '%Y-%m-%d').date()
                queryset = queryset.filter(start_date__gte=start_date)
            except ValueError:
                pass
        
        if end_date:
            try:
                end_date = datetime.strptime(end_date, '%Y-%m-%d').date()
                queryset = queryset.filter(end_date__lte=end_date)
            except ValueError:
                pass
        
        # Filter by status
        if status:
            queryset = queryset.filter(status=status)
        
        # Filter by leave type
        if leave_type_id:
            queryset = queryset.filter(leave_type_id=leave_type_id)
        
        return queryset
    
    def list(self, request, *args, **kwargs):
        """
        Override list method to return aggregated data.
        """
        queryset = self.get_queryset()
        
        # Calculate aggregates
        total_leaves = queryset.count()
        total_days = sum((leave.end_date - leave.start_date).days + 1 for leave in queryset)
        pending_count = queryset.filter(status='pending').count()
        approved_count = queryset.filter(status='approved').count()
        rejected_count = queryset.filter(status='rejected').count()
        cancelled_count = queryset.filter(status='cancelled').count()
        
        # Group leaves by type
        leave_by_type = {}
        leave_types = queryset.values('leave_type__name').annotate(count=Count('id'))
        for item in leave_types:
            leave_by_type[item['leave_type__name']] = item['count']
        
        # Group leaves by date (start date)
        leave_by_date = defaultdict(int)
        for leave in queryset:
            date_str = leave.start_date.strftime('%Y-%m-%d')
            leave_by_date[date_str] += 1
        
        # Prepare data for serializer
        data = {
            'total_leaves': total_leaves,
            'total_days': total_days,
            'pending_count': pending_count,
            'approved_count': approved_count,
            'rejected_count': rejected_count,
            'cancelled_count': cancelled_count,
            'leave_by_type': leave_by_type,
            'leave_by_date': dict(leave_by_date),
        }
        
        # Include detailed leave data if requested
        if request.query_params.get('detailed') == 'true':
            leaves = []
            for leave in queryset.order_by('-start_date'):
                days = (leave.end_date - leave.start_date).days + 1
                leaves.append({
                    'id': leave.id,
                    'start_date': leave.start_date.strftime('%Y-%m-%d'),
                    'end_date': leave.end_date.strftime('%Y-%m-%d'),
                    'days': days,
                    'user': leave.user.get_full_name() or leave.user.email,
                    'leave_type': leave.leave_type.name,
                    'status': leave.status,
                    'reason': leave.reason,
                })
            data['leaves'] = leaves
        
        serializer = self.get_serializer(data)
        return Response(serializer.data)

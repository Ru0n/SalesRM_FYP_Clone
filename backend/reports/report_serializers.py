from rest_framework import serializers
from django.db.models import Count, Sum, Avg, Q
from django.utils import timezone
from .models import DailyCallReport
from expenses.models import ExpenseClaim
from leaves.models import LeaveRequest
from users.serializers import UserSerializer
from masters.serializers import DoctorSerializer, ChemistSerializer
from expenses.serializers import ExpenseTypeSerializer
from leaves.serializers import LeaveTypeSerializer
from masters.models import LeaveType, ExpenseType


class DCRSummarySerializer(serializers.Serializer):
    """Serializer for DCR summary data."""

    total_dcrs = serializers.IntegerField()
    field_work_count = serializers.IntegerField()
    office_work_count = serializers.IntegerField()
    leave_count = serializers.IntegerField()
    holiday_count = serializers.IntegerField()
    total_doctors_visited = serializers.IntegerField()
    total_chemists_visited = serializers.IntegerField()
    dcr_by_date = serializers.DictField(child=serializers.IntegerField())

    # Additional fields for detailed view
    dcrs = serializers.ListField(child=serializers.DictField(), required=False)


class ExpenseSummarySerializer(serializers.Serializer):
    """Serializer for expense summary data."""

    total_expenses = serializers.IntegerField()
    total_amount = serializers.DecimalField(max_digits=10, decimal_places=2)
    pending_count = serializers.IntegerField()
    approved_count = serializers.IntegerField()
    rejected_count = serializers.IntegerField()
    queried_count = serializers.IntegerField()
    expense_by_type = serializers.DictField(child=serializers.DecimalField(max_digits=10, decimal_places=2))
    expense_by_date = serializers.DictField(child=serializers.DecimalField(max_digits=10, decimal_places=2))

    # Additional fields for detailed view
    expenses = serializers.ListField(child=serializers.DictField(), required=False)


class LeaveSummarySerializer(serializers.Serializer):
    """Serializer for leave summary data."""

    total_leaves = serializers.IntegerField()
    total_days = serializers.IntegerField()
    pending_count = serializers.IntegerField()
    approved_count = serializers.IntegerField()
    rejected_count = serializers.IntegerField()
    cancelled_count = serializers.IntegerField()
    leave_by_type = serializers.DictField(child=serializers.IntegerField())
    leave_by_date = serializers.DictField(child=serializers.IntegerField())

    # Additional fields for detailed view
    leaves = serializers.ListField(child=serializers.DictField(), required=False)

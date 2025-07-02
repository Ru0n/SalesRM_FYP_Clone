from rest_framework import serializers
from users.serializers import UserSerializer


class PerformanceKPISerializer(serializers.Serializer):
    """Serializer for individual KPI metrics."""
    
    dcr_compliance = serializers.FloatField(help_text="DCR compliance percentage (0-100)")
    call_average = serializers.FloatField(help_text="Average calls per field work day")
    tp_submission = serializers.FloatField(help_text="Tour program submission score (0-100)")
    expense_efficiency = serializers.FloatField(help_text="Expense efficiency score (0-100)")
    
    # Raw data for transparency
    total_dcrs = serializers.IntegerField(help_text="Total DCRs submitted")
    working_days = serializers.IntegerField(help_text="Total working days in period")
    field_work_days = serializers.IntegerField(help_text="Total field work days")
    total_doctors_visited = serializers.IntegerField(help_text="Total unique doctors visited")
    total_chemists_visited = serializers.IntegerField(help_text="Total unique chemists visited")
    total_expense_amount = serializers.DecimalField(max_digits=10, decimal_places=2, help_text="Total approved expenses")
    tp_submitted = serializers.BooleanField(help_text="Whether TP was submitted for the period")


class UserPerformanceSerializer(serializers.Serializer):
    """Serializer for user performance data."""
    
    user = UserSerializer(read_only=True)
    performance_score = serializers.FloatField(help_text="Overall weighted performance score (0-100)")
    rank = serializers.IntegerField(help_text="Rank among peers")
    kpis = PerformanceKPISerializer(help_text="Individual KPI breakdown")


class PerformanceReportSerializer(serializers.Serializer):
    """Serializer for the complete performance report."""
    
    period_start = serializers.DateField(help_text="Report period start date")
    period_end = serializers.DateField(help_text="Report period end date")
    total_users = serializers.IntegerField(help_text="Total users in the report")
    performances = UserPerformanceSerializer(many=True, help_text="Performance data for all users")


class TopPerformersSerializer(serializers.Serializer):
    """Serializer for top performers widget."""
    
    user = UserSerializer(read_only=True)
    performance_score = serializers.FloatField()
    rank = serializers.IntegerField()

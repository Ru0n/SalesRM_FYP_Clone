from datetime import datetime, timedelta
from django.db.models import Count, Sum, Q, Avg
from django.utils import timezone
from decimal import Decimal

from users.models import User
from reports.models import DailyCallReport
from tours.models import TourProgram
from leaves.models import LeaveRequest
from expenses.models import ExpenseClaim
from masters.models import Holiday


class PerformanceCalculator:
    """
    Utility class to calculate performance metrics for users.
    """
    
    # KPI Weights
    DCR_COMPLIANCE_WEIGHT = 0.4  # 40%
    CALL_AVERAGE_WEIGHT = 0.3    # 30%
    TP_SUBMISSION_WEIGHT = 0.1   # 10%
    EXPENSE_EFFICIENCY_WEIGHT = 0.2  # 20%
    
    def __init__(self, start_date, end_date):
        self.start_date = start_date
        self.end_date = end_date
        self.date_range_days = (end_date - start_date).days + 1
    
    def get_working_days(self, user, exclude_leaves=True):
        """
        Calculate working days for a user in the given period.
        Excludes weekends, holidays, and approved leaves.
        """
        total_days = self.date_range_days
        
        # Get holidays in the period
        holidays = Holiday.objects.filter(
            date__range=[self.start_date, self.end_date],
            is_active=True
        ).count()
        
        # Get approved leave days
        leave_days = 0
        if exclude_leaves:
            approved_leaves = LeaveRequest.objects.filter(
                user=user,
                status='approved',
                start_date__lte=self.end_date,
                end_date__gte=self.start_date
            )
            
            for leave in approved_leaves:
                # Calculate overlap with our date range
                overlap_start = max(leave.start_date, self.start_date)
                overlap_end = min(leave.end_date, self.end_date)
                if overlap_start <= overlap_end:
                    leave_days += (overlap_end - overlap_start).days + 1
        
        # Rough calculation: assume 5 working days per week
        # More sophisticated calculation would check actual weekdays
        working_days = max(1, int(total_days * 5/7) - holidays - leave_days)
        return working_days
    
    def calculate_dcr_compliance(self, user):
        """
        Calculate DCR compliance percentage.
        Formula: (Total DCRs / Working Days) * 100
        """
        dcrs = DailyCallReport.objects.filter(
            user=user,
            date__range=[self.start_date, self.end_date]
        )
        
        total_dcrs = dcrs.count()
        working_days = self.get_working_days(user)
        
        if working_days == 0:
            return 0.0, total_dcrs, working_days
        
        compliance_percentage = min(100.0, (total_dcrs / working_days) * 100)
        return compliance_percentage, total_dcrs, working_days
    
    def calculate_call_average(self, user):
        """
        Calculate average calls per field work day.
        Formula: (Total Unique Doctors + Chemists Visited) / Field Work Days
        """
        field_work_dcrs = DailyCallReport.objects.filter(
            user=user,
            date__range=[self.start_date, self.end_date],
            work_type='field_work'
        )
        
        field_work_days = field_work_dcrs.count()
        
        if field_work_days == 0:
            return 0.0, field_work_days, 0, 0
        
        # Count unique doctors and chemists visited
        total_doctors = 0
        total_chemists = 0
        
        for dcr in field_work_dcrs:
            total_doctors += dcr.doctors_visited.count()
            total_chemists += dcr.chemists_visited.count()
        
        total_calls = total_doctors + total_chemists
        call_average = total_calls / field_work_days if field_work_days > 0 else 0
        
        return call_average, field_work_days, total_doctors, total_chemists
    
    def calculate_tp_submission(self, user):
        """
        Calculate TP submission score.
        Formula: 100 if submitted for the period months, 0 if not
        """
        # Get unique months in the date range
        months_in_range = set()
        current_date = self.start_date
        while current_date <= self.end_date:
            months_in_range.add((current_date.year, current_date.month))
            # Move to next month
            if current_date.month == 12:
                current_date = current_date.replace(year=current_date.year + 1, month=1)
            else:
                current_date = current_date.replace(month=current_date.month + 1)
        
        submitted_months = 0
        for year, month in months_in_range:
            tp_exists = TourProgram.objects.filter(
                user=user,
                year=year,
                month=month,
                status__in=['submitted', 'approved']
            ).exists()
            if tp_exists:
                submitted_months += 1
        
        total_months = len(months_in_range)
        tp_score = (submitted_months / total_months * 100) if total_months > 0 else 0
        
        return tp_score, submitted_months > 0
    
    def calculate_expense_efficiency(self, user, team_users=None):
        """
        Calculate expense efficiency score.
        Formula: Normalized score based on expense per field work day
        Lower expenses = higher score
        """
        field_work_dcrs = DailyCallReport.objects.filter(
            user=user,
            date__range=[self.start_date, self.end_date],
            work_type='field_work'
        )
        
        field_work_days = field_work_dcrs.count()
        
        # Get approved expenses for the period
        approved_expenses = ExpenseClaim.objects.filter(
            user=user,
            date__range=[self.start_date, self.end_date],
            status='approved'
        ).aggregate(total=Sum('amount'))['total'] or Decimal('0')
        
        if field_work_days == 0:
            return 50.0, float(approved_expenses)  # Neutral score if no field work
        
        user_avg_expense = float(approved_expenses) / field_work_days
        
        # Calculate team average for normalization
        if team_users is None:
            team_users = User.objects.filter(role='mr', is_active=True)
        
        team_avg_expenses = []
        for team_user in team_users:
            team_field_work_days = DailyCallReport.objects.filter(
                user=team_user,
                date__range=[self.start_date, self.end_date],
                work_type='field_work'
            ).count()
            
            if team_field_work_days > 0:
                team_expenses = ExpenseClaim.objects.filter(
                    user=team_user,
                    date__range=[self.start_date, self.end_date],
                    status='approved'
                ).aggregate(total=Sum('amount'))['total'] or Decimal('0')
                
                team_avg_expenses.append(float(team_expenses) / team_field_work_days)
        
        if not team_avg_expenses:
            return 50.0, float(approved_expenses)  # Neutral score if no team data
        
        max_team_avg = max(team_avg_expenses)
        
        if max_team_avg == 0:
            return 100.0, float(approved_expenses)  # Perfect score if no expenses
        
        # Normalize: lower expense = higher score
        efficiency_score = max(0.0, (1 - (user_avg_expense / max_team_avg)) * 100)
        
        return efficiency_score, float(approved_expenses)
    
    def calculate_performance_score(self, user, team_users=None):
        """
        Calculate overall weighted performance score for a user.
        """
        # Calculate individual KPIs
        dcr_compliance, total_dcrs, working_days = self.calculate_dcr_compliance(user)
        call_average, field_work_days, total_doctors, total_chemists = self.calculate_call_average(user)
        tp_score, tp_submitted = self.calculate_tp_submission(user)
        expense_efficiency, total_expenses = self.calculate_expense_efficiency(user, team_users)
        
        # Normalize call average to 0-100 scale (assuming 6 calls/day as target = 100)
        call_average_normalized = min(100.0, (call_average / 6.0) * 100) if call_average > 0 else 0
        
        # Calculate weighted score
        performance_score = (
            dcr_compliance * self.DCR_COMPLIANCE_WEIGHT +
            call_average_normalized * self.CALL_AVERAGE_WEIGHT +
            tp_score * self.TP_SUBMISSION_WEIGHT +
            expense_efficiency * self.EXPENSE_EFFICIENCY_WEIGHT
        )
        
        return {
            'performance_score': round(performance_score, 2),
            'kpis': {
                'dcr_compliance': round(dcr_compliance, 2),
                'call_average': round(call_average, 2),
                'tp_submission': round(tp_score, 2),
                'expense_efficiency': round(expense_efficiency, 2),
                'total_dcrs': total_dcrs,
                'working_days': working_days,
                'field_work_days': field_work_days,
                'total_doctors_visited': total_doctors,
                'total_chemists_visited': total_chemists,
                'total_expense_amount': total_expenses,
                'tp_submitted': tp_submitted
            }
        }

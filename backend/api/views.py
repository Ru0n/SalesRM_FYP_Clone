from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.utils import timezone
from django.db.models import Count, Sum, Q
from datetime import timedelta

from users.models import User
from masters.models import Doctor, Chemist, Product, Holiday
from leaves.models import LeaveRequest
from expenses.models import ExpenseClaim
from tours.models import TourProgram


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def dashboard(request):
    """
    Get dashboard data based on user role.
    """
    user = request.user
    role = user.role
    today = timezone.now().date()
    current_month = today.month
    current_year = today.year

    # Common data for all roles
    data = {
        "welcome_message": f"Welcome, {user.first_name or user.email}",
        "role": role,
    }

    # Upcoming events (holidays) for all roles
    upcoming_holidays = Holiday.objects.filter(
        date__gte=today,
        date__lte=today + timedelta(days=7),
        is_active=True
    ).order_by('date')

    data["upcoming_events"] = [
        {
            "date": holiday.date.strftime('%Y-%m-%d'),
            "title": holiday.name,
            "type": "holiday"
        }
        for holiday in upcoming_holidays
    ]

    # Role-specific data
    if role == 'mr':
        # MR-specific data
        doctors_added = Doctor.objects.filter(added_by=user, is_active=True).count()
        chemists_added = Chemist.objects.filter(added_by=user, is_active=True).count()
        pending_leave_requests = LeaveRequest.objects.filter(user=user, status='pending').count()
        pending_expense_claims = ExpenseClaim.objects.filter(user=user, status='pending').count()

        # Current month's tour program
        try:
            tour_program = TourProgram.objects.get(
                user=user,
                month=current_month,
                year=current_year
            )
            tour_program_data = {
                "current_month": current_month,
                "current_year": current_year,
                "status": tour_program.status,
                "area_details": tour_program.area_details
            }
        except TourProgram.DoesNotExist:
            tour_program_data = {
                "current_month": current_month,
                "current_year": current_year,
                "status": "Not submitted",
                "area_details": ""
            }

        data["summary_cards"] = {
            "doctors_added": doctors_added,
            "chemists_added": chemists_added,
            "pending_leave_requests": pending_leave_requests,
            "pending_expense_claims": pending_expense_claims
        }
        data["tour_program"] = tour_program_data

    elif role == 'manager':
        # Manager-specific data
        team_members = User.objects.filter(role='mr', is_active=True).count()
        pending_tp_approvals = TourProgram.objects.filter(status='submitted').count()
        pending_leave_approvals = LeaveRequest.objects.filter(status='pending').count()
        pending_expense_approvals = ExpenseClaim.objects.filter(status='pending').count()

        # Current month's tour program for the manager
        try:
            tour_program = TourProgram.objects.get(
                user=user,
                month=current_month,
                year=current_year
            )
            tour_program_data = {
                "current_month": current_month,
                "current_year": current_year,
                "status": tour_program.status,
                "area_details": tour_program.area_details
            }
        except TourProgram.DoesNotExist:
            tour_program_data = {
                "current_month": current_month,
                "current_year": current_year,
                "status": "Not submitted",
                "area_details": ""
            }

        # Team summary
        total_doctors = Doctor.objects.filter(is_active=True).count()
        total_chemists = Chemist.objects.filter(is_active=True).count()

        data["summary_cards"] = {
            "team_members": team_members,
            "pending_tp_approvals": pending_tp_approvals,
            "pending_leave_approvals": pending_leave_approvals,
            "pending_expense_approvals": pending_expense_approvals
        }
        data["tour_program"] = tour_program_data
        data["team_summary"] = {
            "total_doctors": total_doctors,
            "total_chemists": total_chemists
        }

    elif role == 'admin':
        # Admin-specific data
        total_users = User.objects.count()
        active_users = User.objects.filter(is_active=True).count()
        total_products = Product.objects.filter(is_active=True).count()
        pending_manager_expense_approvals = ExpenseClaim.objects.filter(
            user__role='manager',
            status='pending'
        ).count()

        # System summary
        total_doctors = Doctor.objects.filter(is_active=True).count()
        total_chemists = Chemist.objects.filter(is_active=True).count()
        total_leave_requests = LeaveRequest.objects.count()
        total_expense_claims = ExpenseClaim.objects.count()
        total_tour_programs = TourProgram.objects.count()

        data["summary_cards"] = {
            "total_users": total_users,
            "active_users": active_users,
            "total_products": total_products,
            "pending_manager_expense_approvals": pending_manager_expense_approvals
        }
        data["system_summary"] = {
            "total_doctors": total_doctors,
            "total_chemists": total_chemists,
            "total_leave_requests": total_leave_requests,
            "total_expense_claims": total_expense_claims,
            "total_tour_programs": total_tour_programs
        }

    return Response(data)

from datetime import datetime, timedelta
from django.utils import timezone
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from django.db.models import Q

from users.models import User
from .utils import PerformanceCalculator
from .serializers import (
    PerformanceReportSerializer,
    UserPerformanceSerializer,
    TopPerformersSerializer
)
from .permissions import IsManagerOrAdmin, CanViewTeamAnalytics


class PerformanceReportAPIView(APIView):
    """
    API view to get performance report for users within a date range.
    """
    permission_classes = [permissions.IsAuthenticated, IsManagerOrAdmin]

    def get(self, request):
        # Get query parameters
        start_date_str = request.query_params.get('start_date')
        end_date_str = request.query_params.get('end_date')
        user_id = request.query_params.get('user_id')

        # Default to last 30 days if no dates provided
        if not end_date_str:
            end_date = timezone.now().date()
        else:
            try:
                end_date = datetime.strptime(end_date_str, '%Y-%m-%d').date()
            except ValueError:
                return Response(
                    {'error': 'Invalid end_date format. Use YYYY-MM-DD'},
                    status=status.HTTP_400_BAD_REQUEST
                )

        if not start_date_str:
            start_date = end_date - timedelta(days=30)
        else:
            try:
                start_date = datetime.strptime(start_date_str, '%Y-%m-%d').date()
            except ValueError:
                return Response(
                    {'error': 'Invalid start_date format. Use YYYY-MM-DD'},
                    status=status.HTTP_400_BAD_REQUEST
                )

        if start_date > end_date:
            return Response(
                {'error': 'start_date cannot be after end_date'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Determine which users to analyze
        if request.user.is_staff or request.user.is_superuser:
            # Admin can see all MRs
            if user_id:
                target_users = User.objects.filter(id=user_id, role='mr', is_active=True)
            else:
                target_users = User.objects.filter(role='mr', is_active=True)
        elif request.user.role == 'manager':
            # Manager can see their team members
            if user_id:
                target_users = request.user.get_team_members().filter(id=user_id)
            else:
                target_users = request.user.get_team_members()
        else:
            return Response(
                {'error': 'Permission denied'},
                status=status.HTTP_403_FORBIDDEN
            )

        if not target_users.exists():
            return Response(
                {'error': 'No users found for the given criteria'},
                status=status.HTTP_404_NOT_FOUND
            )

        # Calculate performance for each user
        calculator = PerformanceCalculator(start_date, end_date)
        performances = []

        for user in target_users:
            performance_data = calculator.calculate_performance_score(user, target_users)
            performances.append({
                'user': user,
                'performance_score': performance_data['performance_score'],
                'kpis': performance_data['kpis']
            })

        # Sort by performance score (descending)
        performances.sort(key=lambda x: x['performance_score'], reverse=True)

        # Add rank to each performance
        for i, performance in enumerate(performances):
            performance['rank'] = i + 1

        # Serialize the data
        report_data = {
            'period_start': start_date,
            'period_end': end_date,
            'total_users': len(performances),
            'performances': performances
        }

        serializer = PerformanceReportSerializer(report_data)
        return Response(serializer.data, status=status.HTTP_200_OK)


class TopPerformersAPIView(APIView):
    """
    API view to get top performers for dashboard widget.
    """
    permission_classes = [permissions.IsAuthenticated, IsManagerOrAdmin]

    def get(self, request):
        limit = int(request.query_params.get('limit', 3))
        days = int(request.query_params.get('days', 30))

        end_date = timezone.now().date()
        start_date = end_date - timedelta(days=days)

        # Determine which users to analyze
        if request.user.is_staff or request.user.is_superuser:
            target_users = User.objects.filter(role='mr', is_active=True)
        elif request.user.role == 'manager':
            target_users = request.user.get_team_members()
        else:
            return Response(
                {'error': 'Permission denied'},
                status=status.HTTP_403_FORBIDDEN
            )

        if not target_users.exists():
            return Response([], status=status.HTTP_200_OK)

        # Calculate performance for each user
        calculator = PerformanceCalculator(start_date, end_date)
        performances = []

        for user in target_users:
            performance_data = calculator.calculate_performance_score(user, target_users)
            performances.append({
                'user': user,
                'performance_score': performance_data['performance_score']
            })

        # Sort by performance score (descending) and limit
        performances.sort(key=lambda x: x['performance_score'], reverse=True)
        top_performances = performances[:limit]

        # Add rank
        for i, performance in enumerate(top_performances):
            performance['rank'] = i + 1

        serializer = TopPerformersSerializer(top_performances, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

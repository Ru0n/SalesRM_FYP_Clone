from django.test import TestCase
from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from datetime import datetime, timedelta
from decimal import Decimal

from reports.models import DailyCallReport
from tours.models import TourProgram
from leaves.models import LeaveRequest
from expenses.models import ExpenseClaim
from masters.models import Doctor, Chemist, LeaveType, ExpenseType, Holiday
from .utils import PerformanceCalculator

User = get_user_model()


class PerformanceCalculatorTestCase(TestCase):
    """Test cases for the PerformanceCalculator utility class."""

    def setUp(self):
        # Create test users
        self.manager = User.objects.create_user(
            email='manager@test.com',
            password='testpass123',
            role='manager',
            first_name='Test',
            last_name='Manager'
        )

        self.mr = User.objects.create_user(
            email='mr@test.com',
            password='testpass123',
            role='mr',
            first_name='Test',
            last_name='MR',
            manager=self.manager
        )

        # Create test data
        self.start_date = datetime.now().date() - timedelta(days=30)
        self.end_date = datetime.now().date()

        # Create leave type and expense type
        self.leave_type = LeaveType.objects.create(name='Sick Leave', code='SL')
        self.expense_type = ExpenseType.objects.create(name='Travel', code='TR')

        # Create test doctor and chemist
        self.doctor = Doctor.objects.create(name='Dr. Test', added_by=self.mr)
        self.chemist = Chemist.objects.create(name='Test Pharmacy', added_by=self.mr)

        self.calculator = PerformanceCalculator(self.start_date, self.end_date)

    def test_working_days_calculation(self):
        """Test working days calculation."""
        working_days = self.calculator.get_working_days(self.mr)
        self.assertGreater(working_days, 0)
        self.assertIsInstance(working_days, int)

    def test_dcr_compliance_calculation(self):
        """Test DCR compliance calculation."""
        # Create some DCRs
        for i in range(5):
            DailyCallReport.objects.create(
                user=self.mr,
                date=self.start_date + timedelta(days=i),
                work_type='field_work',
                summary='Test DCR'
            )

        compliance, total_dcrs, working_days = self.calculator.calculate_dcr_compliance(self.mr)

        self.assertEqual(total_dcrs, 5)
        self.assertGreater(working_days, 0)
        self.assertGreaterEqual(compliance, 0)
        self.assertLessEqual(compliance, 100)

    def test_call_average_calculation(self):
        """Test call average calculation."""
        # Create DCR with visits
        dcr = DailyCallReport.objects.create(
            user=self.mr,
            date=self.start_date,
            work_type='field_work',
            summary='Test DCR with visits'
        )
        dcr.doctors_visited.add(self.doctor)
        dcr.chemists_visited.add(self.chemist)

        call_average, field_work_days, total_doctors, total_chemists = self.calculator.calculate_call_average(self.mr)

        self.assertEqual(field_work_days, 1)
        self.assertEqual(total_doctors, 1)
        self.assertEqual(total_chemists, 1)
        self.assertEqual(call_average, 2.0)  # 1 doctor + 1 chemist = 2 calls

    def test_tp_submission_calculation(self):
        """Test TP submission calculation."""
        # Create a tour program for the current month
        current_date = self.start_date
        TourProgram.objects.create(
            user=self.mr,
            month=current_date.month,
            year=current_date.year,
            area_details='Test area',
            status='submitted'
        )

        tp_score, tp_submitted = self.calculator.calculate_tp_submission(self.mr)

        self.assertTrue(tp_submitted)
        self.assertGreater(tp_score, 0)

    def test_expense_efficiency_calculation(self):
        """Test expense efficiency calculation."""
        # Create field work DCR
        DailyCallReport.objects.create(
            user=self.mr,
            date=self.start_date,
            work_type='field_work',
            summary='Test DCR'
        )

        # Create expense claim
        ExpenseClaim.objects.create(
            user=self.mr,
            expense_type=self.expense_type,
            amount=Decimal('1000.00'),
            date=self.start_date,
            description='Test expense',
            status='approved'
        )

        efficiency_score, total_expenses = self.calculator.calculate_expense_efficiency(self.mr)

        self.assertGreaterEqual(efficiency_score, 0)
        self.assertLessEqual(efficiency_score, 100)
        self.assertEqual(total_expenses, 1000.0)

    def test_performance_score_calculation(self):
        """Test overall performance score calculation."""
        # Create comprehensive test data
        dcr = DailyCallReport.objects.create(
            user=self.mr,
            date=self.start_date,
            work_type='field_work',
            summary='Test DCR'
        )
        dcr.doctors_visited.add(self.doctor)

        TourProgram.objects.create(
            user=self.mr,
            month=self.start_date.month,
            year=self.start_date.year,
            area_details='Test area',
            status='submitted'
        )

        ExpenseClaim.objects.create(
            user=self.mr,
            expense_type=self.expense_type,
            amount=Decimal('500.00'),
            date=self.start_date,
            description='Test expense',
            status='approved'
        )

        performance_data = self.calculator.calculate_performance_score(self.mr)

        self.assertIn('performance_score', performance_data)
        self.assertIn('kpis', performance_data)
        self.assertGreaterEqual(performance_data['performance_score'], 0)
        self.assertLessEqual(performance_data['performance_score'], 100)


class PerformanceAPITestCase(APITestCase):
    """Test cases for the Performance Analytics API endpoints."""

    def setUp(self):
        # Create test users
        self.admin = User.objects.create_user(
            email='admin@test.com',
            password='testpass123',
            role='admin',
            is_staff=True,
            first_name='Test',
            last_name='Admin'
        )

        self.manager = User.objects.create_user(
            email='manager@test.com',
            password='testpass123',
            role='manager',
            first_name='Test',
            last_name='Manager'
        )

        self.mr = User.objects.create_user(
            email='mr@test.com',
            password='testpass123',
            role='mr',
            first_name='Test',
            last_name='MR',
            manager=self.manager
        )

        # URLs
        self.performance_report_url = reverse('analytics:performance-report')
        self.top_performers_url = reverse('analytics:top-performers')

    def test_performance_report_access_permissions(self):
        """Test that only managers and admins can access performance reports."""
        # Test unauthenticated access
        response = self.client.get(self.performance_report_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

        # Test MR access (should be denied)
        self.client.force_authenticate(user=self.mr)
        response = self.client.get(self.performance_report_url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        # Test Manager access (should be allowed)
        self.client.force_authenticate(user=self.manager)
        response = self.client.get(self.performance_report_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Test Admin access (should be allowed)
        self.client.force_authenticate(user=self.admin)
        response = self.client.get(self.performance_report_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_top_performers_access_permissions(self):
        """Test that only managers and admins can access top performers."""
        # Test unauthenticated access
        response = self.client.get(self.top_performers_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

        # Test MR access (should be denied)
        self.client.force_authenticate(user=self.mr)
        response = self.client.get(self.top_performers_url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        # Test Manager access (should be allowed)
        self.client.force_authenticate(user=self.manager)
        response = self.client.get(self.top_performers_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Test Admin access (should be allowed)
        self.client.force_authenticate(user=self.admin)
        response = self.client.get(self.top_performers_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_performance_report_date_validation(self):
        """Test date validation in performance report API."""
        self.client.force_authenticate(user=self.manager)

        # Test invalid date format
        response = self.client.get(self.performance_report_url, {
            'start_date': 'invalid-date',
            'end_date': '2024-01-01'
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        # Test start_date after end_date
        response = self.client.get(self.performance_report_url, {
            'start_date': '2024-01-15',
            'end_date': '2024-01-01'
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_performance_report_response_structure(self):
        """Test the structure of performance report response."""
        self.client.force_authenticate(user=self.manager)

        response = self.client.get(self.performance_report_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        data = response.json()
        self.assertIn('period_start', data)
        self.assertIn('period_end', data)
        self.assertIn('total_users', data)
        self.assertIn('performances', data)
        self.assertIsInstance(data['performances'], list)

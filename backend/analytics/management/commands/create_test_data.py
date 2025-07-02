import random
from datetime import datetime, timedelta
from decimal import Decimal
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.utils import timezone

from masters.models import (
    Doctor, Chemist, DoctorSpecialty, ChemistCategory, 
    LeaveType, ExpenseType, Holiday
)
from reports.models import DailyCallReport
from tours.models import TourProgram
from leaves.models import LeaveRequest
from expenses.models import ExpenseClaim

User = get_user_model()


class Command(BaseCommand):
    help = 'Create comprehensive test data for Performance Analytics module'

    def add_arguments(self, parser):
        parser.add_argument(
            '--clear',
            action='store_true',
            help='Clear existing test data before creating new data',
        )
        parser.add_argument(
            '--days',
            type=int,
            default=60,
            help='Number of days of historical data to create (default: 60)',
        )

    def handle(self, *args, **options):
        if options['clear']:
            self.stdout.write('Clearing existing test data...')
            self.clear_test_data()

        self.stdout.write('Creating test data for Performance Analytics...')
        
        # Create basic master data
        self.create_master_data()
        
        # Create user hierarchy
        managers, mrs = self.create_user_hierarchy()
        
        # Create performance data
        self.create_performance_data(mrs, options['days'])
        
        self.stdout.write(
            self.style.SUCCESS(
                f'Successfully created test data for {len(mrs)} MRs under {len(managers)} managers'
            )
        )

    def clear_test_data(self):
        """Clear existing test data"""
        # Clear performance data
        DailyCallReport.objects.filter(user__role='mr').delete()
        TourProgram.objects.filter(user__role='mr').delete()
        LeaveRequest.objects.filter(user__role='mr').delete()
        ExpenseClaim.objects.filter(user__role='mr').delete()
        
        # Clear contacts
        Doctor.objects.filter(added_by__role='mr').delete()
        Chemist.objects.filter(added_by__role='mr').delete()
        
        # Clear test users (keep admin)
        User.objects.filter(role__in=['manager', 'mr']).delete()

    def create_master_data(self):
        """Create basic master data needed for testing"""
        # Create doctor specialties
        specialties = [
            'Cardiology', 'Dermatology', 'Endocrinology', 'Gastroenterology',
            'General Medicine', 'Neurology', 'Orthopedics', 'Pediatrics'
        ]
        for specialty_name in specialties:
            DoctorSpecialty.objects.get_or_create(name=specialty_name)

        # Create chemist categories
        categories = ['Retail Pharmacy', 'Hospital Pharmacy', 'Chain Pharmacy', 'Online Pharmacy']
        for category_name in categories:
            ChemistCategory.objects.get_or_create(name=category_name)

        # Create leave types
        leave_types = [
            ('Sick Leave', 'SL', 12),
            ('Casual Leave', 'CL', 15),
            ('Annual Leave', 'AL', 21),
            ('Emergency Leave', 'EL', 5)
        ]
        for name, code, max_days in leave_types:
            try:
                LeaveType.objects.get_or_create(
                    code=code,
                    defaults={'name': name, 'max_days_per_year': max_days}
                )
            except Exception:
                # Skip if already exists
                pass

        # Create expense types
        expense_types = [
            ('Travel', 'TR', 5000),
            ('Food & Accommodation', 'FA', 3000),
            ('Fuel', 'FL', 2000),
            ('Communication', 'CM', 1000),
            ('Medical', 'MD', 2500)
        ]
        for name, code, max_amount in expense_types:
            try:
                ExpenseType.objects.get_or_create(
                    code=code,
                    defaults={'name': name, 'max_amount': max_amount}
                )
            except Exception:
                # Skip if already exists
                pass

        # Create some holidays
        today = timezone.now().date()
        holidays = [
            (today - timedelta(days=45), 'National Holiday'),
            (today - timedelta(days=30), 'Festival Day'),
            (today - timedelta(days=15), 'Public Holiday'),
        ]
        for date, name in holidays:
            Holiday.objects.get_or_create(
                date=date,
                defaults={'name': name, 'is_national': True}
            )

    def create_user_hierarchy(self):
        """Create managers and MRs with proper hierarchy"""
        managers = []
        mrs = []

        # Create managers
        manager_data = [
            ('John', 'Smith', 'john.smith@company.com', 'North Region'),
            ('Sarah', 'Johnson', 'sarah.johnson@company.com', 'South Region'),
            ('Michael', 'Brown', 'michael.brown@company.com', 'East Region')
        ]

        for first_name, last_name, email, region in manager_data:
            manager = User.objects.create_user(
                email=email,
                password='testpass123',
                first_name=first_name,
                last_name=last_name,
                role='manager'
            )
            managers.append(manager)
            self.stdout.write(f'Created manager: {manager.full_name} ({region})')

        # Create MRs for each manager
        mr_data = [
            # North Region (John Smith's team)
            ('Alice', 'Wilson', 'alice.wilson@company.com', 0),
            ('Bob', 'Davis', 'bob.davis@company.com', 0),
            ('Carol', 'Miller', 'carol.miller@company.com', 0),
            
            # South Region (Sarah Johnson's team)
            ('David', 'Garcia', 'david.garcia@company.com', 1),
            ('Emma', 'Martinez', 'emma.martinez@company.com', 1),
            ('Frank', 'Anderson', 'frank.anderson@company.com', 1),
            
            # East Region (Michael Brown's team)
            ('Grace', 'Taylor', 'grace.taylor@company.com', 2),
            ('Henry', 'Thomas', 'henry.thomas@company.com', 2),
        ]

        for first_name, last_name, email, manager_idx in mr_data:
            mr = User.objects.create_user(
                email=email,
                password='testpass123',
                first_name=first_name,
                last_name=last_name,
                role='mr',
                manager=managers[manager_idx]
            )
            mrs.append(mr)
            self.stdout.write(f'Created MR: {mr.full_name} (Manager: {mr.manager.full_name})')

        return managers, mrs

    def create_performance_data(self, mrs, days):
        """Create comprehensive performance data for all MRs"""
        end_date = timezone.now().date()
        start_date = end_date - timedelta(days=days)

        for mr in mrs:
            self.stdout.write(f'Creating performance data for {mr.full_name}...')
            
            # Create doctors and chemists for this MR
            doctors = self.create_contacts_for_mr(mr, 'doctor')
            chemists = self.create_contacts_for_mr(mr, 'chemist')
            
            # Create DCRs with varied performance levels
            self.create_dcrs_for_mr(mr, start_date, end_date, doctors, chemists)
            
            # Create tour programs
            self.create_tour_programs_for_mr(mr, start_date, end_date)
            
            # Create leave requests
            self.create_leaves_for_mr(mr, start_date, end_date)
            
            # Create expense claims
            self.create_expenses_for_mr(mr, start_date, end_date)

    def create_contacts_for_mr(self, mr, contact_type):
        """Create doctors or chemists for an MR"""
        contacts = []
        
        if contact_type == 'doctor':
            specialties = list(DoctorSpecialty.objects.all())
            names = [
                'Dr. Rajesh Sharma', 'Dr. Priya Patel', 'Dr. Amit Kumar',
                'Dr. Sunita Singh', 'Dr. Vikram Gupta', 'Dr. Meera Joshi',
                'Dr. Ravi Thapa', 'Dr. Kavita Rai'
            ]
            
            for i, name in enumerate(names[:6]):  # 6 doctors per MR
                doctor = Doctor.objects.create(
                    name=name,
                    specialty=random.choice(specialties),
                    location=f'Clinic {i+1}, {mr.manager.first_name} Region',
                    contact_number=f'98{random.randint(10000000, 99999999)}',
                    added_by=mr
                )
                contacts.append(doctor)
                
        else:  # chemist
            categories = list(ChemistCategory.objects.all())
            names = [
                'City Pharmacy', 'Health Plus Pharmacy', 'MediCare Store',
                'Wellness Pharmacy', 'Quick Heal Pharmacy', 'Life Care Pharmacy'
            ]
            
            for i, name in enumerate(names):  # 6 chemists per MR
                chemist = Chemist.objects.create(
                    name=f'{name} - Branch {i+1}',
                    category=random.choice(categories),
                    location=f'Location {i+1}, {mr.manager.first_name} Region',
                    contact_number=f'97{random.randint(10000000, 99999999)}',
                    added_by=mr
                )
                contacts.append(chemist)
        
        return contacts

    def create_dcrs_for_mr(self, mr, start_date, end_date, doctors, chemists):
        """Create DCRs with realistic patterns for performance testing"""
        # Define performance profiles for different MRs
        mr_profiles = {
            'high_performer': {'dcr_rate': 0.95, 'call_rate': 0.8, 'avg_calls': 7},
            'average_performer': {'dcr_rate': 0.75, 'call_rate': 0.6, 'avg_calls': 5},
            'low_performer': {'dcr_rate': 0.55, 'call_rate': 0.4, 'avg_calls': 3},
            'inconsistent': {'dcr_rate': 0.65, 'call_rate': 0.5, 'avg_calls': 4}
        }
        
        # Assign profiles to MRs for variety
        mr_index = list(User.objects.filter(role='mr')).index(mr)
        profile_names = list(mr_profiles.keys())
        profile = mr_profiles[profile_names[mr_index % len(profile_names)]]
        
        current_date = start_date
        while current_date <= end_date:
            # Skip weekends (basic working days simulation)
            if current_date.weekday() < 5:  # Monday = 0, Sunday = 6
                
                # Check if should create DCR based on profile
                if random.random() < profile['dcr_rate']:
                    # Determine work type
                    work_type_weights = [
                        ('field_work', 0.7),
                        ('office_work', 0.2),
                        ('leave', 0.05),
                        ('holiday', 0.05)
                    ]
                    work_type = random.choices(
                        [wt[0] for wt in work_type_weights],
                        weights=[wt[1] for wt in work_type_weights]
                    )[0]
                    
                    dcr = DailyCallReport.objects.create(
                        user=mr,
                        date=current_date,
                        work_type=work_type,
                        summary=f'{work_type.replace("_", " ").title()} activities for {current_date}'
                    )
                    
                    # Add visits for field work
                    if work_type == 'field_work' and random.random() < profile['call_rate']:
                        num_calls = max(1, int(random.gauss(profile['avg_calls'], 1.5)))
                        
                        # Add doctor visits
                        doctor_visits = min(num_calls // 2, len(doctors))
                        if doctor_visits > 0:
                            selected_doctors = random.sample(doctors, doctor_visits)
                            dcr.doctors_visited.set(selected_doctors)
                        
                        # Add chemist visits
                        chemist_visits = min(num_calls - doctor_visits, len(chemists))
                        if chemist_visits > 0:
                            selected_chemists = random.sample(chemists, chemist_visits)
                            dcr.chemists_visited.set(selected_chemists)
            
            current_date += timedelta(days=1)

    def create_tour_programs_for_mr(self, mr, start_date, end_date):
        """Create tour programs for the MR"""
        # Get unique months in the date range
        months = set()
        current_date = start_date
        while current_date <= end_date:
            months.add((current_date.year, current_date.month))
            if current_date.month == 12:
                current_date = current_date.replace(year=current_date.year + 1, month=1, day=1)
            else:
                current_date = current_date.replace(month=current_date.month + 1, day=1)
        
        # Create TPs for most months (simulate some missing submissions)
        for year, month in months:
            if random.random() < 0.85:  # 85% chance of TP submission
                status_weights = [
                    ('submitted', 0.4),
                    ('approved', 0.5),
                    ('draft', 0.1)
                ]
                status = random.choices(
                    [s[0] for s in status_weights],
                    weights=[s[1] for s in status_weights]
                )[0]
                
                TourProgram.objects.create(
                    user=mr,
                    month=month,
                    year=year,
                    area_details=f'Tour plan for {mr.manager.first_name} Region - Month {month}',
                    status=status,
                    submitted_at=timezone.now() if status != 'draft' else None
                )

    def create_leaves_for_mr(self, mr, start_date, end_date):
        """Create leave requests for the MR"""
        leave_types = list(LeaveType.objects.all())
        
        # Create 2-4 leave requests per MR
        num_leaves = random.randint(2, 4)
        
        for _ in range(num_leaves):
            leave_type = random.choice(leave_types)
            
            # Random leave duration (1-5 days)
            duration = random.randint(1, 5)
            leave_start = start_date + timedelta(days=random.randint(0, (end_date - start_date).days - duration))
            leave_end = leave_start + timedelta(days=duration - 1)
            
            # Most leaves are approved
            status = random.choices(['approved', 'pending', 'rejected'], weights=[0.8, 0.15, 0.05])[0]
            
            LeaveRequest.objects.create(
                user=mr,
                leave_type=leave_type,
                start_date=leave_start,
                end_date=leave_end,
                reason=f'{leave_type.name} - Personal reasons',
                status=status,
                reviewed_by=mr.manager if status != 'pending' else None,
                reviewed_at=timezone.now() if status != 'pending' else None
            )

    def create_expenses_for_mr(self, mr, start_date, end_date):
        """Create expense claims for the MR"""
        expense_types = list(ExpenseType.objects.all())
        
        # Create expenses for field work days
        field_work_dcrs = DailyCallReport.objects.filter(
            user=mr,
            work_type='field_work',
            date__range=[start_date, end_date]
        )
        
        # Create expenses for 60-80% of field work days
        for dcr in field_work_dcrs:
            if random.random() < 0.7:  # 70% chance of expense on field work day
                expense_type = random.choice(expense_types)
                
                # Vary expense amounts based on MR performance profile
                mr_index = list(User.objects.filter(role='mr')).index(mr)
                base_amounts = [800, 1200, 1500, 1000]  # Different spending patterns
                base_amount = base_amounts[mr_index % len(base_amounts)]
                
                amount = Decimal(str(random.uniform(base_amount * 0.5, base_amount * 1.5)))
                
                # Most expenses are approved
                status = random.choices(['approved', 'pending', 'rejected'], weights=[0.85, 0.1, 0.05])[0]
                
                ExpenseClaim.objects.create(
                    user=mr,
                    expense_type=expense_type,
                    amount=amount,
                    date=dcr.date,
                    description=f'{expense_type.name} for field work on {dcr.date}',
                    status=status,
                    reviewed_by=mr.manager if status != 'pending' else None,
                    reviewed_at=timezone.now() if status != 'pending' else None
                )

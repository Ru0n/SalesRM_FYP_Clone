import os
import django
from django.core.management.base import BaseCommand
from django.db import transaction
from datetime import datetime
from masters.models import (
    Territory, Position, ProductCategory, Product, 
    LeaveType, ExpenseType, Holiday, DoctorSpecialty,
    ChemistCategory, StockistCategory
)


class Command(BaseCommand):
    help = 'Populates the database with initial master data'

    def handle(self, *args, **kwargs):
        self.stdout.write(self.style.SUCCESS('Starting to populate master data...'))
        
        with transaction.atomic():
            self._create_territories()
            self._create_positions()
            self._create_product_categories_and_products()
            self._create_leave_types()
            self._create_expense_types()
            self._create_holidays()
            self._create_doctor_specialties()
            self._create_chemist_categories()
            self._create_stockist_categories()
        
        self.stdout.write(self.style.SUCCESS('Successfully populated master data!'))
    
    def _create_territories(self):
        self.stdout.write('Creating territories...')
        
        # Create parent territories (regions)
        regions = [
            {'name': 'North Region', 'code': 'NR'},
            {'name': 'South Region', 'code': 'SR'},
            {'name': 'East Region', 'code': 'ER'},
            {'name': 'West Region', 'code': 'WR'},
            {'name': 'Central Region', 'code': 'CR'},
        ]
        
        region_objects = {}
        for region in regions:
            obj, created = Territory.objects.get_or_create(
                name=region['name'],
                defaults={'code': region['code']}
            )
            region_objects[region['code']] = obj
            status = 'Created' if created else 'Already exists'
            self.stdout.write(f'  {status}: {obj}')
        
        # Create child territories (states/provinces)
        states = [
            {'name': 'Delhi', 'code': 'DL', 'parent': 'NR'},
            {'name': 'Haryana', 'code': 'HR', 'parent': 'NR'},
            {'name': 'Punjab', 'code': 'PB', 'parent': 'NR'},
            {'name': 'Tamil Nadu', 'code': 'TN', 'parent': 'SR'},
            {'name': 'Karnataka', 'code': 'KA', 'parent': 'SR'},
            {'name': 'Kerala', 'code': 'KL', 'parent': 'SR'},
            {'name': 'West Bengal', 'code': 'WB', 'parent': 'ER'},
            {'name': 'Odisha', 'code': 'OD', 'parent': 'ER'},
            {'name': 'Maharashtra', 'code': 'MH', 'parent': 'WR'},
            {'name': 'Gujarat', 'code': 'GJ', 'parent': 'WR'},
            {'name': 'Madhya Pradesh', 'code': 'MP', 'parent': 'CR'},
            {'name': 'Uttar Pradesh', 'code': 'UP', 'parent': 'CR'},
        ]
        
        for state in states:
            parent = region_objects.get(state['parent'])
            obj, created = Territory.objects.get_or_create(
                name=state['name'],
                defaults={
                    'code': state['code'],
                    'parent': parent
                }
            )
            status = 'Created' if created else 'Already exists'
            self.stdout.write(f'  {status}: {obj} (Parent: {parent})')
    
    def _create_positions(self):
        self.stdout.write('Creating positions...')
        
        positions = [
            {'name': 'CEO', 'code': 'CEO', 'level': 10},
            {'name': 'National Sales Manager', 'code': 'NSM', 'level': 9},
            {'name': 'Regional Sales Manager', 'code': 'RSM', 'level': 8},
            {'name': 'Area Sales Manager', 'code': 'ASM', 'level': 7},
            {'name': 'Territory Manager', 'code': 'TM', 'level': 6},
            {'name': 'Senior Medical Representative', 'code': 'SMR', 'level': 5},
            {'name': 'Medical Representative', 'code': 'MR', 'level': 4},
            {'name': 'Junior Medical Representative', 'code': 'JMR', 'level': 3},
            {'name': 'Sales Trainee', 'code': 'ST', 'level': 2},
            {'name': 'Admin Staff', 'code': 'ADM', 'level': 1},
        ]
        
        for position in positions:
            obj, created = Position.objects.get_or_create(
                name=position['name'],
                defaults={
                    'code': position['code'],
                    'level': position['level']
                }
            )
            status = 'Created' if created else 'Already exists'
            self.stdout.write(f'  {status}: {obj} (Level: {position["level"]})')
    
    def _create_product_categories_and_products(self):
        self.stdout.write('Creating product categories and products...')
        
        categories = [
            {
                'name': 'Antibiotics',
                'products': [
                    {'name': 'Amoxicillin 500mg', 'code': 'AMOX500', 'unit_price': 120.00, 'is_prescription_required': True},
                    {'name': 'Azithromycin 250mg', 'code': 'AZIT250', 'unit_price': 180.00, 'is_prescription_required': True},
                    {'name': 'Ciprofloxacin 500mg', 'code': 'CIPR500', 'unit_price': 150.00, 'is_prescription_required': True},
                ]
            },
            {
                'name': 'Pain Relief',
                'products': [
                    {'name': 'Paracetamol 500mg', 'code': 'PARA500', 'unit_price': 30.00, 'is_prescription_required': False},
                    {'name': 'Ibuprofen 400mg', 'code': 'IBUP400', 'unit_price': 45.00, 'is_prescription_required': False},
                    {'name': 'Diclofenac 50mg', 'code': 'DICL050', 'unit_price': 60.00, 'is_prescription_required': True},
                ]
            },
            {
                'name': 'Antidiabetics',
                'products': [
                    {'name': 'Metformin 500mg', 'code': 'METF500', 'unit_price': 75.00, 'is_prescription_required': True},
                    {'name': 'Glimepiride 2mg', 'code': 'GLIM002', 'unit_price': 90.00, 'is_prescription_required': True},
                ]
            },
            {
                'name': 'Cardiovascular',
                'products': [
                    {'name': 'Amlodipine 5mg', 'code': 'AMLO005', 'unit_price': 65.00, 'is_prescription_required': True},
                    {'name': 'Atenolol 50mg', 'code': 'ATEN050', 'unit_price': 55.00, 'is_prescription_required': True},
                    {'name': 'Losartan 50mg', 'code': 'LOSA050', 'unit_price': 85.00, 'is_prescription_required': True},
                ]
            },
            {
                'name': 'Vitamins & Supplements',
                'products': [
                    {'name': 'Multivitamin Tablets', 'code': 'MULT001', 'unit_price': 120.00, 'is_prescription_required': False},
                    {'name': 'Calcium + Vitamin D3', 'code': 'CAVD003', 'unit_price': 150.00, 'is_prescription_required': False},
                    {'name': 'Iron + Folic Acid', 'code': 'IRFA001', 'unit_price': 80.00, 'is_prescription_required': False},
                ]
            },
        ]
        
        for category_data in categories:
            category, created = ProductCategory.objects.get_or_create(
                name=category_data['name']
            )
            status = 'Created' if created else 'Already exists'
            self.stdout.write(f'  {status}: Category - {category}')
            
            for product_data in category_data['products']:
                product, created = Product.objects.get_or_create(
                    name=product_data['name'],
                    category=category,
                    defaults={
                        'code': product_data['code'],
                        'unit_price': product_data['unit_price'],
                        'is_prescription_required': product_data['is_prescription_required']
                    }
                )
                status = 'Created' if created else 'Already exists'
                self.stdout.write(f'    {status}: Product - {product}')
    
    def _create_leave_types(self):
        self.stdout.write('Creating leave types...')
        
        leave_types = [
            {'name': 'Casual Leave', 'code': 'CL', 'max_days_per_year': 12, 'is_paid': True},
            {'name': 'Sick Leave', 'code': 'SL', 'max_days_per_year': 10, 'is_paid': True},
            {'name': 'Earned Leave', 'code': 'EL', 'max_days_per_year': 15, 'is_paid': True},
            {'name': 'Maternity Leave', 'code': 'ML', 'max_days_per_year': 180, 'is_paid': True},
            {'name': 'Paternity Leave', 'code': 'PL', 'max_days_per_year': 5, 'is_paid': True},
            {'name': 'Leave Without Pay', 'code': 'LWP', 'max_days_per_year': 0, 'is_paid': False},
        ]
        
        for leave_type in leave_types:
            obj, created = LeaveType.objects.get_or_create(
                name=leave_type['name'],
                defaults={
                    'code': leave_type['code'],
                    'max_days_per_year': leave_type['max_days_per_year'],
                    'is_paid': leave_type['is_paid']
                }
            )
            status = 'Created' if created else 'Already exists'
            self.stdout.write(f'  {status}: {obj} (Max days: {leave_type["max_days_per_year"]}, Paid: {leave_type["is_paid"]})')
    
    def _create_expense_types(self):
        self.stdout.write('Creating expense types...')
        
        expense_types = [
            {'name': 'Travel - Local', 'code': 'TL', 'max_amount': 500.00, 'requires_receipt': False},
            {'name': 'Travel - Outstation', 'code': 'TO', 'max_amount': 5000.00, 'requires_receipt': True},
            {'name': 'Accommodation', 'code': 'ACC', 'max_amount': 3000.00, 'requires_receipt': True},
            {'name': 'Meals', 'code': 'MEAL', 'max_amount': 1000.00, 'requires_receipt': True},
            {'name': 'Phone & Internet', 'code': 'COMM', 'max_amount': 1500.00, 'requires_receipt': True},
            {'name': 'Office Supplies', 'code': 'OFSP', 'max_amount': 2000.00, 'requires_receipt': True},
            {'name': 'Sample Distribution', 'code': 'SAMP', 'max_amount': 0.00, 'requires_receipt': False},
        ]
        
        for expense_type in expense_types:
            obj, created = ExpenseType.objects.get_or_create(
                name=expense_type['name'],
                defaults={
                    'code': expense_type['code'],
                    'max_amount': expense_type['max_amount'],
                    'requires_receipt': expense_type['requires_receipt']
                }
            )
            status = 'Created' if created else 'Already exists'
            self.stdout.write(f'  {status}: {obj} (Max amount: {expense_type["max_amount"]}, Receipt required: {expense_type["requires_receipt"]})')
    
    def _create_holidays(self):
        self.stdout.write('Creating holidays...')
        
        holidays = [
            {'name': 'New Year', 'date': datetime.strptime('2023-01-01', '%Y-%m-%d').date(), 'is_national': True},
            {'name': 'Republic Day', 'date': datetime.strptime('2023-01-26', '%Y-%m-%d').date(), 'is_national': True},
            {'name': 'Holi', 'date': datetime.strptime('2023-03-08', '%Y-%m-%d').date(), 'is_national': True},
            {'name': 'Good Friday', 'date': datetime.strptime('2023-04-07', '%Y-%m-%d').date(), 'is_national': True},
            {'name': 'Independence Day', 'date': datetime.strptime('2023-08-15', '%Y-%m-%d').date(), 'is_national': True},
            {'name': 'Gandhi Jayanti', 'date': datetime.strptime('2023-10-02', '%Y-%m-%d').date(), 'is_national': True},
            {'name': 'Diwali', 'date': datetime.strptime('2023-11-12', '%Y-%m-%d').date(), 'is_national': True},
            {'name': 'Christmas', 'date': datetime.strptime('2023-12-25', '%Y-%m-%d').date(), 'is_national': True},
        ]
        
        for holiday in holidays:
            obj, created = Holiday.objects.get_or_create(
                name=holiday['name'],
                date=holiday['date'],
                defaults={
                    'is_national': holiday['is_national']
                }
            )
            status = 'Created' if created else 'Already exists'
            self.stdout.write(f'  {status}: {obj} (National: {holiday["is_national"]})')
    
    def _create_doctor_specialties(self):
        self.stdout.write('Creating doctor specialties...')
        
        specialties = [
            'General Physician',
            'Cardiologist',
            'Dermatologist',
            'Endocrinologist',
            'Gastroenterologist',
            'Neurologist',
            'Oncologist',
            'Ophthalmologist',
            'Orthopedic Surgeon',
            'Pediatrician',
            'Psychiatrist',
            'Pulmonologist',
            'Urologist',
        ]
        
        for specialty in specialties:
            obj, created = DoctorSpecialty.objects.get_or_create(name=specialty)
            status = 'Created' if created else 'Already exists'
            self.stdout.write(f'  {status}: {obj}')
    
    def _create_chemist_categories(self):
        self.stdout.write('Creating chemist categories...')
        
        categories = [
            {'name': 'Retail Pharmacy', 'description': 'Standard retail pharmacy serving individual customers'},
            {'name': 'Hospital Pharmacy', 'description': 'Pharmacy located within a hospital'},
            {'name': 'Chain Pharmacy', 'description': 'Part of a larger chain of pharmacies'},
            {'name': 'Wholesale Pharmacy', 'description': 'Primarily deals with bulk sales to other businesses'},
            {'name': '24-Hour Pharmacy', 'description': 'Pharmacy that operates 24 hours a day'},
        ]
        
        for category in categories:
            obj, created = ChemistCategory.objects.get_or_create(
                name=category['name'],
                defaults={'description': category['description']}
            )
            status = 'Created' if created else 'Already exists'
            self.stdout.write(f'  {status}: {obj}')
    
    def _create_stockist_categories(self):
        self.stdout.write('Creating stockist categories...')
        
        categories = [
            {'name': 'Primary Stockist', 'description': 'Direct distributor from company'},
            {'name': 'Secondary Stockist', 'description': 'Distributor who buys from primary stockist'},
            {'name': 'Super Stockist', 'description': 'Large volume stockist covering multiple territories'},
            {'name': 'C&F Agent', 'description': 'Carrying & Forwarding agent'},
            {'name': 'Regional Distributor', 'description': 'Covers a specific region'},
        ]
        
        for category in categories:
            obj, created = StockistCategory.objects.get_or_create(
                name=category['name'],
                defaults={'description': category['description']}
            )
            status = 'Created' if created else 'Already exists'
            self.stdout.write(f'  {status}: {obj}')
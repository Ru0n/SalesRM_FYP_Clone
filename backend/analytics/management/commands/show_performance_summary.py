from datetime import datetime, timedelta
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.utils import timezone

from analytics.utils import PerformanceCalculator

User = get_user_model()


class Command(BaseCommand):
    help = 'Show performance analytics summary for all MRs'

    def add_arguments(self, parser):
        parser.add_argument(
            '--days',
            type=int,
            default=30,
            help='Number of days to analyze (default: 30)',
        )
        parser.add_argument(
            '--manager',
            type=str,
            help='Show only MRs for specific manager (email)',
        )

    def handle(self, *args, **options):
        days = options['days']
        end_date = timezone.now().date()
        start_date = end_date - timedelta(days=days)
        
        self.stdout.write(f'\n=== Performance Analytics Summary ===')
        self.stdout.write(f'Period: {start_date} to {end_date} ({days} days)\n')
        
        # Get MRs to analyze
        mrs = User.objects.filter(role='mr', is_active=True)
        if options['manager']:
            manager = User.objects.filter(email=options['manager'], role='manager').first()
            if manager:
                mrs = mrs.filter(manager=manager)
                self.stdout.write(f'Filtering by Manager: {manager.full_name}\n')
            else:
                self.stdout.write(self.style.ERROR(f'Manager not found: {options["manager"]}'))
                return
        
        if not mrs.exists():
            self.stdout.write(self.style.WARNING('No MRs found to analyze'))
            return
        
        # Calculate performance for each MR
        calculator = PerformanceCalculator(start_date, end_date)
        performances = []
        
        for mr in mrs:
            performance_data = calculator.calculate_performance_score(mr, mrs)
            performances.append({
                'mr': mr,
                'data': performance_data
            })
        
        # Sort by performance score
        performances.sort(key=lambda x: x['data']['performance_score'], reverse=True)
        
        # Display results
        self.stdout.write('Rank | MR Name                | Manager              | Score | DCR% | Calls | TP%  | Exp%')
        self.stdout.write('-' * 95)
        
        for i, perf in enumerate(performances, 1):
            mr = perf['mr']
            data = perf['data']
            kpis = data['kpis']
            
            manager_name = mr.manager.full_name if mr.manager else 'No Manager'
            
            self.stdout.write(
                f'{i:4d} | {mr.full_name:22s} | {manager_name:20s} | '
                f'{data["performance_score"]:5.1f} | {kpis["dcr_compliance"]:4.1f} | '
                f'{kpis["call_average"]:5.1f} | {kpis["tp_submission"]:4.1f} | '
                f'{kpis["expense_efficiency"]:4.1f}'
            )
        
        # Show detailed breakdown for top performer
        if performances:
            self.stdout.write('\n=== Top Performer Details ===')
            top_perf = performances[0]
            mr = top_perf['mr']
            data = top_perf['data']
            kpis = data['kpis']
            
            self.stdout.write(f'Name: {mr.full_name}')
            self.stdout.write(f'Manager: {mr.manager.full_name if mr.manager else "No Manager"}')
            self.stdout.write(f'Overall Score: {data["performance_score"]:.2f}%\n')
            
            self.stdout.write('KPI Breakdown:')
            self.stdout.write(f'  DCR Compliance: {kpis["dcr_compliance"]:.1f}% ({kpis["total_dcrs"]}/{kpis["working_days"]} days)')
            self.stdout.write(f'  Call Average: {kpis["call_average"]:.1f} calls/day ({kpis["field_work_days"]} field days)')
            self.stdout.write(f'  TP Submission: {kpis["tp_submission"]:.1f}% ({"Yes" if kpis["tp_submitted"] else "No"})')
            self.stdout.write(f'  Expense Efficiency: {kpis["expense_efficiency"]:.1f}% (NPR {kpis["total_expense_amount"]:.0f} total)')
            
            self.stdout.write(f'\nVisit Details:')
            self.stdout.write(f'  Doctors Visited: {kpis["total_doctors_visited"]}')
            self.stdout.write(f'  Chemists Visited: {kpis["total_chemists_visited"]}')
            self.stdout.write(f'  Total Visits: {kpis["total_doctors_visited"] + kpis["total_chemists_visited"]}')
        
        # Show summary statistics
        if len(performances) > 1:
            scores = [p['data']['performance_score'] for p in performances]
            avg_score = sum(scores) / len(scores)
            
            self.stdout.write('\n=== Summary Statistics ===')
            self.stdout.write(f'Total MRs Analyzed: {len(performances)}')
            self.stdout.write(f'Average Performance Score: {avg_score:.2f}%')
            self.stdout.write(f'Highest Score: {max(scores):.2f}%')
            self.stdout.write(f'Lowest Score: {min(scores):.2f}%')
            self.stdout.write(f'Score Range: {max(scores) - min(scores):.2f}%')
        
        self.stdout.write('\n=== Manager Summary ===')
        manager_stats = {}
        for perf in performances:
            mr = perf['mr']
            manager = mr.manager
            if manager:
                if manager.full_name not in manager_stats:
                    manager_stats[manager.full_name] = []
                manager_stats[manager.full_name].append(perf['data']['performance_score'])
        
        for manager_name, scores in manager_stats.items():
            avg_score = sum(scores) / len(scores)
            self.stdout.write(f'{manager_name}: {len(scores)} MRs, Avg Score: {avg_score:.2f}%')
        
        self.stdout.write(f'\nUse --manager <email> to filter by specific manager')
        self.stdout.write(f'Use --days <number> to change analysis period')

# Generated by Django 5.2 on 2025-05-03 06:38

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('masters', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='LeaveRequest',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('is_active', models.BooleanField(default=True)),
                ('start_date', models.DateField(verbose_name='Start Date')),
                ('end_date', models.DateField(verbose_name='End Date')),
                ('reason', models.TextField(verbose_name='Reason')),
                ('status', models.CharField(choices=[('pending', 'Pending'), ('approved', 'Approved'), ('rejected', 'Rejected'), ('cancelled', 'Cancelled')], default='pending', max_length=10, verbose_name='Status')),
                ('requested_at', models.DateTimeField(auto_now_add=True, verbose_name='Requested At')),
                ('reviewed_at', models.DateTimeField(blank=True, null=True, verbose_name='Reviewed At')),
                ('manager_comments', models.TextField(blank=True, null=True, verbose_name='Manager Comments')),
                ('leave_type', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='leave_requests', to='masters.leavetype', verbose_name='Leave Type')),
                ('reviewed_by', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='reviewed_leaves', to=settings.AUTH_USER_MODEL, verbose_name='Reviewed By')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='leave_requests', to=settings.AUTH_USER_MODEL, verbose_name='User')),
            ],
            options={
                'verbose_name': 'Leave Request',
                'verbose_name_plural': 'Leave Requests',
                'ordering': ['-requested_at'],
            },
        ),
    ]

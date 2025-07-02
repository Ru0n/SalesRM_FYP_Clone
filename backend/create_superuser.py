import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()

# Check if a superuser already exists
if not User.objects.filter(is_superuser=True).exists():
    User.objects.create_superuser(
        email='admin@example.com',
        password='admin123',
        first_name='Admin',
        last_name='User',
        role='admin'
    )
    print('Superuser created successfully!')
else:
    print('Superuser already exists.')
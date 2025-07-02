# Django Admin Setup

This guide explains how to set up the Django Admin interface with master data for the SalesRM1 project.

## Overview

The Django Admin interface provides a powerful and user-friendly way to manage your application's data. This setup process will:

1. Create and apply migrations for the masters app models
2. Populate the database with initial master data for:
   - Territories (regions and states)
   - Positions (job roles)
   - Product Categories and Products
   - Leave Types
   - Expense Types
   - Holidays
   - Doctor Specialties
   - Chemist Categories
   - Stockist Categories

## Prerequisites

- PostgreSQL database is set up and running
- Django project is configured correctly
- Superuser has been created

## Setup Instructions

### Option 1: Using the Setup Script (Recommended)

1. Make sure your conda environment is activated:
   ```bash
   conda activate sfa-env
   ```

2. Run the setup script:
   ```bash
   cd /Users/aasu/Desktop/SalesRM1/backend
   python setup_admin.py
   ```

3. The script will:
   - Make migrations for the masters app
   - Apply all migrations
   - Populate the database with initial master data

### Option 2: Manual Setup

If you prefer to run the commands manually:

1. Make sure your conda environment is activated:
   ```bash
   conda activate sfa-env
   ```

2. Make migrations for the masters app:
   ```bash
   python manage.py makemigrations masters
   ```

3. Apply all migrations:
   ```bash
   python manage.py migrate
   ```

4. Populate the database with initial master data:
   ```bash
   python manage.py populate_masters
   ```

## Accessing the Django Admin

1. Start the Django development server:
   ```bash
   python manage.py runserver
   ```

2. Open your web browser and go to:
   ```
   http://localhost:8000/admin/
   ```

3. Log in with your superuser credentials.

4. You should now see the masters app models in the admin interface, populated with the initial data.

## Customizing the Data

You can customize the initial data by editing the `populate_masters.py` file in the `masters/management/commands/` directory. After making changes, run the command again:

```bash
python manage.py populate_masters
```

## Troubleshooting

If you encounter any issues:

1. Check the error messages in the console
2. Verify that your database connection is working
3. Make sure your models are correctly defined
4. Ensure that your superuser has the necessary permissions
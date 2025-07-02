# Sales Force Automation Platform (SalesRM Clone)

## 1. Overview

This project is a comprehensive, web-based Sales Force Automation (SFA) / CRM platform designed to streamline field sales operations. It caters to different user roles: Medical Representatives (MRs), Area Sales Managers (ASMs), and Administrators (Admin).

The application allows MRs to manage their contacts (Doctors, Chemists), plan monthly tours (Tour Programs), submit daily activity reports (DCRs), manage leave and expenses. Managers oversee their teams, approve requests, and monitor performance. Admins manage core system data like users, products, territories, targets, and system settings, primarily through a dedicated admin interface.

## 2. Tech Stack

*   **Backend:**
    *   Language: **Python 3.x**
    *   Framework: **Django**
    *   API: **Django REST Framework (DRF)**
    *   Authentication: DRF Simple JWT (or dj-rest-auth) for token-based authentication
    *   Database ORM: Django ORM
    *   Environment Management: **Conda**
    *   Asynchronous Tasks: Celery with Redis/RabbitMQ (Recommended for notifications, reporting)
*   **Frontend:**
    *   Library: **React**
    *   Routing: React Router DOM
    *   State Management: Context API / Redux Toolkit / Zustand (TBD)
    *   API Client: Axios
    *   Styling: CSS Modules / Tailwind CSS / MUI (TBD)
*   **Database:**
    *   **PostgreSQL** (Required for Production/Staging/Development beyond initial setup)
*   **Development Tools:**
    *   Version Control: Git
    *   Package Managers: `conda`, `pip` (Python), `npm` or `yarn` (Node.js)
    *   Environment Variables: `python-dotenv` / `django-environ` (Backend), `.env` files (Frontend)

## 3. Key Features (Modules)

*   Authentication & Authorization (Role-based)
*   Dashboard (Role-specific views)
*   User Management (Admin)
*   Product Management (Admin)
*   Master Data Management (Territories, Positions, etc. - Admin)
*   Tour Program (TP) Management (MR submits, Manager approves)
*   Daily Call Report (DCR) Management (MR submits, Manager views)
*   Doctor/Chemist/Stockist Management
*   Leave Request Management (MR applies, Manager approves)
*   Expense Management (MR submits, Manager approves)
*   Sales Data Tracking & Viewing
*   Target Management (Admin sets, MR/Manager views)
*   Transit Tracking
*   Product Expiry Tracking
*   Holiday Management (Admin)
*   Notice Board (Admin posts, All view)
*   Reporting Module
*   System Settings (Admin)
*   Maintenance Tasks (Admin)
*   Shared Files

## 4. Prerequisites

*   **Conda** (Miniconda or Anaconda)
*   Python 3.8+ (Managed via Conda environment)
*   Node.js & npm / yarn
*   **PostgreSQL Server** (Running locally or accessible)
*   Git

## 5. Setup Instructions

### 5.1. Clone the Repository


git clone <repository-url>
cd <repository-directory>

### 5.2. Backend Setup (Django with Conda)
# 1. Navigate to the backend directory (e.g., 'backend/')
cd backend

# 2. Create a Conda environment (replace 'sfa-env' and 'python=3.x' as needed)
#    You might use an environment.yml file if one is provided:
#    conda env create -f environment.yml
#    OR create manually:
conda create --name sfa-env python=3.10 # Or your preferred Python 3 version
conda activate sfa-env

# 3. Install Python dependencies (use pip within the conda env)
#    Ensure conda-forge channel is prioritized if needed: conda config --add channels conda-forge
#    Install psycopg2 requirements first if needed on your OS (often handled by conda install)
#    conda install psycopg2 # Try installing via conda first
pip install -r requirements.txt # If psycopg2 fails via pip, ensure build tools are installed or use conda install

# 4. Create a .env file based on .env.example
#    Update with your PostgreSQL details (DB_NAME, DB_USER, DB_PASSWORD, DB_HOST, DB_PORT)
#    Set SECRET_KEY, DEBUG status, JWT_SECRET_KEY etc.
cp .env.example .env
# nano .env # Or use your preferred editor

# 5. Apply database migrations
python manage.py migrate

# 6. Create a superuser (for accessing Django Admin)
python manage.py createsuperuser

# 7. (Optional) Load initial data if fixtures are provided
# python manage.py loaddata <fixture_name>.json

### 5.3. Frontend Setup (React)
# 1. Navigate to the frontend directory (e.g., 'frontend/')
cd ../frontend # Adjust path if needed

# 2. Install Node.js dependencies
npm install
# or
# yarn install

# 3. Create a .env file based on .env.example
#    Set VITE_API_BASE_URL (or REACT_APP_API_BASE_URL) to your backend server address
#    (e.g., http://127.0.0.1:8000/api)
cp .env.example .env
# nano .env # Or use your preferred editor

## 6. Running the Project
### 6.1. Start the Backend Server
# Ensure you are in the backend directory
cd backend
# Activate the Conda environment if not already active
conda activate sfa-env

# Run the Django development server
python manage.py runserver
# Server usually runs at http://127.0.0.1:8000/

### 6.2. Start the Frontend Dev Server
# Ensure you are in the frontend directory
cd frontend
npm run dev
# or
# yarn dev
# Check the output for the address (e.g., http://localhost:5173/)

Access the frontend application via the URL provided by the frontend dev server. Access the Django Admin interface via http://127.0.0.1:8000/admin/ (or your backend server address + /admin/).


## 7. Running Tests
### 7.1. Backend Tests

# Ensure you are in the backend directory
cd backend
# Activate the Conda environment if not already active
conda activate sfa-env

# Run tests (using pytest if configured, or Django's runner)
pytest
# or
# python manage.py test <app_name>

### 7.2. Frontend Tests
# Ensure you are in the frontend directory
cd frontend
npm test
# or
# yarn test

### 8. Project Structure (High Level)
.
├── backend/            # Django Project
│   ├── venv/           # (Or conda env info if managed within project)
│   ├── core/           # Core Django settings, urls, wsgi, asgi
│   ├── users/          # User management app
│   ├── tours/          # Tour Program app
│   ├── reports/        # DCR, Reporting app
│   ├── masters/        # Master data app (Products, Territories etc)
│   ├── api/            # Central API routing (optional)
│   ├── manage.py
│   ├── requirements.txt
│   └── .env
├── frontend/           # React Project
│   ├── node_modules/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/     # API calls
│   │   ├── store/        # State management
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── .env
├── .gitignore
└── PROJECT_OVERVIEW_README.md # This file
└── ... (Other documentation files)

### 9. Key Contacts / Authors
Kabya Sharma
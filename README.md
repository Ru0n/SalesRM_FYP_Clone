# Sales Force Automation Platform

A comprehensive web-based Sales Force Automation (SFA) / CRM platform designed to streamline field sales operations.

## Project Overview

This project is a full-stack application with a Django backend and React frontend. It caters to different user roles: Medical Representatives (MRs), Area Sales Managers (ASMs), and Administrators (Admin).

The application allows MRs to manage their contacts (Doctors, Chemists), plan monthly tours (Tour Programs), submit daily activity reports (DCRs), manage leave and expenses. Managers oversee their teams, approve requests, and monitor performance. Admins manage core system data like users, products, territories, targets, and system settings, primarily through a dedicated admin interface.

## Tech Stack

- **Backend:**
  - Language: Python 3.10
  - Framework: Django
  - API: Django REST Framework (DRF)
  - Authentication: DRF Simple JWT
  - Database ORM: Django ORM
  - Environment Management: Conda

- **Frontend:**
  - Library: React
  - Routing: React Router DOM
  - State Management: Redux Toolkit
  - API Client: Axios

- **Database:**
  - PostgreSQL

## Prerequisites

- Conda (Miniconda or Anaconda)
- Python 3.10 (Managed via Conda environment)
- Node.js & npm
- PostgreSQL Server (Running locally or accessible)
- Git

## Setup Instructions

### Backend Setup (Django with Conda)

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create and activate the Conda environment:
   ```bash
   conda create --name sfa-env python=3.10
   conda activate sfa-env
   ```

3. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Create a .env file based on .env.example:
   ```bash
   cp .env.example .env
   # Update with your PostgreSQL details and other settings
   ```

5. Apply database migrations:
   ```bash
   python manage.py migrate
   ```

6. Create a superuser (for accessing Django Admin):
   ```bash
   python manage.py createsuperuser
   ```

### Frontend Setup (React)

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install Node.js dependencies:
   ```bash
   npm install
   ```

3. Create a .env file based on .env.example:
   ```bash
   cp .env.example .env
   # Set VITE_API_BASE_URL to your backend server address
   ```

## Running the Project

### Start the Backend Server

```bash
cd backend
conda activate sfa-env
python manage.py runserver
# Server usually runs at http://127.0.0.1:8000/
```

### Start the Frontend Dev Server

```bash
cd frontend
npm run dev
# Check the output for the address (e.g., http://localhost:5173/)
```

Access the frontend application via the URL provided by the frontend dev server. Access the Django Admin interface via http://127.0.0.1:8000/admin/.

## Project Structure

```
.
├── backend/            # Django Project
│   ├── core/           # Core Django settings, urls, wsgi, asgi
│   ├── users/          # User management app
│   ├── tours/          # Tour Program app
│   ├── reports/        # DCR, Reporting app
│   ├── masters/        # Master data app (Products, Territories etc)
│   ├── api/            # Central API routing
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
└── README.md
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.
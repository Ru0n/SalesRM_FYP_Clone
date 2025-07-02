# 🚀 SalesRM Setup Guide

## 📋 Project Overview

SalesRM is a comprehensive Sales Force Automation system with Performance Analytics featuring:
- **Backend**: Django 5.2 + Django REST Framework
- **Frontend**: React 19 + Redux Toolkit + Vite
- **Database**: PostgreSQL
- **Analytics**: Weighted KPI scoring system (DCR 40%, Calls 30%, TP 10%, Expenses 20%)

## ✅ System Status: FULLY FUNCTIONAL

**🔧 CLONING ISSUE FIXED!** The `master` branch now contains the complete working system:

All endpoints tested and working:
- ✅ Authentication (JWT)
- ✅ Analytics APIs (`/api/analytics/performance-report/`, `/api/analytics/top-performers/`)
- ✅ Frontend dashboard with analytics widgets
- ✅ User management
- ✅ All CRUD operations (expenses, leaves, reports, tours, etc.)
- ✅ Complete backend with all modules
- ✅ Complete frontend with all components

## 🛠️ Prerequisites

### For All Platforms (Windows/Mac/Linux):
- **Python 3.10+** (with pip)
- **Node.js 18+** (with npm)
- **PostgreSQL 14+**
- **Git**
- **Conda** (Miniconda or Anaconda)

### Platform-Specific Installation:

#### macOS:
```bash
# Install Homebrew (if not installed)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install prerequisites
brew install postgresql@14 node git
brew install --cask miniconda

# Start PostgreSQL
brew services start postgresql@14
```

#### Windows:
```powershell
# Install using Chocolatey (run as Administrator)
choco install postgresql nodejs git miniconda3

# Or download installers:
# - PostgreSQL: https://www.postgresql.org/download/windows/
# - Node.js: https://nodejs.org/
# - Git: https://git-scm.com/download/win
# - Miniconda: https://docs.conda.io/en/latest/miniconda.html
```

#### Linux (Ubuntu/Debian):
```bash
# Update package list
sudo apt update

# Install prerequisites
sudo apt install postgresql postgresql-contrib nodejs npm git wget

# Install Miniconda
wget https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh
bash Miniconda3-latest-Linux-x86_64.sh
```

## 🔧 Setup Instructions

### 1. Clone Repository

⚠️ **IMPORTANT**: Use the `master` branch which contains the COMPLETE working code:

```bash
# Method 1: Clone master branch directly (RECOMMENDED)
git clone -b master https://github.com/Ru0n/SalesRM_FYP_Clone.git
cd SalesRM_FYP_Clone

# Method 2: Use the simple clone fix script
curl -O https://raw.githubusercontent.com/Ru0n/SalesRM_FYP_Clone/main/SIMPLE_CLONE_FIX.sh
chmod +x SIMPLE_CLONE_FIX.sh
./SIMPLE_CLONE_FIX.sh

# Verify you have all modules
ls backend/  # Should show: api, expenses, leaves, reports, tours, etc.
```

**Note**: The `master` branch contains the complete SalesRM application with all modules (expenses, leaves, reports, tours, analytics, etc.). The `main` branch only has partial content.

### 2. Backend Setup

#### Create Conda Environment
```bash
conda create --name sfa-env python=3.10
conda activate sfa-env
```

#### Install Python Dependencies
```bash
cd backend
pip install -r requirements.txt
```

#### Database Configuration

**Create PostgreSQL Database:**
```bash
# Connect to PostgreSQL (adjust for your system)
psql -U postgres

# In PostgreSQL shell:
CREATE DATABASE salesrm_db;
CREATE USER salesrm_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE salesrm_db TO salesrm_user;
\q
```

**Configure Environment Variables:**
```bash
# Create .env file in backend directory
cp .env.example .env

# Edit .env with your database credentials:
DB_NAME=salesrm_db
DB_USER=salesrm_user
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432
SECRET_KEY=your-secret-key-here
DEBUG=True
```

#### Run Migrations
```bash
python manage.py migrate
python manage.py createsuperuser  # Create admin user
```

#### Load Sample Data (Optional)
```bash
python manage.py loaddata fixtures/sample_data.json
```

### 3. Frontend Setup

```bash
cd frontend
npm install
```

### 4. Start Development Servers

#### Terminal 1 - Backend:
```bash
cd backend
conda activate sfa-env
python manage.py runserver 8000
```

#### Terminal 2 - Frontend:
```bash
cd frontend
npm run dev
```

## 🌐 Access Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000/api/
- **Admin Panel**: http://localhost:8000/admin/

### Default Login Credentials:
- **Email**: admin@example.com
- **Password**: admin123

## 📊 Analytics Features

### Performance Analytics Dashboard:
- **Top Performers Widget**: Shows top 5 performers with scores
- **Detailed Analytics Page**: Comprehensive performance reports
- **KPI Breakdown**: DCR compliance, call averages, TP submission, expense efficiency

### API Endpoints:
- `GET /api/analytics/performance-report/` - Detailed performance data
- `GET /api/analytics/top-performers/` - Top performers ranking

## 🧪 Testing

### Backend Tests:
```bash
cd backend
conda activate sfa-env
python manage.py test analytics  # Test analytics functionality
python manage.py test           # Run all tests
```

### Frontend Build Test:
```bash
cd frontend
npm run build
```

## 🔍 Troubleshooting

### Git/Cloning Issues:

#### 1. "Multiple branches" or "Wrong branch" errors
**Problem**: Repository has both `master` and `main` branches, but only `master` has complete content
**Solution**: Always clone the `master` branch:
```bash
# Delete existing clone if corrupted
rm -rf SalesRM_FYP_Clone

# Clone master branch specifically (HAS ALL CONTENT)
git clone -b master https://github.com/Ru0n/SalesRM_FYP_Clone.git
cd SalesRM_FYP_Clone

# Verify you're on master branch and have all modules
git branch  # Should show: * master
ls backend/  # Should show: api, expenses, leaves, reports, tours, etc.
```

#### 2. "Repository not found" or authentication errors
**Solution**: Check repository access and authentication:
```bash
# Test repository access
curl -I https://github.com/Ru0n/SalesRM_FYP_Clone.git

# If using SSH, switch to HTTPS
git clone https://github.com/Ru0n/SalesRM_FYP_Clone.git
```

#### 3. "Corrupted files" or "Missing modules" during clone
**Solution**: Use the simple clone fix script or shallow clone:
```bash
# Option 1: Use the fix script (RECOMMENDED)
curl -O https://raw.githubusercontent.com/Ru0n/SalesRM_FYP_Clone/main/SIMPLE_CLONE_FIX.sh
chmod +x SIMPLE_CLONE_FIX.sh
./SIMPLE_CLONE_FIX.sh

# Option 2: Shallow clone master branch
git clone --depth 1 -b master https://github.com/Ru0n/SalesRM_FYP_Clone.git

# Verify all modules exist
ls SalesRM_FYP_Clone/backend/  # Should show: api, expenses, leaves, reports, tours, etc.
```

### Common Issues:

#### 1. "No module named 'django'"
**Solution**: Activate conda environment
```bash
conda activate sfa-env
```

#### 2. Database connection errors
**Solution**: Check PostgreSQL service and .env configuration
```bash
# macOS
brew services restart postgresql@14

# Windows
net start postgresql-x64-14

# Linux
sudo systemctl restart postgresql
```

#### 3. Frontend blank page
**Solution**: Check console for errors, ensure backend is running
```bash
# Check if backend is accessible
curl http://localhost:8000/api/
```

#### 4. CORS errors
**Solution**: Ensure frontend port matches CORS settings in backend/core/settings.py

### Port Conflicts:
If ports 8000 or 5173 are in use:
```bash
# Backend - use different port
python manage.py runserver 8001

# Frontend - Vite will automatically find available port
npm run dev
```

## 📁 Project Structure

```
SalesRM_FYP_Clone/
├── backend/                 # Django backend
│   ├── analytics/          # Performance analytics app
│   ├── users/              # User management
│   ├── reports/            # DCR reports
│   ├── tours/              # Tour programs
│   ├── expenses/           # Expense management
│   ├── leaves/             # Leave requests
│   └── core/               # Django settings
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   └── store/          # Redux store
│   └── package.json
└── Documentation/          # Project documentation
```

## 🚀 Production Deployment

### Environment Variables for Production:
```bash
DEBUG=False
ALLOWED_HOSTS=your-domain.com
DATABASE_URL=postgresql://user:pass@host:port/dbname
SECRET_KEY=your-production-secret-key
```

### Build for Production:
```bash
# Frontend
cd frontend
npm run build

# Backend
cd backend
python manage.py collectstatic
```

## 📞 Support

If you encounter any issues:
1. Check this troubleshooting guide
2. Verify all prerequisites are installed
3. Ensure all services (PostgreSQL) are running
4. Check console/terminal for error messages

## 🔄 Cross-Platform Compatibility

### Windows-Specific Notes:
- Use PowerShell or Command Prompt as Administrator
- PostgreSQL service: `net start postgresql-x64-14`
- Python virtual environment: Use `python -m venv` if conda unavailable
- Path separators: Use `\` instead of `/` in file paths

### macOS-Specific Notes:
- Use Terminal or iTerm2
- PostgreSQL via Homebrew: `brew services start postgresql@14`
- Conda installation: Use Homebrew cask or direct download
- File permissions: May need `sudo` for some operations

### Linux-Specific Notes:
- Use bash or zsh terminal
- PostgreSQL service: `sudo systemctl start postgresql`
- Package manager: `apt`, `yum`, or `pacman` depending on distribution
- Python: May need `python3` instead of `python`

## 🚀 Deployment to GitHub

### Option 1: Use Deployment Script
```bash
# Make script executable
chmod +x DEPLOYMENT_SCRIPT.sh

# Run deployment script
./DEPLOYMENT_SCRIPT.sh
```

### Option 2: Manual Git Commands
```bash
# Initialize repository
git init
git remote add origin https://github.com/Ru0n/SalesRM_FYP_Clone.git

# Add files
git add .
git commit -m "Add working SalesRM with Performance Analytics"

# Push to GitHub (main branch)
git branch -M main
git push -u origin main
```

### Option 3: Clone Existing Repository
```bash
# Clone the working repository
git clone -b main https://github.com/Ru0n/SalesRM_FYP_Clone.git
cd SalesRM_FYP_Clone

# Verify you have the latest code
git pull origin main
```

## 📋 System Verification Checklist

### Backend Verification:
- [ ] Django server starts without errors
- [ ] Database connection successful
- [ ] Analytics endpoints return data
- [ ] Authentication working
- [ ] Admin panel accessible

### Frontend Verification:
- [ ] React app loads without errors
- [ ] Login functionality works
- [ ] Dashboard displays analytics widgets
- [ ] Navigation between pages works
- [ ] API calls successful

### Analytics Verification:
- [ ] Top performers widget shows data
- [ ] Performance reports page loads
- [ ] KPI calculations are correct
- [ ] Filtering functionality works
- [ ] Real-time updates working

## 🔧 Environment Configuration

### Development Environment (.env):
```bash
DEBUG=True
DB_NAME=salesrm_db
DB_USER=salesrm_user
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432
SECRET_KEY=your-development-secret-key
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
```

### Production Environment (.env):
```bash
DEBUG=False
DB_NAME=salesrm_prod
DB_USER=salesrm_prod_user
DB_PASSWORD=strong_production_password
DB_HOST=your-production-db-host
DB_PORT=5432
SECRET_KEY=your-super-secret-production-key
ALLOWED_HOSTS=your-domain.com,www.your-domain.com
CORS_ALLOWED_ORIGINS=https://your-domain.com,https://www.your-domain.com
```

## 🎯 Performance Optimization

### Backend Optimization:
- Enable database connection pooling
- Use Redis for caching
- Configure static file serving
- Enable gzip compression

### Frontend Optimization:
- Build for production: `npm run build`
- Enable code splitting
- Optimize images and assets
- Use CDN for static files

## 📞 Getting Help

### Common Commands:
```bash
# Check Django version
python -c "import django; print(django.get_version())"

# Check Node.js version
node --version

# Check PostgreSQL status
pg_isready

# Test database connection
python manage.py dbshell

# Run Django shell
python manage.py shell

# Check frontend dependencies
npm list
```

### Useful Links:
- [Django Documentation](https://docs.djangoproject.com/)
- [React Documentation](https://react.dev/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Redux Toolkit Documentation](https://redux-toolkit.js.org/)

---

**🎉 Setup Complete!** Your SalesRM application should now be running with full analytics functionality.

**📊 Analytics Dashboard**: Access performance insights at http://localhost:5173 after login
**🔧 API Documentation**: Explore endpoints at http://localhost:8000/api/
**👨‍💼 Admin Panel**: Manage users and data at http://localhost:8000/admin/

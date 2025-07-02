#!/bin/bash

# 🔄 Clean Repository Reset Script
# This script will help you reset the GitHub repository and add all working files cleanly

echo "🔄 Clean Repository Reset Script"
echo "================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Check if we're in the right directory
if [ ! -f "backend/manage.py" ] || [ ! -f "frontend/package.json" ]; then
    print_error "Please run this script from the SalesRM_FYP_Clone root directory"
    exit 1
fi

print_info "This script will help you reset the GitHub repository cleanly"
print_warning "You'll need to manually delete the repository on GitHub first"

echo ""
print_info "STEP 1: Manual GitHub Repository Reset"
print_info "======================================="
print_info "1. Go to: https://github.com/Ru0n/SalesRM_FYP_Clone"
print_info "2. Click 'Settings' tab"
print_info "3. Scroll down to 'Danger Zone'"
print_info "4. Click 'Delete this repository'"
print_info "5. Type 'Ru0n/SalesRM_FYP_Clone' to confirm"
print_info "6. Click 'I understand the consequences, delete this repository'"

echo ""
read -p "Have you deleted the repository on GitHub? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    print_info "Please delete the repository first, then run this script again"
    exit 0
fi

print_info "STEP 2: Create New Repository"
print_info "============================="
print_info "1. Go to: https://github.com/new"
print_info "2. Repository name: SalesRM_FYP_Clone"
print_info "3. Description: 🚀 Sales Force Automation System with Performance Analytics - Django 5.2 + React 19 + PostgreSQL"
print_info "4. Make it Public"
print_info "5. DO NOT initialize with README, .gitignore, or license"
print_info "6. Click 'Create repository'"

echo ""
read -p "Have you created the new empty repository? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    print_info "Please create the repository first, then run this script again"
    exit 0
fi

print_info "STEP 3: Preparing Local Repository"
print_info "=================================="

# Remove existing git history
print_info "Removing existing git history..."
rm -rf .git

# Initialize new git repository
print_info "Initializing new git repository..."
git init
git branch -M main

# Create comprehensive .gitignore
print_info "Creating .gitignore..."
cat > .gitignore << 'EOF'
# Python
__pycache__/
*.py[cod]
*$py.class
*.so
.Python
build/
develop-eggs/
dist/
downloads/
eggs/
.eggs/
lib/
lib64/
parts/
sdist/
var/
wheels/
*.egg-info/
.installed.cfg
*.egg

# Django
*.log
local_settings.py
db.sqlite3
db.sqlite3-journal
media/

# Environment variables
.env
.venv
env/
venv/
ENV/
env.bak/
venv.bak/

# Node.js
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*
.npm
.eslintcache

# Build outputs
frontend/dist/
frontend/build/

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# OS
.DS_Store
Thumbs.db

# Logs
*.log
logs/

# Database
*.db
*.sqlite3

# Temporary files
*.tmp
*.temp

# Backup files
*.bak

# Test coverage
htmlcov/
.coverage
.coverage.*
coverage.xml
*.cover
.hypothesis/
.pytest_cache/

# Jupyter Notebook
.ipynb_checkpoints

# pyenv
.python-version

# Conda
.conda/

# Spyder
.spyderproject
.spyproject

# Rope
.ropeproject

# mkdocs
/site

# mypy
.mypy_cache/
.dmypy.json
dmypy.json
EOF

# Clean up any backup files and temporary files
print_info "Cleaning up temporary files..."
find . -name "*.bak" -delete
find . -name "*.tmp" -delete
find . -name "*.temp" -delete
find . -name "__pycache__" -type d -exec rm -rf {} + 2>/dev/null || true

# Add remote origin
print_info "Adding remote origin..."
git remote add origin https://github.com/Ru0n/SalesRM_FYP_Clone.git

print_info "STEP 4: Adding Files to Repository"
print_info "=================================="

# Add files in logical groups
print_info "Adding documentation files..."
git add README.md SETUP_GUIDE.md .gitignore

print_info "Adding backend core files..."
git add backend/manage.py backend/requirements.txt backend/core/

print_info "Adding backend apps..."
git add backend/analytics/ backend/users/ backend/api/

print_info "Adding other backend modules..."
git add backend/expenses/ backend/leaves/ backend/reports/ backend/tours/ backend/masters/ backend/notifications/

print_info "Adding backend configuration files..."
git add backend/.env.example backend/ADMIN_SETUP_README.md backend/setup_admin.py backend/create_superuser.py

print_info "Adding frontend core files..."
git add frontend/package.json frontend/package-lock.json frontend/vite.config.js frontend/index.html

print_info "Adding frontend configuration..."
git add frontend/tailwind.config.cjs frontend/postcss.config.cjs frontend/components.json frontend/eslint.config.js

print_info "Adding frontend source code..."
git add frontend/src/ frontend/public/ frontend/.gitignore frontend/README.md frontend/.env.example

print_info "Adding documentation..."
git add Documentation/ || true

print_info "Adding utility scripts..."
git add *.sh *.md

print_status "All files added successfully!"

print_info "STEP 5: Creating Initial Commit"
print_info "==============================="

git commit -m "🚀 Initial commit: Complete SalesRM with Performance Analytics

✅ COMPLETE SALES FORCE AUTOMATION SYSTEM:
- Backend: Django 5.2 + Django REST Framework
- Frontend: React 19 + Redux Toolkit + Vite  
- Database: PostgreSQL with comprehensive schema
- Analytics: Weighted KPI performance scoring system

🎯 FEATURES:
- Performance Analytics Dashboard with KPI scoring
- User Management with role-based access
- Expense Claims Management
- Leave Requests Management  
- Daily Call Reports (DCR)
- Tour Program Management
- Contact Management (Doctors/Chemists)
- Real-time Notifications
- JWT Authentication

📊 ANALYTICS SYSTEM:
- Weighted KPI Scoring: DCR (40%), Calls (30%), TP (10%), Expenses (20%)
- Top Performers Dashboard Widget
- Performance Reports with Filtering
- Real-time Calculations

🔧 TECHNICAL STACK:
- Backend: Django 5.2, DRF, PostgreSQL, JWT
- Frontend: React 19, Redux Toolkit, Tailwind CSS, Vite
- Testing: Django Test Suite, Frontend Build Tests
- Documentation: Comprehensive setup guides

🌍 CROSS-PLATFORM READY:
- Windows, macOS, Linux compatible
- Conda environment setup
- Docker-ready configuration
- Comprehensive documentation

🚀 READY FOR DEPLOYMENT"

print_status "Initial commit created!"

print_info "STEP 6: Pushing to GitHub"
print_info "========================="

print_info "Pushing to GitHub..."
git push -u origin main

if [ $? -eq 0 ]; then
    print_status "🎉 SUCCESS! Repository reset and uploaded successfully!"
    print_status "Repository: https://github.com/Ru0n/SalesRM_FYP_Clone"
    print_status "Branch: main (clean, single branch)"
    print_status "Status: Ready for cloning and deployment"
    
    echo ""
    print_info "VERIFICATION COMMANDS:"
    print_info "====================="
    print_info "git clone https://github.com/Ru0n/SalesRM_FYP_Clone.git"
    print_info "cd SalesRM_FYP_Clone"
    print_info "ls backend/  # Should show all modules"
    print_info "ls frontend/src/  # Should show all components"
    
else
    print_error "Failed to push to GitHub"
    print_info "Please check your GitHub authentication and try:"
    print_info "git push -u origin main"
fi

print_status "Repository reset completed!"

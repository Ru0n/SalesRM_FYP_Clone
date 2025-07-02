# PRD & Kanban: Sales Force Automation Platform (Django/DRF + React Full Scope)

**(Combined Document)**

---
# Part 1: PRD (Product Requirements Document)
---

**Version:** 1.1 (Django Adaptation)
**Date:** 2023-10-27
**Author:** [Your Name]

## 1. Introduction & Overview

This document outlines the requirements for a comprehensive, web-based Sales Force Automation (SFA) / CRM platform, modeled after the provided SalesRM screenshot and accompanying role descriptions. The platform aims to fully support field sales operations for Medical Representatives (MRs), their Managers (ASMs), and administrative staff (Admin).

The backend will be developed using the **Python/Django framework**, leveraging its robust features like the ORM, built-in authentication, and especially the **automatic Admin Interface**. The frontend will be a Single Page Application (SPA) built with **React** (or a similar framework), interacting with the backend via APIs built using **Django REST Framework (DRF)**.

## 2. Goals & Objectives

*   **Goal 1:** Develop a feature-complete SFA platform replicating the functionality and user roles observed in the SalesRM example.
*   **Objective 1.1:** Provide MRs with a comprehensive toolkit for planning, execution, reporting, and expense tracking via an intuitive React frontend.
*   **Objective 1.2:** Equip Managers (ASMs) with tools for team oversight, workflow approvals, and performance monitoring via the React frontend, supported by Django backend logic.
*   **Objective 1.3:** Enable Admins to manage all core system entities, configurations, and user access efficiently, **primarily utilizing the powerful built-in Django Admin Interface**, supplemented by custom views where necessary.
*   **Objective 1.4:** Centralize all relevant sales force data and activities into a single, reliable platform managed by the Django backend and **PostgreSQL** database (recommended).
*   **Objective 1.5:** Deliver a polished and intuitive user interface using React, matching the target design.

## 3. User Roles & Personas

### 3.1. Medical Representative (MR)
*   **Primary Goal:** Plan routes, report daily visits, manage expenses, and achieve targets.
*   **Key Actions:** Add/Manage Doctors/Clients, Add/Manage Chemists/Pharmacy, Submit Monthly Tour Program, Submit Daily Call Reports (DCR), Submit Leave Requests, Submit Expense Claims, View Assigned Targets, View Sales Reports (Dashboard/Dedicated), Access CRM info.
*   **Primary Interaction:** React Frontend.

### 3.2. Manager (ASM - Area Sales Manager)
*   **Primary Goal:** Oversee a team of MRs, approve their activities, and monitor performance.
*   **Key Actions:** Access Manager's Call Report View, Approve/Reject MR Tour Programs, Approve/Reject MR Leave Applications, Approve/Reject MR Expense Claims, Initiate Expense Changes for MRs, Select MRs for Own Tour Plan/View, View MR DCRs, Access Combined MR Sales Data, *All MR functionalities*.
*   **Primary Interaction:** React Frontend (Potential secondary use of Django Admin for oversight).

### 3.3. Admin
*   **Primary Goal:** Manage core system setup, users, and master data. Maintain the application.
*   **Key Actions:** Add/Manage Products, Assign Territory/Zone/HQ, Designate Positions, Add/Manage Users, Handle Transfers/Promotions, Set/Send Targets, Delete DCR Analysis, Add/Manage Holidays, Post/Manage Notices, Manage Master Data, Manage Settings, Perform Maintenance Tasks, Manage Shared Files.
*   **Primary Interaction:** **Django Admin Interface.**
*   **Secondary Interaction:** Custom React frontend views for specific complex tasks if needed.

## 4. Functional Requirements

### 4.1. Core System & Authentication
*   **F-AUTH-01:** Secure User Login.
    *   *Implementation:* Leverage `django.contrib.auth` views/forms or DRF endpoints (e.g., using `dj-rest-auth` or `djangorestframework-simplejwt`).
*   **F-AUTH-02:** Role-based access control (MR, Manager, Admin).
    *   *Implementation:* Utilize Django's Groups and Permissions framework. Decorators/Permissions classes in Views/DRF ViewSets.
*   **F-AUTH-03:** Secure password hashing.
    *   *Implementation:* Provided by `django.contrib.auth`.
*   **F-AUTH-04:** Token-based session management for SPA.
    *   *Implementation:* Use DRF Simple JWT or similar library for API token authentication.
*   **F-AUTH-05:** User Profile View/Edit (basic info in React frontend).
    *   *Implementation:* DRF endpoint to fetch/update `request.user` related data.
*   **F-AUTH-06:** Password Reset mechanism.
    *   *Implementation:* Leverage `django.contrib.auth` views/logic, potentially exposed via DRF endpoints.

### 4.2. UI Layout & Navigation (React Frontend)
*   **F-UI-01:** Main application layout: Header, Collapsible Sidebar, Main Content Area, Right Info Sidebar.
*   **F-UI-02:** Header: Logo, Menu Toggle, Page Title, Icons (Calendar, Notification, Mail, User Menu).
*   **F-UI-03:** Collapsible Sidebar: Dynamically populated based on user role fetched from backend API.
*   **F-UI-04:** Right Sidebar: Display Upcoming Events data fetched from API.

### 4.3. Dashboard (React Frontend)
*   **F-DASH-01:** "Welcome, [UserName]" message.
*   **F-DASH-02:** Role-specific summary cards.
    *   *Implementation:* Data fetched from a dedicated DRF dashboard endpoint aggregating data via Django ORM queries based on user role. Include: Total Doctors, Total Chemists, Total Stockists.
*   **F-DASH-03:** Tabbed Interface: Tour Program, Leave, Secondary Sales, Product Wise, Team. Content fetched from relevant API endpoints.
*   **F-DASH-04:** (Tour Program Tab) Display TP status summary (Submitted, Requested, Approved counts). Filter by Year/Month via API parameters (e.g., 2082, Baisakh).
*   **F-DASH-05:** (Leave Tab) Display Leave balance/status overview.
*   **F-DASH-06:** (Sales Tabs) Display relevant sales summary data.
*   **F-DASH-07:** (Team Tab - Manager) Display team overview/status.
*   **F-DASH-08:** Populate Right Sidebar with Upcoming Events data.

### 4.4. User Management (Admin)
*   **F-UM-01:** CRUD operations for Users.
    *   *Implementation:* **Primarily handled via the Django Admin Interface.** Customize `UserAdmin` to display relevant fields.
*   **F-UM-02:** Assign Role (Django Group), Territory (ForeignKey), Manager (ForeignKey), Position (ForeignKey), Status (Active/Inactive).
*   **F-UM-03:** Implement Transfer/Promotion logic.
    *   *Implementation:* Via simple field updates in Django Admin or a custom Admin Action.
*   **F-UM-04:** Filter/Search user list.
    *   *Implementation:* Built-in feature of Django Admin (`list_filter`, `search_fields`).

### 4.5. Product Management (Admin)
*   **F-PROD-01:** CRUD operations for Products.
    *   *Implementation:* **Handled via the Django Admin Interface.** Register Product model.
*   **F-PROD-02:** Filter/Search product list.
    *   *Implementation:* Provided by Django Admin.

### 4.6. Master Data Management (Admin)
*   **F-MAST-01:** CRUD for Territories, Zones, Headquarters.
*   **F-MAST-02:** CRUD for Positions/Designations.
*   **F-MAST-03:** CRUD for other master lists (Expense Types, Leave Types).
    *   *Implementation:* **All handled via the Django Admin Interface.** Define models and register them.

### 4.7. Tour Program (TP)
*   **F-TP-01 (MR):** Create/Edit/Save Draft TP (React Frontend).
*   **F-TP-02 (MR):** Submit TP for Approval.
*   **F-TP-03 (MR):** View own TP history and status.
*   **F-TP-04 (Manager):** View pending/historical TPs for assigned MRs.
*   **F-TP-05 (Manager):** Approve/Reject TP with comments.
*   **F-TP-06:** Notification system integration.
    *   *Implementation:* Backend logic in DRF ViewSets/Views using Django ORM. Frontend interacts via API calls. Notifications via Django Signals/Celery.

### 4.8. Daily Call Report (DCR)
*   **F-DCR-01 (MR):** Create/Submit DCR for a date (link Doctors, Chemists visited, activities) (React Frontend).
*   **F-DCR-02 (MR):** View own DCR history.
*   **F-DCR-03 (Manager):** View DCRs of assigned MRs.
*   **F-DCR-04 (Admin):** "Delete DCR Analysis" function.
    *   *Implementation:* Backend logic in DRF. Admin function could be a custom **Django Admin Action** or management command. React frontend for MR/Manager views. Define "Analysis" clearly (e.g., delete selected DCR records).

### 4.9. Doctor/Chemist/Stockist Management
*   **F-CUST-01 (MR):** CRUD operations for Doctors/Clients (React Frontend).
*   **F-CUST-02 (MR):** CRUD operations for Chemists/Pharmacies (React Frontend).
*   **F-CUST-03 (Admin):** CRUD operations for Stockists.
    *   *Implementation:* MR interactions via DRF API & React frontend. Admin CRUD for Stockists (and potentially Doctors/Chemists) **can be handled via the Django Admin Interface.**
*   **F-CUST-04:** Link entities using Django ORM ForeignKey/ManyToManyField.

### 4.10. Leave Request
*   **F-LR-01 (MR):** Create/Submit Leave Request (React Frontend).
*   **F-LR-02 (MR):** View own Leave Request history and status.
*   **F-LR-03 (Manager):** View pending/historical Leave Requests.
*   **F-LR-04 (Manager):** Approve/Reject Leave Request.
*   **F-LR-05:** Notification system integration.
*   **F-LR-06 (Admin):** Manage Leave Types.
    *   *Implementation:* Backend logic in DRF ViewSets/Views. Admin management of Leave Types **via Django Admin**. Notifications via Signals/Celery.

### 4.11. Expense Management
*   **F-EXP-01 (MR):** Submit Expense Claims (React Frontend, with file upload).
*   **F-EXP-02 (MR):** View own Expense Claim history and status.
*   **F-EXP-03 (Manager):** View pending/historical Claims.
*   **F-EXP-04 (Manager):** Approve/Reject Claims.
*   **F-EXP-05 (Manager):** Initiate/Request "Expense Change" (Define workflow: Reject w/ comment? Edit draft?).
*   **F-EXP-06:** Notification system integration.
*   **F-EXP-07 (Admin):** Manage Expense Types.
    *   *Implementation:* Backend logic in DRF ViewSets/Views. File uploads via Django storage. Admin management of Expense Types **via Django Admin**. Notifications via Signals/Celery.

### 4.12. Sales Data Module
*   **F-SALES-01:** Mechanism to input/import sales data (Primary, Secondary).
    *   *Implementation:* Custom Django Form/View, Management Command for CSV import, or DRF endpoint.
*   **F-SALES-02/03/04:** View sales performance/data (React Frontend).
    *   *Implementation:* Data provided by DRF endpoints using optimized Django ORM queries.

### 4.13. Target Management
*   **F-TGT-01/02 (Admin):** Define, Set, Assign targets.
    *   *Implementation:* Manage **via Django Admin Interface** (custom `ModelAdmin` or inlines).
*   **F-TGT-03 (MR/Manager):** View assigned targets (React Frontend).
    *   *Implementation:* Data provided by DRF endpoint.

### 4.14. Transit Module
*   **F-TRAN-01/02/03:** Track movement, CRUD, View status.
    *   *Implementation:* Define Transit model. Backend logic in DRF ViewSets/Views. Frontend UI in React. Admin oversight via Django Admin.

### 4.15. Expiry Module
*   **F-EXPIRY-01/02:** Track Product expiry, View/Report near-expiry.
    *   *Implementation:* Requires Stock/Batch model linked to Product. Logic in Django models/managers and DRF views. Frontend UI in React.

### 4.16. Holiday Module
*   **F-HOL-01 (Admin):** Define holidays.
    *   *Implementation:* **Handled via Django Admin Interface.** Register Holiday model.
*   **F-HOL-02:** Display holidays on relevant calendars (React Frontend).
    *   *Implementation:* Fetch holiday data via a DRF endpoint.

### 4.17. Notice Module
*   **F-NOTICE-01/02 (Admin):** Create/Publish/Manage notices.
    *   *Implementation:* **Handled via Django Admin Interface.** Register Notice model.
*   **F-NOTICE-03 (All Roles):** View active notices (React Frontend).
    *   *Implementation:* Fetch notice data via a DRF endpoint. Mark as read functionality.

### 4.18. Reporting Module
*   **F-REP-01 to 07:** Generate various reports, filter, export.
    *   *Implementation:* Backend logic in Django views/DRF using complex ORM queries. Frontend UI in React (tables/charts). Exporting via Django libraries/CSV responses.

### 4.19. Settings Module (Admin)
*   **F-SET-01:** Manage application-level settings.
    *   *Implementation:* Use `django-constance` or custom singleton model managed **via Django Admin**.

### 4.20. Maintenance Module (Admin)
*   **F-MAIN-01:** Provide tools for data cleanup/administrative tasks.
    *   *Implementation:* **Django Management Commands**, possibly triggered via custom Django Admin actions.

### 4.21. Shared Files Module
*   **F-FILE-01 to 04:** Upload, Organize, View/Download, Access Control.
    *   *Implementation:* Use Django storage system. Metadata in model. DRF endpoints for interactions. React frontend for UI. Admin oversight via Django Admin.

## 5. Non-Functional Requirements

*   **NF-PERF-01:** Optimize Django ORM queries, use caching. Efficient DRF serializers. Frontend performance optimization.
*   **NF-SEC-01:** Leverage Django's built-in security features. Use DRF permissions. Secure coding practices. HTTPS.
*   **NF-USE-01:** React frontend intuitive. **Django Admin provides standard usability.**
*   **NF-REL-01:** Robust error handling (Django/DRF). Logging. Comprehensive testing (Pytest/Django TestCase, React Testing Library).
*   **NF-TECH-01:** Backend: Python, Django, Django REST Framework. Frontend: React. Database: **PostgreSQL recommended** (SQLite acceptable for initial local development only).
*   **NF-MAINT-01:** Follow Django conventions. Use migrations. Clean, testable code. Git.
*   **NF-SCALE-01:** Stateless API. Background tasks (Celery). Database optimization.
*   **NF-ACC-01:** Accessibility guidelines in React frontend. Django Admin baseline accessibility.

## 6. Design & UI/UX Considerations

*   **UI-01:** React frontend replicates SalesRM screenshot.
*   **UI-02:** Responsive design for desktop/laptop.
*   **UI-03/04:** Consistent visual elements/indicators in React frontend.
*   **UX-01:** Logical workflows in React frontend. **Django Admin standard workflows.**

## 7. Assumptions & Constraints

*   **A-01:** Developer proficient in Python, Django, DRF, React.
*   **A-02:** Heavy reliance on Django Admin for Admin tasks is desired.
*   **A-03/C-01:** Standard resource/cost assumptions.

## 8. Out of Scope (Unless specifically added later)

*   Real-time collaboration beyond notifications.
*   Offline functionality / PWA.
*   Native Mobile Apps.
*   Complex third-party integrations.
*   AI-driven insights.

---
# Part 2: Kanban Board Structure & Sample Tasks
---

**Purpose:** Track all development tasks for the complete SFA platform build using Django/DRF for the backend and React for the frontend. Tasks move left to right.

**Columns:**

*   **Backlog:** Comprehensive list of all features, chores, bugs, documentation tasks. NOT prioritized initially.
*   **To Do (Prioritized):** Tasks selected for the current development focus. Ready to be worked on.
*   **In Progress:** Tasks actively being worked on (Limit: 1-2).
*   **Blocked:** Tasks stalled due to dependencies or questions.
*   **Review / Testing:** Completed tasks needing verification/testing.
*   **Done:** Fully completed, tested, and merged tasks.

---

## Backlog (Sample - Needs Full Population based on PRD)

*(Illustrative: Break down *every* F-* requirement into tasks)*

**DJANGO BACKEND SETUP (Core)**
*   `- CHORE: Initialize Django Project`
*   `- CHORE: Setup Django Apps structure (e.g., users, tours, reports)`
*   `- CHORE: Configure Database - **Use PostgreSQL for Production/Staging (Setup Locally/Docker). Use SQLite ONLY for initial local dev.**`
*   `- CHORE: Setup Django REST Framework (DRF)`
*   `- CHORE: Setup DRF Auth (e.g., Simple JWT, dj-rest-auth)`
*   `- CHORE: Configure CORS Headers (django-cors-headers)`
*   `- CHORE: Implement Environment Variable Handling (e.g., python-dotenv, django-environ)`
*   `- CHORE: Setup Base API View/ViewSet Structure`
*   `- CHORE: Implement Basic Error Handling (DRF Exception Handler)`
*   `- CHORE: Setup Logging Configuration`
*   `- CHORE: Setup Git Repository`

**REACT FRONTEND SETUP (Core)**
*   `- CHORE: Initialize React Project (Vite/CRA)`
*   `- CHORE: Setup Frontend Folder Structure (components, pages, services, context)`
*   `- CHORE: Install Core Dependencies (axios, react-router-dom, state management lib)`
*   `- CHORE: Setup React Router`
*   `- CHORE: Setup API Service Layer (axios instance, base URL)`
*   `- CHORE: Implement Auth State Management (Context API / Redux)`
*   `- CHORE: Setup Basic Styling Approach (CSS Modules, Tailwind, MUI)`

**AUTHENTICATION & AUTHORIZATION**
*   `- DJ BE: Define Custom User Model (if needed) or use default`
*   `- DJ BE: Define Roles using Django Groups`
*   `- DJ BE API: Create User Registration Serializer/View (DRF)`
*   `- DJ BE API: Create Login Endpoint (DRF Simple JWT / dj-rest-auth)`
*   `- DJ BE API: Create Get User Profile Endpoint (DRF)`
*   `- DJ BE: Implement DRF Permission Classes for Roles`
*   `- R FE: Create Login Page UI`
*   `- R FE: Implement Login API Call & Token Storage`
*   `- R FE: Implement Registration API Call`
*   `- R FE: Implement Protected Routes based on Auth State`
*   `- R FE: Implement Logout (clear token, reset state)`
*   `- DJ BE: Implement Password Reset Logic/Endpoints`
*   `- R FE: Implement Password Reset UI Flow`

**DJANGO ADMIN TASKS (Admin Features)**
*   `- DJ ADMIN: Register User model with Admin Site`
*   `- DJ ADMIN: Customize UserAdmin (list_display, search_fields, list_filter, fieldsets)`
*   `- DJ ADMIN: Register Product model with Admin Site`
*   `- DJ ADMIN: Register Territory model with Admin Site`
*   `- DJ ADMIN: Register Position model with Admin Site`
*   `- DJ ADMIN: Register ExpenseType model with Admin Site`
*   `- DJ ADMIN: Register LeaveType model with Admin Site`
*   `- DJ ADMIN: Register Stockist model with Admin Site`
*   `- DJ ADMIN: Register Holiday model with Admin Site`
*   `- DJ ADMIN: Register Notice model with Admin Site`
*   `- DJ ADMIN: Configure Target Management in Admin (ModelAdmin/Inlines)`
*   `- DJ ADMIN: Configure Settings Management (django-constance or custom model)`
*   `- DJ ADMIN: Add Custom Admin Actions (e.g., for DCR deletion, User Promotion)`

**UI LAYOUT & DASHBOARD (React Frontend)**
*   `- R UI: Implement Main App Layout Component`
*   `- R UI: Implement Header Component`
*   `- R UI: Implement Collapsible Sidebar Component`
*   `- R UI: Implement Right Info Sidebar Component`
*   `- R FE: Integrate Routing with Layout`
*   `- R FE: Make Sidebar Collapse Functional`
*   `- R FE: Populate Sidebar Dynamically based on Role (API call)`
*   `- R FE: Highlight Active Sidebar Item`
*   `- R UI: Create Summary Card Component`
*   `- R UI: Create Tabbed Interface Component`
*   `- DJ BE API: Create Dashboard Data Endpoint (DRF)`
*   `- R FE: Fetch and Display Dashboard Data (Welcome, Cards, Tabs)`
*   `- R UI: Create Events List Component`
*   `- DJ BE API: Create Events Endpoint (DRF)`
*   `- R FE: Fetch and Display Events Data`

**TOUR PROGRAM (TP)**
*   `- DJ BE: Define TourProgram Model`
*   `- DJ BE API: Create TP Serializer (DRF)`
*   `- DJ BE API: Create TP ViewSet (DRF - handle CRUD, submit, approve/reject)`
*   `- DJ BE: Add Permissions to TP ViewSet (MR can create/submit, Manager can approve)`
*   `- R UI: Create Tour Program Page/Components`
*   `- R FE: Implement TP Form Logic`
*   `- R FE: Implement TP List/Status View (MR)`
*   `- R FE: Implement TP Approval View (Manager)`
*   `- R FE: Connect TP components to DRF API endpoints`
*   `- DJ BE: Implement TP Notifications (Signals/Celery)`

**DCR & Related Entities**
*   `- DJ BE: Define DCR Model`
*   `- DJ BE: Define Doctor Model`
*   `- DJ BE: Define Chemist Model`
*   `- DJ BE API: Create Doctor/Chemist Serializers/ViewSets (MR CRUD)`
*   `- DJ BE API: Create DCR Serializer/ViewSet (MR Create/View, Manager View)`
*   `- R UI: Create Doctor/Chemist Management Pages/Components (MR)`
*   `- R FE: Implement Doctor/Chemist CRUD Logic (MR)`
*   `- R UI: Create DCR Page/Form/List Components`
*   `- R FE: Implement DCR Create/Submit Logic (MR)`
*   `- R FE: Implement DCR View Logic (MR, Manager)`
*   `- DJ BE: Define/Implement 'Delete DCR Analysis' Logic (Admin Action/Command)`

**LEAVE REQUEST**
*   `- DJ BE: Define LeaveRequest Model`
*   `- DJ BE API: Create LeaveRequest Serializer/ViewSet`
*   `- DJ BE: Add Permissions to LeaveRequest ViewSet`
*   `- R UI: Create Leave Request Page/Components`
*   `- R FE: Implement Leave Request Form/List/Approval Logic`
*   `- R FE: Connect Leave components to DRF API`
*   `- DJ BE: Implement Leave Notifications`

**EXPENSE MANAGEMENT**
*   `- DJ BE: Define ExpenseClaim Model (incl. FileField for attachments)`
*   `- DJ BE: Configure File Storage (MEDIA_ROOT, MEDIA_URL)`
*   `- DJ BE API: Create ExpenseClaim Serializer/ViewSet (handle file upload)`
*   `- DJ BE: Add Permissions to ExpenseClaim ViewSet`
*   `- R UI: Create Expense Claim Page/Components`
*   `- R FE: Implement Expense Form (incl. file upload)`
*   `- R FE: Implement Expense List/Approval Logic`
*   `- R FE: Connect Expense components to DRF API`
*   `- DJ BE: Implement Expense Notifications`
*   `- DJ BE: Define 'Expense Change' workflow logic`

**SALES DATA / TARGETS / TRANSIT / EXPIRY / etc. (Follow Pattern)**
*   `- DJ BE: Define Model(s)`
*   `- DJ ADMIN: Register Model(s) with Admin (if Admin managed)`
*   `- DJ BE API: Create Serializer(s) / ViewSet(s) / Endpoint(s) (DRF)`
*   `- DJ BE: Implement necessary business logic/permissions`
*   `- R UI: Create relevant Pages/Components`
*   `- R FE: Implement UI logic and connect to API endpoints`

**REPORTING**
*   `- DJ BE API: Create DRF Endpoints for each required report`
*   `- DJ BE: Implement complex ORM queries (aggregates, annotations) for reports`
*   `- R UI: Create Reports Section/Page`
*   `- R UI: Implement Report Filters Component`
*   `- R UI: Implement Report Display Component (Tables, potentially Charts)`
*   `- R FE: Fetch and display report data`
*   `- DJ BE: Implement CSV Export functionality for reports`

**NOTIFICATIONS**
*   `- DJ BE: Choose Notification approach (django-notifications, custom model, Celery)`
*   `- DJ BE: Implement Signal receivers or task triggers for events (TP status, Leave, Expense)`
*   `- DJ BE API: Create Endpoint to fetch notifications for user`
*   `- R FE: Implement Notification indicator/dropdown in Header`
*   `- R FE: Fetch and display notifications`
*   `- R FE: Implement 'Mark as Read' functionality`

**TESTING & NON-FUNCTIONAL**
*   `- TEST: Setup Pytest for Django Backend`
*   `- TEST: Write Unit/Integration Tests for Models, Views, Serializers (Backend)`
*   `- TEST: Setup Jest/React Testing Library for Frontend`
*   `- TEST: Write Component/Integration Tests (Frontend)`
*   `- CHORE: Setup Linting/Formatting (Flake8/Black for Python, ESLint/Prettier for JS)`
*   `- DOC: Document API using DRF Browsable API / Swagger / OpenAPI (drf-spectacular)`
*   `- DOC: Write README file with setup/run instructions`
*   `- CHORE: Configure Deployment Strategy (e.g., Docker, Heroku, Server setup)`
*   `- CHORE: Performance & Security Reviews`

---

**Using the Board:**

1.  Populate the full **Backlog** based on the PRD, breaking down features into these granular tasks.
2.  Prioritize tasks into **To Do**, starting with foundational Setup, Auth, and Core UI. Then, tackle modules based on dependencies. Leverage the Django Admin heavily.
3.  Follow the standard Kanban flow: **In Progress** -> **Review / Testing** -> **Done**.
4.  Keep tasks small and manageable.
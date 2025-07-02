# Architecture Overview: SFA Platform (Django + React)

## 1. Introduction

This document describes the architecture of the Sales Force Automation (SFA) Platform. It utilizes a decoupled frontend/backend approach, leveraging the strengths of Django/DRF for the backend API and React for the interactive frontend Single Page Application (SPA).

## 2. High-Level Architecture

The system follows a classic **Client-Server architecture**:

*   **Client (Frontend):** A React-based Single Page Application (SPA) running in the user's web browser. It handles the user interface, user interactions, and makes asynchronous requests to the backend API for data and actions.
*   **Server (Backend):** A Python/Django application exposing a RESTful API built with Django REST Framework (DRF). It handles business logic, data persistence (interacting with the PostgreSQL database), authentication, authorization, and serving data to the frontend.
*   **Database:** A PostgreSQL relational database storing all application data.
*   **API Communication:** The Frontend and Backend communicate exclusively via RESTful API calls over HTTPS, typically exchanging data in JSON format. Authentication is handled via JWT (JSON Web Tokens) sent in request headers.

+---------------------+ HTTPS (JSON API Calls) +------------------------+
| | <----------------------------------> | |
| React Frontend SPA | (JWT Auth in Headers) | Django/DRF Backend |
| (User's Browser) | | (Application Server) |
| | | |
+---------------------+ +-----------+------------+
|
| DB Connection (ORM)
|
+-------+--------+
| |
| PostgreSQL |
| Database |
| |
+----------------+



## 3. Backend Architecture (Django/DRF)

*   **Core Frameworks:** Python, Django, Django REST Framework (DRF).
*   **Design Pattern:** Primarily follows Django's Model-View-Template (MVT) pattern, adapted for APIs using DRF:
    *   **Models:** (`models.py`) Define the database schema using Django ORM classes. Represent application data structures.
    *   **Views/ViewSets:** (`views.py`) Handle incoming API requests, interact with models (via ORM), apply business logic, and utilize serializers to format responses. DRF ViewSets provide standard CRUD operations efficiently.
    *   **Serializers:** (`serializers.py`) Convert complex data types (like Django model instances) to native Python datatypes that can be easily rendered into JSON, and vice-versa for parsing incoming request data. Also handle data validation.
    *   **URLs:** (`urls.py`) Map URL patterns to specific Views/ViewSets using Django's URL dispatcher and DRF Routers.
    *   **Templates:** (`templates/` - Primarily used for Django Admin and potentially server-rendered email templates, not for the main SPA UI).
*   **Key Django Concepts Used:**
    *   **ORM:** Interacting with the PostgreSQL database abstractly.
    *   **Migrations:** Managing database schema changes (`makemigrations`, `migrate`).
    *   **Authentication:** `django.contrib.auth` for user models and core auth logic. DRF Simple JWT (or similar) for token generation/validation.
    *   **Permissions:** Django's Groups/Permissions framework combined with DRF Permission classes (`IsAuthenticated`, `IsAdminUser`, custom permissions) to control API access.
    *   **Admin Interface:** `django.contrib.admin` provides a powerful, auto-generated interface for Admin users to manage core data models. Heavily customized for this project's Admin requirements.
*   **Major Django Apps:** The backend is structured into logical Django apps:
    *   `core`: Project settings, root URL configuration.
    *   `users`: User model customization, authentication endpoints, profile management.
    *   `masters`: Models for core data like Products, Territories, Positions, Doctors, Chemists, Stockists, Holidays, Notices.
    *   `tours`: Models, Views, Serializers for Tour Programs.
    *   `reports`: Models, Views, Serializers for DCRs and generating various reports.
    *   `leaves`: Models, Views, Serializers for Leave Requests.
    *   `expenses`: Models, Views, Serializers for Expense Claims.
    *   `sales`: Models, Views, Serializers for Sales Data and Targets.
    *   `transit`: Models, Views, Serializers for Transit module.
    *   `files`: Models, Views, Serializers for Shared Files.
    *   `api`: (Optional) Central place for aggregating API URLs from different apps.
*   **Database:** PostgreSQL is used, interacted with exclusively via the Django ORM.
*   **Background Tasks:** Celery (with Redis or RabbitMQ as a broker) is recommended for handling asynchronous tasks like sending notifications, generating large reports, or processing data imports to avoid blocking API requests.

## 4. Frontend Architecture (React)

*   **Core Libraries:** React, React Router DOM (for routing), Axios (for API calls).
*   **State Management:** A dedicated library like Redux Toolkit, Zustand, or potentially React's built-in Context API (for simpler state needs) will manage global application state (e.g., authenticated user, roles, global settings, potentially some cached data). Component-local state managed via `useState`, `useReducer`.
*   **Component Structure:** A consistent component structure (e.g., Atomic Design principles, or grouping by feature/page) is used for maintainability. Reusable UI components (Buttons, Inputs, Modals, Tables) are separated from page-level components.
*   **Routing:** `react-router-dom` handles client-side routing, mapping URLs to specific page components. Protected routes ensure only authenticated users with appropriate roles can access certain pages.
*   **API Interaction:** A dedicated service layer (e.g., `src/services/api.js`) using Axios abstracts API calls. An Axios instance is configured with the base URL and interceptors to automatically attach the JWT authentication token to outgoing requests and potentially handle global error responses (like 401 Unauthorized).
*   **Styling:** A consistent styling approach (e.g., CSS Modules for scoped styles, Tailwind CSS for utility-first, or a component library like Material UI/Ant Design) ensures a cohesive look and feel matching the target design.
*   **Build Tool:** Vite or Create React App is used for development server, bundling, and building the production assets.

## 5. API Communication

*   **Protocol:** HTTPS.
*   **Format:** JSON.
*   **Style:** RESTful principles.
*   **Authentication:** JWT Bearer tokens. The frontend obtains a token upon login and sends it in the `Authorization: Bearer <token>` header for subsequent authenticated requests. Refresh tokens are likely used to maintain sessions securely.
*   **Versioning:** (Optional but recommended for future changes) API versioning can be implemented via URL path (`/api/v1/`) or request headers.

## 6. Data Flow Example (Submitting a DCR)

1.  **Frontend (React):**
    *   User fills out the DCR form in the React application.
    *   On submit, the frontend component gathers form data.
    *   A function in the API service layer is called with the DCR data.
    *   Axios makes a `POST` request to the relevant DRF endpoint (e.g., `/api/dcrs/`) with the DCR data in the request body and the JWT in the `Authorization` header.
2.  **Backend (Django/DRF):**
    *   Django URL dispatcher routes the request to the DCR ViewSet.
    *   DRF authentication classes verify the JWT token.
    *   DRF permission classes check if the authenticated user (an MR) has permission to create a DCR.
    *   The ViewSet uses the DCR Serializer to validate the incoming JSON data.
    *   If valid, the serializer's `.save()` method (or custom logic in the view) creates a new DCR model instance, associating it with the `request.user` and linking related Doctors/Chemists.
    *   The ViewSet returns a success response (e.g., `201 Created`) with the serialized data of the newly created DCR.
3.  **Frontend (React):**
    *   Axios receives the success response.
    *   The API service function returns the successful result to the component.
    *   The component updates its state, potentially clears the form, displays a success message, and possibly navigates the user or updates a list of DCRs.
# API Documentation: SFA Platform

## 1. Introduction

This document provides an overview of the RESTful API for the Sales Force Automation (SFA) Platform backend, built with Django REST Framework (DRF). The frontend interacts with these endpoints to fetch data and perform actions.

*   **Base URL:** Assumed to be `/api/` relative to the backend server address (e.g., `http://127.0.0.1:8000/api/`).
*   **Format:** All requests and responses use JSON.
*   **Authentication:** Most endpoints require authentication. Use JSON Web Tokens (JWT) sent as a Bearer token in the `Authorization` header:
    `Authorization: Bearer <your_access_token>`
    Obtain tokens via the `/auth/login/` endpoint. Refresh tokens may be used via `/auth/token/refresh/`.

**Note:** This documentation provides examples. For complete, up-to-date details, refer to the auto-generated Swagger/OpenAPI documentation (if implemented using tools like `drf-spectacular`) or the DRF Browsable API provided by the running backend server.

## 2. Authentication Endpoints (`/auth/`)

*(Endpoint URLs may vary slightly based on the chosen DRF auth library, e.g., Simple JWT or dj-rest-auth)*

*   **`POST /auth/login/`**
    *   **Description:** Authenticates a user and returns access and refresh tokens.
    *   **Auth:** None required.
    *   **Request Body:** `{ "username": "user@example.com", "password": "yourpassword" }`
    *   **Success Response (200 OK):** `{ "access": "eyJ...", "refresh": "eyJ..." }`
    *   **Error Response (401 Unauthorized):** `{ "detail": "No active account found with the given credentials" }`
*   **`POST /auth/register/`** (If public registration is enabled)
    *   **Description:** Creates a new user account.
    *   **Auth:** None required.
    *   **Request Body:** `{ "username": "...", "email": "...", "password": "...", "first_name": "...", ... }`
    *   **Success Response (201 Created):** `{ "id": 1, "username": "...", ... }`
    *   **Error Response (400 Bad Request):** Validation errors.
*   **`POST /auth/token/refresh/`**
    *   **Description:** Uses a valid refresh token to obtain a new access token.
    *   **Auth:** None required.
    *   **Request Body:** `{ "refresh": "eyJ..." }`
    *   **Success Response (200 OK):** `{ "access": "eyJ..." }`
    *   **Error Response (401 Unauthorized):** If refresh token is invalid/expired.
*   **`GET /auth/user/`**
    *   **Description:** Retrieves details for the currently authenticated user (often used after login to get roles/permissions).
    *   **Auth:** Required (Valid access token).
    *   **Success Response (200 OK):** `{ "id": 1, "username": "...", "email": "...", "roles": ["MR"], "first_name": "...", "last_name": "...", ... }`
*   **`POST /auth/password/reset/`** (Example URL)
    *   **Description:** Initiates the password reset process (e.g., sends an email).
    *   **Auth:** None required.
    *   **Request Body:** `{ "email": "user@example.com" }`
    *   **Success Response (200 OK):** Confirmation message.
*   **`POST /auth/password/reset/confirm/`** (Example URL)
    *   **Description:** Sets a new password using tokens sent via email.
    *   **Auth:** None required.
    *   **Request Body:** `{ "uid": "...", "token": "...", "new_password1": "...", "new_password2": "..." }`
    *   **Success Response (200 OK):** Confirmation message.

## 3. Module API Examples

*(These are illustrative examples based on the PRD. Actual endpoint structure (e.g., ViewSets vs Views) and fields depend on Serializer/ViewSet implementation. Permissions are key.)*

### 3.1. Dashboard (`/dashboard/`)

*   **`GET /dashboard/`**
    *   **Description:** Retrieves role-specific dashboard data (summary cards, TP status, etc.).
    *   **Auth:** Required (MR, Manager, Admin).
    *   **Success Response (200 OK):** Varies by role. Example for MR:
        ```json
        {
          "welcome_message": "Welcome, MR User",
          "summary_cards": { "doctors": 15, "chemists": 25, ... },
          "tour_program": {
            "current_month": 10,
            "current_year": 2023,
            "status": "Approved",
            "submitted_count": 1,
            "approved_count": 1,
            "pending_count": 0
          },
          "leave_summary": { "balance": 10, "pending_requests": 0 },
          "upcoming_events": [ ... ]
        }
        ```

### 3.2. Tour Programs (`/tours/`)

*   **`GET /tours/`**
    *   **Description:** List Tour Programs. MRs see own, Managers see their team's. Supports filtering (`?user_id=`, `?year=`, `?month=`, `?status=`).
    *   **Auth:** Required (MR, Manager, Admin).
    *   **Success Response (200 OK):** `[ { "id": 1, "user": 5, "user_name": "MR User", "month": 10, "year": 2023, "status": "Approved", "submitted_at": "...", "approved_at": "...", ... }, ... ]`
*   **`POST /tours/`**
    *   **Description:** Create a new Tour Program (as MR). Status defaults to 'Draft' or 'Submitted' based on logic.
    *   **Auth:** Required (MR).
    *   **Request Body:** `{ "month": 11, "year": 2023, "area_details": "Plan for November..." }`
    *   **Success Response (201 Created):** `{ "id": 2, "user": 5, "month": 11, ... }`
*   **`GET /tours/{id}/`**
    *   **Description:** Retrieve details of a specific Tour Program.
    *   **Auth:** Required (Owner MR, their Manager, Admin).
    *   **Success Response (200 OK):** `{ "id": 1, ... }`
*   **`PATCH /tours/{id}/`**
    *   **Description:** Partially update a Tour Program (e.g., MR submits a draft).
    *   **Auth:** Required (Owner MR for Draft edits/submit).
    *   **Request Body (Submit):** `{ "status": "Submitted" }`
    *   **Success Response (200 OK):** Updated Tour Program object.
*   **`POST /tours/{id}/approve/`** (Example Custom Action)
    *   **Description:** Approve a submitted Tour Program (as Manager).
    *   **Auth:** Required (Manager of the MR).
    *   **Request Body:** `{ "manager_comments": "Looks good." }`
    *   **Success Response (200 OK):** Updated Tour Program object or confirmation.
*   **`POST /tours/{id}/reject/`** (Example Custom Action)
    *   **Description:** Reject a submitted Tour Program (as Manager).
    *   **Auth:** Required (Manager of the MR).
    *   **Request Body:** `{ "manager_comments": "Please revise Section 3." }`
    *   **Success Response (200 OK):** Updated Tour Program object or confirmation.

### 3.3. Daily Call Reports (`/dcrs/`)

*   **`GET /dcrs/`**
    *   **Description:** List DCRs. MRs see own, Managers see team's. Filter by user (`?user_id=`), date range (`?date_after=...&date_before=...`).
    *   **Auth:** Required (MR, Manager, Admin).
    *   **Success Response (200 OK):** `[ { "id": 10, "user": 5, "user_name": "MR User", "date": "2023-10-27", "doctors_visited": [1, 3], "chemists_visited": [5], "summary": "...", "submitted_at": "..." }, ... ]`
*   **`POST /dcrs/`**
    *   **Description:** Create a new DCR (as MR).
    *   **Auth:** Required (MR).
    *   **Request Body:** `{ "date": "2023-10-27", "summary": "Visited Dr. A and B...", "doctors_visited": [1, 2], "chemists_visited": [5] }` *(IDs reference Doctor/Chemist objects)*
    *   **Success Response (201 Created):** `{ "id": 11, ... }`
*   **`GET /dcrs/{id}/`**
    *   **Description:** Retrieve details of a specific DCR.
    *   **Auth:** Required (Owner MR, their Manager, Admin).
    *   **Success Response (200 OK):** `{ "id": 10, ... }`
*   **`DELETE /dcrs/{id}/`**
    *   **Description:** Delete a specific DCR. Permissions likely restricted (e.g., Admin only, or MR if DCR is recent/not processed).
    *   **Auth:** Required (Admin or specific permission).
    *   **Success Response (204 No Content):**

### 3.4. Master Data (Examples: Doctors, Territories)

*   **`GET /doctors/`**
    *   **Description:** List Doctors. MRs might see only theirs, Managers their team's + own, Admin all. Supports search (`?search=Smith`), filtering by territory, etc.
    *   **Auth:** Required (MR, Manager, Admin).
    *   **Success Response (200 OK):** `[ { "id": 1, "name": "Dr. Alice Smith", "specialty": "...", ... }, ... ]`
*   **`POST /doctors/`**
    *   **Description:** Add a new Doctor (as MR).
    *   **Auth:** Required (MR).
    *   **Request Body:** `{ "name": "Dr. Bob Jones", "specialty": "Cardiology", "location": "...", ... }`
    *   **Success Response (201 Created):** `{ "id": 2, ... }`
*   **`GET /territories/`**
    *   **Description:** List Territories (often needed for dropdowns).
    *   **Auth:** Required (Any authenticated user might need this).
    *   **Success Response (200 OK):** `[ { "id": 1, "name": "North Zone - Area 1", ... }, ... ]`

### 3.5. Leave Requests (`/leaves/`)

*   **`GET /leaves/`**
    *   **Description:** List Leave Requests (similar visibility rules as TPs). Filter by status, date range.
    *   **Auth:** Required (MR, Manager, Admin).
    *   **Success Response (200 OK):** `[ { "id": 3, "user": 5, "start_date": "...", "end_date": "...", "status": "Pending", ... }, ... ]`
*   **`POST /leaves/`**
    *   **Description:** Create a new Leave Request (as MR).
    *   **Auth:** Required (MR).
    *   **Request Body:** `{ "leave_type": 1, "start_date": "2023-11-15", "end_date": "2023-11-16", "reason": "Personal" }`
    *   **Success Response (201 Created):** `{ "id": 4, ... }`
*   **`POST /leaves/{id}/approve/`** (Custom Action)
    *   **Description:** Approve Leave Request (as Manager).
    *   **Auth:** Required (Manager).
    *   **Success Response (200 OK):** Updated Leave Request object.
*   **`POST /leaves/{id}/reject/`** (Custom Action)
    *   **Description:** Reject Leave Request (as Manager).
    *   **Auth:** Required (Manager).
    *   **Request Body:** `{ "manager_comments": "Dates conflict with team meeting." }`
    *   **Success Response (200 OK):** Updated Leave Request object.

### 3.6. Expense Claims (`/expenses/`)

*   **`GET /expenses/`**
    *   **Description:** List Expense Claims (similar visibility/filtering).
    *   **Auth:** Required (MR, Manager, Admin).
    *   **Success Response (200 OK):** `[ { "id": 7, "user": 5, "expense_type_name": "Travel", "amount": "55.00", "status": "Approved", ... }, ... ]`
*   **`POST /expenses/`**
    *   **Description:** Create a new Expense Claim (as MR). Often uses `multipart/form-data` if including file uploads.
    *   **Auth:** Required (MR).
    *   **Request Body:** `{ "expense_type": 2, "amount": "25.50", "date": "2023-10-26", "description": "Lunch with client", "attachment": <file_data> }`
    *   **Success Response (201 Created):** `{ "id": 8, ... }`
*   **(Approval/Rejection endpoints similar to Leave/TP)**

### 3.7. Notifications (`/notifications/`)

*   **`GET /notifications/`**
    *   **Description:** List notifications for the current user. Filter by read status (`?read=false`).
    *   **Auth:** Required.
    *   **Success Response (200 OK):** `[ { "id": 1, "verb": "approved your Tour Program", "timestamp": "...", "read": false, "target": { "type": "TourProgram", "id": 1 } }, ... ]`
*   **`POST /notifications/mark-all-as-read/`** (Custom Action)
    *   **Description:** Mark all unread notifications as read.
    *   **Auth:** Required.
    *   **Success Response (200 OK / 204 No Content):**
*   **`POST /notifications/{id}/mark-as-read/`** (Custom Action)
    *   **Description:** Mark a specific notification as read.
    *   **Auth:** Required.
    *   **Success Response (200 OK / 204 No Content):**

*(Continue documenting key endpoints for other modules like Sales, Targets, Transit, Files, etc., following this pattern. Define specific payload structures and permissions for each).*

## 4. Common Conventions

*   **Pagination:** List endpoints (`GET /resource/`) will likely use pagination (e.g., DRF's `PageNumberPagination` or `LimitOffsetPagination`). Responses will include `count`, `next`, `previous`, and `results` fields. Use query parameters like `?page=2` or `?limit=10&offset=10`.
*   **Filtering:** Use query parameters for filtering lists (e.g., `?status=Pending`, `?user_id=5`, `?date_after=YYYY-MM-DD`). Specific filter fields depend on backend implementation (`django-filter`).
*   **Searching:** Use a `search` query parameter for full-text search on relevant fields (e.g., `?search=keyword`).
*   **Ordering:** Use an `ordering` query parameter (e.g., `?ordering=date` for ascending, `?ordering=-date` for descending).
*   **Error Responses:**
    *   `400 Bad Request`: Validation errors (response body contains field-specific errors).
    *   `401 Unauthorized`: Authentication credentials were not provided or are invalid.
    *   `403 Forbidden`: Authenticated user does not have permission to perform the action.
    *   `404 Not Found`: Resource does not exist.
    *   `500 Internal Server Error`: Unexpected server error.
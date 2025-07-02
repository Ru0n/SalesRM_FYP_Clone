# Database Schema Overview (Django Models)

## 1. Introduction

This document outlines the core database schema for the SFA Platform, implemented using Django Models and the Django ORM. The target database is **PostgreSQL**. Primary Keys (`id`) are typically auto-incrementing integers managed by Django unless otherwise specified. Relationships like ForeignKey (One-to-Many) and ManyToManyField are crucial for representing the connections between different data entities.

## 2. Core Models & Relationships

### User & Auth Models

*   **`User` (`django.contrib.auth.models.User` or Custom User Model)**
    *   **Description:** Represents an individual user (MR, Manager, Admin) interacting with the system.
    *   **Core Fields:** `id` (PK), `password` (Hashed), `last_login`, `is_superuser` (Admin flag), `username`, `first_name`, `last_name`, `email`, `is_staff` (Admin access flag), `is_active`, `date_joined`.
    *   **Custom Fields (Example if extending `AbstractUser`):**
        *   `manager` (ForeignKey to `self`, null=True, blank=True, related_name='team_members', on_delete=models.SET_NULL) - Links MR to their Manager.
        *   `territory` (ForeignKey to `Territory`, null=True, blank=True, on_delete=models.SET_NULL) - User's primary territory.
        *   `position` (ForeignKey to `Position`, null=True, blank=True, on_delete=models.SET_NULL) - User's job title/role designation.
    *   **Relationships:**
        *   Belongs to Django `Group`(s) representing roles (ManyToMany).
        *   Can create many `TourProgram`, `DailyCallReport`, `LeaveRequest`, `ExpenseClaim`, `SalesData`, `Target` records (One-to-Many via ForeignKey).
        *   Can add many `Doctor`, `Chemist` records (One-to-Many via ForeignKey `added_by`).
        *   Can be assigned many `Target` records (One-to-Many via ForeignKey).
        *   Can dispatch/receive `Transit` records.
        *   Can upload `SharedFile` records.
        *   Can create `Notice` records (if Admin).
*   **`Group` (`django.contrib.auth.models.Group`)**
    *   **Description:** Represents user roles (e.g., "MR", "Manager", "Admin"). Used for permissions.
    *   **Fields:** `id` (PK), `name`.
    *   **Relationships:** Users belong to Groups (ManyToMany). Groups can have Permissions (ManyToMany).

### Master Data Models (Primarily Admin Managed via Django Admin)

*   **`Territory`**
    *   **Description:** Defines geographical or organizational sales areas.
    *   **Fields:** `id` (PK), `name` (CharField - Unique), `zone` (CharField, null=True, blank=True), `headquarter` (CharField, null=True, blank=True), `is_active` (BooleanField, default=True).
*   **`Position`**
    *   **Description:** Defines job titles or roles within the organization structure.
    *   **Fields:** `id` (PK), `name` (CharField - Unique), `is_active` (BooleanField, default=True).
*   **`Product`**
    *   **Description:** Represents products being sold or detailed.
    *   **Fields:** `id` (PK), `name` (CharField - Unique), `description` (TextField, null=True, blank=True), `category` (CharField, null=True, blank=True), `sku` (CharField, null=True, blank=True, unique=True), `is_active` (BooleanField, default=True).
*   **`Doctor`**
    *   **Description:** Represents healthcare professionals targeted by MRs.
    *   **Fields:** `id` (PK), `name` (CharField), `specialty` (CharField, null=True, blank=True), `location` (TextField, null=True, blank=True), `contact_number` (CharField, null=True, blank=True), `email` (EmailField, null=True, blank=True), `added_by` (ForeignKey to `User`, on_delete=models.SET_NULL, null=True), `created_at` (DateTimeField, auto_now_add=True), `updated_at` (DateTimeField, auto_now=True), `is_active` (BooleanField, default=True).
*   **`Chemist`**
    *   **Description:** Represents pharmacies or chemists visited by MRs.
    *   **Fields:** `id` (PK), `name` (CharField), `location` (TextField, null=True, blank=True), `contact_person` (CharField, null=True, blank=True), `contact_number` (CharField, null=True, blank=True), `added_by` (ForeignKey to `User`, on_delete=models.SET_NULL, null=True), `created_at` (DateTimeField, auto_now_add=True), `updated_at` (DateTimeField, auto_now=True), `is_active` (BooleanField, default=True).
*   **`Stockist`**
    *   **Description:** Represents distributors or stockists.
    *   **Fields:** `id` (PK), `name` (CharField), `location` (TextField, null=True, blank=True), `contact_person` (CharField, null=True, blank=True), `contact_number` (CharField, null=True, blank=True), `created_at` (DateTimeField, auto_now_add=True), `updated_at` (DateTimeField, auto_now=True), `is_active` (BooleanField, default=True).
*   **`Holiday`**
    *   **Description:** Defines company/regional holidays.
    *   **Fields:** `id` (PK), `date` (DateField - Unique), `description` (CharField), `region` (CharField, null=True, blank=True).
*   **`Notice`**
    *   **Description:** Represents announcements or notices for users.
    *   **Fields:** `id` (PK), `title` (CharField), `content` (TextField), `created_by` (ForeignKey to `User`, on_delete=models.SET_NULL, null=True), `created_at` (DateTimeField, auto_now_add=True), `is_active` (BooleanField, default=True), `publish_date` (DateField), `expiry_date` (DateField, null=True, blank=True).
*   **`LeaveType`**
    *   **Description:** Defines different types of leave (e.g., Sick, Casual, Annual).
    *   **Fields:** `id` (PK), `name` (CharField - Unique), `is_active` (BooleanField, default=True).
*   **`ExpenseType`**
    *   **Description:** Defines different categories of expenses (e.g., Travel, Food, Accommodation).
    *   **Fields:** `id` (PK), `name` (CharField - Unique), `is_active` (BooleanField, default=True).

### Operational Models (Created/Managed by MRs, Managers, System)

*   **`TourProgram`**
    *   **Description:** Represents an MR's planned tour for a specific month/year.
    *   **Fields:** `id` (PK), `user` (ForeignKey to `User`, on_delete=models.CASCADE), `month` (IntegerField), `year` (IntegerField), `area_details` (TextField), `status` (CharField - choices: Draft, Submitted, Approved, Rejected), `submitted_at` (DateTimeField, null=True, blank=True), `reviewed_at` (DateTimeField, null=True, blank=True), `reviewed_by` (ForeignKey to `User`, related_name='reviewed_tours', on_delete=models.SET_NULL, null=True, blank=True), `manager_comments` (TextField, null=True, blank=True), `created_at` (DateTimeField, auto_now_add=True), `updated_at` (DateTimeField, auto_now=True).
    *   **Constraints:** Unique together (`user`, `month`, `year`).
*   **`DailyCallReport` (DCR)**
    *   **Description:** Represents an MR's daily activity report.
    *   **Fields:** `id` (PK), `user` (ForeignKey to `User`, on_delete=models.CASCADE), `date` (DateField), `summary` (TextField), `work_type` (CharField - choices: FieldWork, OfficeWork, Leave, Holiday, etc.), `submitted_at` (DateTimeField, auto_now_add=True).
    *   **Relationships:**
        *   `doctors_visited` (ManyToManyField to `Doctor`, blank=True)
        *   `chemists_visited` (ManyToManyField to `Chemist`, blank=True)
    *   **Constraints:** Unique together (`user`, `date`).
*   **`LeaveRequest`**
    *   **Description:** Represents a leave request submitted by a user.
    *   **Fields:** `id` (PK), `user` (ForeignKey to `User`, on_delete=models.CASCADE), `leave_type` (ForeignKey to `LeaveType`, on_delete=models.PROTECT), `start_date` (DateField), `end_date` (DateField), `reason` (TextField), `status` (CharField - choices: Pending, Approved, Rejected, Cancelled), `requested_at` (DateTimeField, auto_now_add=True), `reviewed_by` (ForeignKey to `User`, related_name='reviewed_leaves', on_delete=models.SET_NULL, null=True, blank=True), `reviewed_at` (DateTimeField, null=True, blank=True), `manager_comments` (TextField, null=True, blank=True).
*   **`ExpenseClaim`**
    *   **Description:** Represents an expense claim submitted by a user.
    *   **Fields:** `id` (PK), `user` (ForeignKey to `User`, on_delete=models.CASCADE), `expense_type` (ForeignKey to `ExpenseType`, on_delete=models.PROTECT), `amount` (DecimalField), `date` (DateField), `description` (TextField), `status` (CharField - choices: Pending, Approved, Rejected, Queried), `submitted_at` (DateTimeField, auto_now_add=True), `reviewed_by` (ForeignKey to `User`, related_name='reviewed_expenses', on_delete=models.SET_NULL, null=True, blank=True), `reviewed_at` (DateTimeField, null=True, blank=True), `manager_comments` (TextField, null=True, blank=True), `attachment` (FileField, upload_to='expense_attachments/', null=True, blank=True).
*   **`SalesData`**
    *   **Description:** Represents sales figures, potentially imported or entered.
    *   **Fields:** `id` (PK), `user` (ForeignKey to `User`, on_delete=models.SET_NULL, null=True, blank=True), `territory` (ForeignKey to `Territory`, on_delete=models.SET_NULL, null=True, blank=True), `product` (ForeignKey to `Product`, on_delete=models.PROTECT), `period_start` (DateField), `period_end` (DateField), `value` (DecimalField), `units` (IntegerField, null=True, blank=True), `type` (CharField - choices: Primary, Secondary), `entry_date` (DateField, auto_now_add=True), `source` (CharField, null=True, blank=True - e.g., 'Import', 'Manual').
*   **`Target`**
    *   **Description:** Represents targets assigned to users.
    *   **Fields:** `id` (PK), `user` (ForeignKey to `User`, on_delete=models.CASCADE), `metric` (CharField - e.g., "Sales Value", "Visits", "Product Units"), `value_target` (DecimalField, null=True, blank=True), `unit_target` (IntegerField, null=True, blank=True), `period_start` (DateField), `period_end` (DateField), `product` (ForeignKey to `Product`, on_delete=models.CASCADE, null=True, blank=True - for product-specific targets), `set_by` (ForeignKey to `User`, related_name='set_targets', on_delete=models.SET_NULL, null=True), `set_at` (DateTimeField, auto_now_add=True).
*   **`Transit`**
    *   **Description:** Tracks the movement of goods or samples.
    *   **Fields:** `id` (PK), `item_description` (TextField), `quantity` (IntegerField), `from_location` (CharField), `to_location` (CharField), `dispatched_by` (ForeignKey to `User`, related_name='dispatched_transits', on_delete=models.SET_NULL, null=True), `received_by` (ForeignKey to `User`, related_name='received_transits', on_delete=models.SET_NULL, null=True, blank=True), `dispatch_date` (DateTimeField), `received_date` (DateTimeField, null=True, blank=True), `status` (CharField - choices: Dispatched, InTransit, Received, Cancelled).
*   **`SharedFile`**
    *   **Description:** Stores metadata about uploaded files.
    *   **Fields:** `id` (PK), `uploaded_by` (ForeignKey to `User`, on_delete=models.SET_NULL, null=True), `file` (FileField, upload_to='shared_files/'), `description` (TextField, null=True, blank=True), `uploaded_at` (DateTimeField, auto_now_add=True).

### Auxiliary Models (Examples)

*   **`Notification`** (If using a custom notification model, e.g., with `django-notifications-hq` or similar concept)
    *   **Description:** Records notifications for users.
    *   **Fields:** `id`, `recipient` (ForeignKey to `User`), `actor` (GenericForeignKey), `verb` (CharField), `target` (GenericForeignKey, optional), `action_object` (GenericForeignKey, optional), `timestamp`, `unread` (BooleanField), `level` (CharField - e.g., info, success, warning).

## 3. Relationships Summary (Key Examples)

*   `User` <> `Group`: ManyToMany
*   `User` (Manager) -> `User` (MR): OneToMany (via `manager` field)
*   `User` -> `Territory`/`Position`: ManyToOne
*   `User` -> `TourProgram`/`DCR`/`LeaveRequest`/`ExpenseClaim`: OneToMany
*   `DCR` <> `Doctor`/`Chemist`: ManyToMany
*   `SalesData`/`Target` -> `Product`: ManyToOne (Targets/Sales can be product-specific)
*   `LeaveRequest` -> `LeaveType`: ManyToOne
*   `ExpenseClaim` -> `ExpenseType`: ManyToOne

## 4. Database Diagram (Recommendation)

It is highly recommended to generate a visual Entity Relationship Diagram (ERD) from these models to better understand the connections. Use tools like:

*   `django-extensions`' `graph_models` command + Graphviz.
*   Schema visualization features in database tools like DBeaver, pgAdmin.
*   Online diagramming tools.

This provides a clearer picture than text alone, especially as the number of models grows.
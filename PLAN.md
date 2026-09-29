# Implementation Plan: Healthcare Backend System

Building a robust, secure RESTful backend system for a healthcare application using Django, Django REST Framework (DRF), SimpleJWT, and PostgreSQL.

---

## Technical Stack & Architecture
- **Framework**: Django 5.x & Django REST Framework (DRF)
- **Database**: PostgreSQL
- **Authentication**: `djangorestframework-simplejwt` (JWT Bearer tokens)
- **Environment Handling**: `python-dotenv` / `django-environ`
- **Project Structure**:
  - `healthcare_project/` (Root configuration)
  - `accounts/` (Custom User model, Registration, JWT Login)
  - `patients/` (Patient CRUD API, user scoping)
  - `doctors/` (Doctor CRUD API)
  - `mappings/` (Patient-Doctor mapping APIs)

---

## Phase Breakdown

### Phase 1: Environment Setup & Project Initialization
- Create Python virtual environment and install required packages:
  - `django`, `djangorestframework`, `djangorestframework-simplejwt`, `psycopg2-binary`, `python-dotenv`.
- Initialize Django project (`healthcare_backend`) and app modules (`accounts`, `patients`, `doctors`, `mappings`).
- Set up `.env` for database credentials (`DB_NAME`, `DB_USER`, `DB_PASSWORD`, `DB_HOST`, `DB_PORT`, `SECRET_KEY`).
- Configure `settings.py` for DRF, SimpleJWT, and PostgreSQL database engine.

### Phase 2: User Authentication API (`/api/auth/`)
- Define custom `User` model or utilize standard User with custom registration serializer.
- Implement API Endpoints:
  1. `POST /api/auth/register/` - User registration (Name, Email, Password validation, password hashing).
  2. `POST /api/auth/login/` - User login returning JWT `access` and `refresh` tokens.
- Configure SimpleJWT settings (token lifetime, Auth header formatted as `Bearer <token>`).

### Phase 3: Patient Management API (`/api/patients/`)
- Define `Patient` model:
  - Fields: `id`, `created_by` (FK to User), `first_name`, `last_name`, `email`, `phone`, `date_of_birth`, `gender`, `address`, `created_at`, `updated_at`.
- Implement API Endpoints (`IsAuthenticated` permission):
  1. `POST /api/patients/` - Create a new patient (automatically assign `created_by = request.user`).
  2. `GET /api/patients/` - Retrieve all patients created by the authenticated user.
  3. `GET /api/patients/<id>/` - Retrieve patient details.
  4. `PUT /api/patients/<id>/` - Update patient details.
  5. `DELETE /api/patients/<id>/` - Delete patient record.

### Phase 4: Doctor Management API (`/api/doctors/`)
- Define `Doctor` model:
  - Fields: `id`, `name`, `specialization`, `email`, `phone`, `years_of_experience`, `hospital_name`, `is_active`, `created_at`, `updated_at`.
- Implement API Endpoints (`IsAuthenticated` permission):
  1. `POST /api/doctors/` - Create a new doctor record.
  2. `GET /api/doctors/` - Retrieve list of all doctors.
  3. `GET /api/doctors/<id>/` - Retrieve specific doctor details.
  4. `PUT /api/doctors/<id>/` - Update doctor details.
  5. `DELETE /api/doctors/<id>/` - Delete doctor record.

### Phase 5: Patient-Doctor Mapping API (`/api/mappings/`)
- Define `PatientDoctorMapping` model:
  - Fields: `id`, `patient` (FK to Patient), `doctor` (FK to Doctor), `assigned_at`, `notes`.
  - Add `unique_together` constraint on `('patient', 'doctor')`.
- Implement API Endpoints (`IsAuthenticated` permission):
  1. `POST /api/mappings/` - Assign a doctor to a patient.
  2. `GET /api/mappings/` - Retrieve all patient-doctor mappings.
  3. `GET /api/mappings/<patient_id>/` - Retrieve all doctors assigned to a specific patient.
  4. `DELETE /api/mappings/<id>/` - Remove a mapping record.

### Phase 6: Error Handling, Validation & Testing
- Custom error responses for 400, 401, 403, 404.
- Perform automated testing of endpoints using Django REST Framework `APITestCase`.
- Verify database migrations and PostgreSQL persistence.

---

## Verification Plan
1. Run Django system checks: `python manage.py check`.
2. Run database migrations: `python manage.py makemigrations` & `migrate`.
3. Execute unit & integration test suite: `python manage.py test`.
4. Validate JWT Token authentication & endpoint security headers.

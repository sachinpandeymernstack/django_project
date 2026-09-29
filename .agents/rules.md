# Project Rules & API Specifications (`rules.md`)

## 1. Authentication APIs
- **POST `/api/auth/register/`**
  - Payload: `{ "name": "...", "email": "...", "password": "..." }`
  - Action: Registers a new user. Password hashed via Django's password hasher.
- **POST `/api/auth/login/`**
  - Payload: `{ "email": "..." or "username": "...", "password": "..." }`
  - Action: Authenticates user, returns JWT access and refresh tokens.

## 2. Patient Management APIs (`IsAuthenticated`)
- **POST `/api/patients/`**: Add a new patient record (associated with authenticated creator user).
- **GET `/api/patients/`**: Retrieve all patients created by the authenticated user.
- **GET `/api/patients/<id>/`**: Retrieve details of a specific patient.
- **PUT `/api/patients/<id>/`**: Update details of a specific patient.
- **DELETE `/api/patients/<id>/`**: Delete a patient record.

## 3. Doctor Management APIs (`IsAuthenticated`)
- **POST `/api/doctors/`**: Add a new doctor record.
- **GET `/api/doctors/`**: Retrieve all doctors.
- **GET `/api/doctors/<id>/`**: Retrieve details of a specific doctor.
- **PUT `/api/doctors/<id>/`**: Update doctor details.
- **DELETE `/api/doctors/<id>/`**: Delete a doctor record.

## 4. Patient-Doctor Mapping APIs (`IsAuthenticated`)
- **POST `/api/mappings/`**: Assign a doctor to a patient (`patient_id`, `doctor_id`).
- **GET `/api/mappings/`**: Retrieve all patient-doctor mappings.
- **GET `/api/mappings/<patient_id>/`**: Get all doctors assigned to a specific patient.
- **DELETE `/api/mappings/<id>/`**: Remove a patient-doctor mapping.

## Verification & Execution Rules
- Always verify Python syntax and run migrations before running server tests.
- Always use environment variables for PostgreSQL connection parameters.
- Provide descriptive JSON responses for errors.

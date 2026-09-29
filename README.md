# 🏥 Healthcare Backend System

A robust, production-ready RESTful API backend for a Healthcare Management System built using **Django**, **Django REST Framework (DRF)**, **SimpleJWT**, and **PostgreSQL**.

This project provides secure user authentication, patient management, doctor directory management, and patient-doctor relationship mapping with fine-grained access control and scoping.

---

## 🌐 Live Production URL
- **Live Application**: [https://sachinwhatbytes.onrender.com/](https://sachinwhatbytes.onrender.com/)
- **Live Swagger API Docs**: [https://sachinwhatbytes.onrender.com/api/docs/](https://sachinwhatbytes.onrender.com/api/docs/)
- **Live ReDoc Schema**: [https://sachinwhatbytes.onrender.com/api/redoc/](https://sachinwhatbytes.onrender.com/api/redoc/)
- **Live Django Admin**: [https://sachinwhatbytes.onrender.com/admin/](https://sachinwhatbytes.onrender.com/admin/)

---

## 🛠️ Tech Stack & Prerequisites

### Tech Stack
- **Backend Framework**: Django 6.1 / Django REST Framework
- **Authentication**: `djangorestframework-simplejwt` (JWT Bearer tokens)
- **Database**: PostgreSQL (Neon Cloud DB)
- **API Documentation**: OpenAPI 3.0 via `drf-spectacular` (Swagger UI & ReDoc)
- **Frontend Framework**: React 19 + TypeScript (Vite)
- **State & Data Fetching**: TanStack Query (`@tanstack/react-query`)
- **UI & Animations**: TailwindCSS v4, Framer Motion, Lucide React Icons
- **Deployment**: Docker container on Render.com


---

## 📖 API Documentation & Views

Interactive documentation, MVT views, and Admin dashboard:
- **Classic Django MVT Portal**: `http://127.0.0.1:8000/` (Server-side rendered HTML via Django Templates & ORM)
- **Swagger UI**: `http://127.0.0.1:8000/api/docs/`
- **ReDoc UI**: `http://127.0.0.1:8000/api/redoc/`
- **OpenAPI JSON Schema**: `http://127.0.0.1:8000/api/schema/`
- **Django MVT Admin Dashboard**: `http://127.0.0.1:8000/admin/`


---

## 🎨 React Frontend Setup

---

## 🎨 React Frontend Setup

The project includes a full-featured, glassmorphic React dashboard located in the `frontend/` directory.

### Start Frontend Dev Server
```bash
cd frontend
npm run dev
```
Access the application in your browser at `http://localhost:3000`.

### Features
- **Auth Context**: Persists JWT access/refresh tokens and user session in `localStorage`.
- **TanStack Query Integration**: Automatic data fetching, caching, and mutation invalidations for Patients, Doctors, and Mappings.
- **Glassmorphic UI & Framer Motion Animations**: Smooth page transitions, animated modal dialogs, and interactive metric cards.


### Prerequisites
Make sure you have the following installed on your system:
- **Python**: 3.10 or higher
- **PostgreSQL**: 14 or higher (Running service)
- **Git**: For version control

---

## 🚀 Quick Start Guide (Step-by-Step)

Follow these steps to set up and run the project from scratch on your local machine.

### 1. Clone the Repository
```bash
git clone <repository-url>
cd django_project
```

### 2. Set Up Python Virtual Environment
```bash
# Create virtual environment
python3 -m venv .venv

# Activate virtual environment
# On Linux/macOS:
source .venv/bin/activate
# On Windows (PowerShell):
# .venv\Scripts\Activate.ps1
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

### 4. Configure Environment Variables
Copy the template `.env.example` file to `.env`:
```bash
cp .env.example .env
```

Edit `.env` to match your local PostgreSQL configuration:
```env
SECRET_KEY=your-django-secret-key
DEBUG=True
DB_NAME=healthcare_db
DB_USER=postgres
DB_PASSWORD=your_postgres_password
DB_HOST=localhost
DB_PORT=5432
```
> **Note for Unix socket users**: If connecting locally via PostgreSQL socket (without host/password prompt), leave `DB_HOST=` and `DB_PASSWORD=` blank.

### 5. Create PostgreSQL Database
Create the database in PostgreSQL shell or command line:
```bash
# Using psql command line:
psql -U postgres -c "CREATE DATABASE healthcare_db;"
```

### 6. Run Database Migrations
Apply Django migrations to set up database schemas:
```bash
python manage.py makemigrations
python manage.py migrate
```

### 7. Run the Development Server
Start the local server at `http://127.0.0.1:8000/`:
```bash
python manage.py runserver
```

---

## 🧪 Running Automated Tests

Run the complete automated unit and API integration test suite (20 tests):
```bash
python manage.py test --keepdb
```
> **Tip for Neon Cloud PostgreSQL**: Use `--keepdb` when running tests against Neon's connection pooler to prevent pooler session locks during test database teardown.


---

## 📚 API Endpoints Documentation

All protected endpoints require the following header:
```text
Authorization: Bearer <your_jwt_access_token>
```

### 🔐 1. Authentication APIs (`/api/auth/`)

#### 1.1 Register User
- **Method**: `POST`
- **Endpoint**: `/api/auth/register/`
- **Access**: Public
- **Request Body**:
```json
{
  "name": "Dr. Alice Smith",
  "email": "alice@example.com",
  "password": "Password123!"
}
```
- **Response (`201 Created`)**:
```json
{
  "message": "User registered successfully.",
  "user": {
    "id": 1,
    "name": "Dr. Alice Smith",
    "email": "alice@example.com"
  }
}
```

#### 1.2 User Login
- **Method**: `POST`
- **Endpoint**: `/api/auth/login/`
- **Access**: Public
- **Request Body**:
```json
{
  "email": "alice@example.com",
  "password": "Password123!"
}
```
- **Response (`200 OK`)**:
```json
{
  "message": "Login successful.",
  "access": "eyJhbGciOiJIUzI1NiIsInR5cCI6...",
  "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6...",
  "user": {
    "id": 1,
    "name": "Dr. Alice Smith",
    "email": "alice@example.com"
  }
}
```

---

### 🩺 2. Patient Management APIs (`/api/patients/`)

#### 2.1 Add Patient
- **Method**: `POST`
- **Endpoint**: `/api/patients/`
- **Access**: Protected (`Bearer <token>`)
- **Request Body**:
```json
{
  "name": "John Doe",
  "email": "johndoe@example.com",
  "phone": "1234567890",
  "date_of_birth": "1990-05-15",
  "gender": "Male",
  "address": "123 Health Ave, Cityville",
  "medical_history": "No known allergies."
}
```
- **Response (`201 Created`)**:
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "johndoe@example.com",
  "phone": "1234567890",
  "date_of_birth": "1990-05-15",
  "gender": "Male",
  "address": "123 Health Ave, Cityville",
  "medical_history": "No known allergies.",
  "created_by": 1,
  "created_by_email": "alice@example.com",
  "created_at": "2026-09-29T20:00:00Z",
  "updated_at": "2026-09-29T20:00:00Z"
}
```

#### 2.2 Get All Patients Created by User
- **Method**: `GET`
- **Endpoint**: `/api/patients/`
- **Access**: Protected (`Bearer <token>`)
- **Response (`200 OK`)**: Array of patient records owned by authenticated user.

#### 2.3 Get Specific Patient Details
- **Method**: `GET`
- **Endpoint**: `/api/patients/<id>/`
- **Access**: Protected (`Bearer <token>`)

#### 2.4 Update Patient Details
- **Method**: `PUT`
- **Endpoint**: `/api/patients/<id>/`
- **Access**: Protected (`Bearer <token>`)
- **Request Body**:
```json
{
  "name": "John Doe Updated",
  "phone": "9998887777"
}
```

#### 2.5 Delete Patient
- **Method**: `DELETE`
- **Endpoint**: `/api/patients/<id>/`
- **Access**: Protected (`Bearer <token>`)
- **Response (`200 OK`)**:
```json
{
  "message": "Patient record deleted successfully."
}
```

---

### 👨‍⚕️ 3. Doctor Management APIs (`/api/doctors/`)

#### 3.1 Add Doctor
- **Method**: `POST`
- **Endpoint**: `/api/doctors/`
- **Access**: Protected (`Bearer <token>`)
- **Request Body**:
```json
{
  "name": "Gregory House",
  "specialization": "Diagnostics",
  "email": "drhouse@example.com",
  "phone": "5551234567",
  "years_of_experience": 15,
  "hospital_name": "Princeton-Plainsboro"
}
```

#### 3.2 List All Doctors
- **Method**: `GET`
- **Endpoint**: `/api/doctors/`
- **Access**: Protected (`Bearer <token>`)

#### 3.3 Get Specific Doctor Details
- **Method**: `GET`
- **Endpoint**: `/api/doctors/<id>/`
- **Access**: Protected (`Bearer <token>`)

#### 3.4 Update Doctor Details
- **Method**: `PUT`
- **Endpoint**: `/api/doctors/<id>/`
- **Access**: Protected (`Bearer <token>`)

#### 3.5 Delete Doctor Record
- **Method**: `DELETE`
- **Endpoint**: `/api/doctors/<id>/`
- **Access**: Protected (`Bearer <token>`)

---

### 🔗 4. Patient-Doctor Mapping APIs (`/api/mappings/`)

#### 4.1 Assign Doctor to Patient
- **Method**: `POST`
- **Endpoint**: `/api/mappings/`
- **Access**: Protected (`Bearer <token>`)
- **Request Body**:
```json
{
  "patient_id": 1,
  "doctor_id": 1,
  "notes": "Follow-up diagnostic consultation"
}
```

#### 4.2 List All Mappings
- **Method**: `GET`
- **Endpoint**: `/api/mappings/`
- **Access**: Protected (`Bearer <token>`)

#### 4.3 Get Doctors Assigned to Patient
- **Method**: `GET`
- **Endpoint**: `/api/mappings/<patient_id>/`
- **Access**: Protected (`Bearer <token>`)

#### 4.4 Delete Mapping Record
- **Method**: `DELETE`
- **Endpoint**: `/api/mappings/<mapping_id>/`
- **Access**: Protected (`Bearer <token>`)

---

## 📬 Postman Collection

Import `Healthcare_Backend.postman_collection.json` into Postman to test all endpoints.
- The **Login** request automatically captures the JWT `access` token and sets the `{{accessToken}}` environment variable for all subsequent requests.

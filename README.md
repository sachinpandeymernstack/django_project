# 🏥 CarePulse - Healthcare Backend & Management System

[![Django](https://img.shields.io/badge/Django-6.1-092E20?style=for-the-badge&logo=django&logoColor=white)](https://djangoproject.com)
[![DRF](https://img.shields.io/badge/Django_REST_Framework-3.18.1-red?style=for-the-badge&logo=django)](https://django-rest-framework.org)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon_Cloud-336791?style=for-the-badge&logo=postgresql&logoColor=white)](https://neon.tech)
[![React](https://img.shields.io/badge/React-19_TypeScript-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![Docker](https://img.shields.io/badge/Docker-Multi--Stage_Build-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://docker.com)
[![Render](https://img.shields.io/badge/Deployed_on-Render-46E3B7?style=for-the-badge&logo=render&logoColor=black)](https://render.com)

A robust, enterprise-grade, production-ready **Healthcare Management System** built with **Django 6.1**, **Django REST Framework (DRF)**, **SimpleJWT**, **PostgreSQL (Neon Cloud)**, **Docker**, and a full-featured **React 19 + TypeScript SPA**.

Designed with clean modular domain architecture, fine-grained access control, automated test coverage, OpenAPI 3.0 documentation, and responsive glassmorphic UI interfaces.

---

## 🌐 Live Production Deployments

| Resource | Live Production Link | Description |
| :--- | :--- | :--- |
| **🚀 React 19 SPA** | [https://sachinwhatbytes.onrender.com/app/](https://sachinwhatbytes.onrender.com/app/) | Interactive Glassmorphic Web App with Skeleton Loading |
| **📊 Django MVT Dashboard** | [https://sachinwhatbytes.onrender.com/](https://sachinwhatbytes.onrender.com/) | Server-Side Rendered (MVT) Live Database Portal |
| **📚 Interactive Swagger UI** | [https://sachinwhatbytes.onrender.com/api/docs/](https://sachinwhatbytes.onrender.com/api/docs/) | OpenAPI 3.0 Interactive API Explorer |
| **📘 ReDoc Schema** | [https://sachinwhatbytes.onrender.com/api/redoc/](https://sachinwhatbytes.onrender.com/api/redoc/) | Detailed API Schema Specification |
| **🛡️ Django Admin Panel** | [https://sachinwhatbytes.onrender.com/admin/](https://sachinwhatbytes.onrender.com/admin/) | Custom Styled Django Administration Console |

---

## 💡 Quick Demo Credentials for Invigilators & Evaluators

| Console | URL | Username / Email | Password |
| :--- | :--- | :--- | :--- |
| **React Web App** | `/app/` | `admin@healthcare.org` | `AdminPassword123!` |
| **Django Admin** | `/admin/` | `admin` | `AdminPassword123!` |

> ⚡ **Tip**: Both login screens feature 1-click **Auto-fill** credentials for instant testing!

---

## ✨ Key System Features & Highlights

- **🔒 Secure JWT Authentication**: Stateless bearer authentication powered by `djangorestframework-simplejwt` with custom user email identity scoping.
- **👥 Patient Scoping & Ownership**: Users can register, log in, and securely manage patient records scoped exclusively to their authenticated session.
- **🩺 Medical Specialist Directory**: Searchable, filterable doctor directory with experience tracking, specialization tags, and hospital affiliations.
- **🔗 Patient-Doctor Relationship Mappings**: Multi-doctor assignment capability per patient with unique constraint guarantees and detailed clinical notes.
- **⚡ Dual Portal Interface**:
  - **Single Page App (React 19 + Vite + TypeScript)**: Features TanStack Query caching, glassmorphic UI, smooth Framer Motion animations, and custom Skeleton loading placeholders.
  - **Server-Side Rendered (Django MVT)**: Server-side rendered HTML dashboard via Django Templates & ORM queries.
- **⚠️ Standardized Error Contract**: Custom global DRF exception handler (`healthcare_backend/exceptions.py`) delivering predictable JSON error payloads (`status`, `code`, `message`, `details`).
- **🐳 Production Docker Containerization**: Multi-stage Docker build utilizing Node.js for Vite compilation and Gunicorn + WhiteNoise for high-performance static asset serving.

---

## 🛠️ Complete Technology Stack

### Backend Stack
- **Language**: Python `3.12`
- **Framework**: Django `6.1` & Django REST Framework `3.18.1`
- **Authentication**: `djangorestframework-simplejwt` (`5.5.1`)
- **Database**: Serverless PostgreSQL (Neon Cloud DB) via `psycopg2-binary` (`2.9.13`)
- **API Specification**: OpenAPI 3.0 via `drf-spectacular` (`0.30.0`)
- **WSGI & Static Serving**: `gunicorn` (`23.0.0`) & `whitenoise` (`6.9.0`)

### Frontend Stack
- **Framework**: React `19` + TypeScript
- **Build Tool**: Vite `8.3`
- **State & Data Fetching**: TanStack Query (`@tanstack/react-query` v5)
- **HTTP Client**: Axios with automatic JWT interceptors & 401 handling
- **Styling & UI**: TailwindCSS v4, Glassmorphic design, Lucide React Icons (`lucide-react`)
- **Animations & Feedback**: Framer Motion & React Hot Toast (`react-hot-toast`)

---

## 🗄️ Database Architecture & Entity Relationships

```mermaid
erDiagram
    USER ||--o{ PATIENT : "creates & owns"
    PATIENT ||--o{ PATIENT_DOCTOR_MAPPING : "has assigned"
    DOCTOR ||--o{ PATIENT_DOCTOR_MAPPING : "is assigned to"

    USER {
        int id PK
        string email UK
        string name
        boolean is_active
        datetime date_joined
    }

    PATIENT {
        int id PK
        string name
        string email
        string phone
        date date_of_birth
        string gender
        text address
        text medical_history
        int created_by_id FK
        datetime created_at
        datetime updated_at
    }

    DOCTOR {
        int id PK
        string name
        string specialization
        string email UK
        string phone
        int years_of_experience
        string hospital_name
        boolean is_active
        datetime created_at
        datetime updated_at
    }

    PATIENT_DOCTOR_MAPPING {
        int id PK
        int patient_id FK
        int doctor_id FK
        text notes
        datetime assigned_at
    }
```

---

## 🚀 Local Development Setup Guide

Follow these steps to run the complete stack locally on your machine.

### 1. Prerequisites
- **Python**: `3.10` or higher
- **Node.js**: `18.x` or `20.x`
- **PostgreSQL**: `14+` (or Neon PostgreSQL connection string)
- **Git**

### 2. Clone Repository
```bash
git clone https://github.com/sachinpandeymernstack/django_project.git
cd django_project
```

### 3. Virtual Environment & Dependencies
```bash
# Create virtual environment
python3 -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate

# Install Python requirements
pip install -r requirements.txt
```

### 4. Environment Variables Configuration
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Fill in your database parameters inside `.env`:
```env
SECRET_KEY=your-custom-django-secret-key
DEBUG=True
DATABASE_URL=postgresql://neondb_owner:YOUR_PASSWORD@ep-sample.neon.tech/neondb?sslmode=require
```

### 5. Apply Database Migrations
```bash
python manage.py migrate
```

### 6. Start Django Backend Server
```bash
python manage.py runserver 8000
```
Backend will run at: `http://127.0.0.1:8000/`

### 7. Start React Frontend (Dev Server)
In a new terminal:
```bash
cd frontend
npm install
npm run dev
```
Frontend will run at: `http://localhost:3000/`

---

## 🧪 Automated Testing Suite

The repository includes a comprehensive 20-test automated test suite covering models, authentication permissions, REST API endpoints, validation logic, and foreign key mappings.

Run all tests:
```bash
python manage.py test --keepdb
```

### Test Coverage Highlights:
- **Authentication**: User registration, login token pair creation, duplicate email rejection.
- **Patient Management**: Authorized patient creation, strict user-level data isolation, updates, and deletion.
- **Doctor Directory**: Doctor creation, listing, updating, and experience validation.
- **Mappings**: Assigning doctors to patients, unique mapping constraints, and retrieval by patient ID.

---

## 📚 REST API Endpoint Documentation

All protected endpoints require the HTTP header:
`Authorization: Bearer <your_access_token>`

### 🔐 1. Auth Endpoints (`/api/auth/`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register/` | Public | Register a new user with name, email, and password |
| `POST` | `/api/auth/login/` | Public | Authenticate user & return JWT `access` and `refresh` tokens |

### 🩺 2. Patient Endpoints (`/api/patients/`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/patients/` | Protected | Add a new patient record (auto-assigned to current user) |
| `GET` | `/api/patients/` | Protected | Retrieve all patients owned by authenticated user |
| `GET` | `/api/patients/<id>/` | Protected | Get details of a specific patient record |
| `PUT` | `/api/patients/<id>/` | Protected | Update patient details |
| `DELETE` | `/api/patients/<id>/` | Protected | Delete a patient record |

### 👨‍⚕️ 3. Doctor Endpoints (`/api/doctors/`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/doctors/` | Protected | Add a new medical doctor record |
| `GET` | `/api/doctors/` | Protected | Retrieve all medical specialists |
| `GET` | `/api/doctors/<id>/` | Protected | Get details of a specific doctor |
| `PUT` | `/api/doctors/<id>/` | Protected | Update doctor specialization or details |
| `DELETE` | `/api/doctors/<id>/` | Protected | Delete a doctor record |

### 🔗 4. Mapping Endpoints (`/api/mappings/`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/mappings/` | Protected | Assign a doctor to a patient with optional clinical notes |
| `GET` | `/api/mappings/` | Protected | Retrieve all patient-doctor care assignments |
| `GET` | `/api/mappings/<patient_id>/` | Protected | Get all doctors assigned to a specific patient |
| `DELETE` | `/api/mappings/<mapping_id>/` | Protected | Delete a patient-doctor care assignment |

---

## 🐳 Docker & Render Deployment Setup

The application is containerized using a multi-stage Docker build:

### Build & Run locally with Docker
```bash
# Build Docker image
docker build -t carepulse-app .

# Run Docker container
docker run -p 8000:8000 -e DATABASE_URL="your-neon-postgres-url" carepulse-app
```

---

## 📄 License & Attribution

Developed for **CarePulse Healthcare Systems Assignment**. Built with ❤️ using Django, React, and PostgreSQL.

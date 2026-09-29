# Project Memory (`MEMORY.md`)

## Project Information
- **Title**: Healthcare Backend System
- **Framework**: Django 6 + Django REST Framework + Neon PostgreSQL
- **Auth**: SimpleJWT (JWT Token Authentication)

## Current Status
- [x] Initialized Project Agent Documentation (`.agents/AGENTS.md`, `.agents/rules.md`, `MEMORY.md`)
- [x] Django & DRF Project Environment Setup (Virtualenv, dependencies, settings)
- [x] Neon PostgreSQL Cloud Database Configuration (`DATABASE_URL`, S3 credentials, Neon Auth)
- [x] Neon CLI Integration & Function Config (`neon.ts`, `hello.ts`, `neon skills`)
- [x] Authentication Module (User Registration & JWT Login: `/api/auth/register/`, `/api/auth/login/`)
- [x] Patient Management CRUD API Implementation (`/api/patients/`)
- [x] Doctor Management CRUD API Implementation (`/api/doctors/`)
- [x] Patient-Doctor Mapping API Implementation (`/api/mappings/`)
- [x] Automated Test Suite & API Endpoint Verification

## Key Architectural Decisions
- Custom User Model: `authentication.User` extending `AbstractUser`.
- Patient Model: Scoped via `created_by` (User FK).
- Doctor Model: Fields for specialization, contact info, experience, hospital.
- PatientDoctorMapping Model: Unique relationship between Patient and Doctor.
- Database: Neon Cloud PostgreSQL with `urlparse` dynamic parsing in `settings.py`.
- Neon Edge Functions: Configured in `neon.ts` with `hello.ts` function handler.

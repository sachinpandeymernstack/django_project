# Healthcare Backend Agent Guidelines (`AGENTS.md`)

## Overview
This repository contains the backend for a **Healthcare Management System** built with **Django**, **Django REST Framework (DRF)**, **PostgreSQL**, and **JWT Authentication** (`djangorestframework-simplejwt`).

## Stack & Technologies
- **Framework**: Django 5.x / Django REST Framework
- **Database**: PostgreSQL
- **Authentication**: SimpleJWT (`djangorestframework-simplejwt`)
- **Environment Management**: `python-dotenv` / `django-environ`

## Agent Guidelines & Standards

### 1. Architectural Patterns
- Maintain clean modular architecture with apps separated by domain concern (e.g. `authentication`, `patients`, `doctors`, `mappings` or a unified `healthcare` app structure).
- Use DRF `ModelSerializer` for request/response serialization and validation.
- Standardize HTTP response status codes:
  - `200 OK`: Successful fetch/update
  - `201 Created`: Successful resource creation
  - `400 Bad Request`: Validation failure
  - `401 Unauthorized`: Missing or invalid JWT
  - `403 Forbidden`: Permission denied
  - `404 Not Found`: Resource does not exist

### 2. Security Rules
- **Environment Variables**: Sensitive data (`SECRET_KEY`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `DB_HOST`, `DB_PORT`) must NEVER be hardcoded.
- **Authentication**: JWT token header requirement: `Authorization: Bearer <token>`.
- **Permissions**:
  - Auth endpoints (`/api/auth/*`): Public (`AllowAny`).
  - Patient management (`/api/patients/*`): Protected (`IsAuthenticated`).
  - Doctor management (`/api/doctors/*`): Protected (`IsAuthenticated`).
  - Mapping management (`/api/mappings/*`): Protected (`IsAuthenticated`).

### 3. Database & Models
- Use PostgreSQL via Django ORM.
- Implement explicit field constraints (e.g., unique email, foreign keys with appropriate `on_delete` behaviors).
- Include `created_at` and `updated_at` timestamps on primary entity models.

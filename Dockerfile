# Multi-stage Dockerfile for Django Healthcare Backend + React Frontend

# Stage 1: Build React Frontend
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

# Stage 2: Python Django Backend
FROM python:3.12-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PORT=8000

WORKDIR /app

# Install system dependencies required for PostgreSQL and Python packages
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install Python packages
COPY requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt

# Copy complete repository code
COPY . /app/

# Copy built frontend output into app/frontend/dist
COPY --from=frontend-builder /app/frontend/dist /app/frontend/dist

# Collect static files for Django / WhiteNoise
RUN python manage.py collectstatic --noinput

# Expose container port
EXPOSE 8000

# Apply migrations and launch Gunicorn on dynamic Render PORT
CMD ["sh", "-c", "python manage.py migrate && gunicorn healthcare_backend.wsgi:application --bind 0.0.0.0:${PORT:-8000}"]

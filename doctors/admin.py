from django.contrib import admin
from .models import Doctor

@admin.register(Doctor)
class DoctorAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'specialization', 'email', 'phone', 'years_of_experience', 'is_active', 'created_at')
    list_filter = ('specialization', 'is_active', 'created_at')
    search_fields = ('name', 'specialization', 'email', 'hospital_name')
    ordering = ('-created_at',)

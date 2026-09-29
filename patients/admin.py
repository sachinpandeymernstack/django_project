from django.contrib import admin
from .models import Patient

@admin.register(Patient)
class PatientAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'email', 'phone', 'gender', 'created_by', 'created_at')
    list_filter = ('gender', 'created_at')
    search_fields = ('name', 'email', 'phone', 'medical_history')
    raw_id_fields = ('created_by',)
    date_hierarchy = 'created_at'
    ordering = ('-created_at',)

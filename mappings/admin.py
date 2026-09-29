from django.contrib import admin
from .models import PatientDoctorMapping

@admin.register(PatientDoctorMapping)
class PatientDoctorMappingAdmin(admin.ModelAdmin):
    list_display = ('id', 'patient', 'doctor', 'assigned_at')
    list_filter = ('assigned_at',)
    search_fields = ('patient__name', 'doctor__name', 'notes')
    raw_id_fields = ('patient', 'doctor')
    date_hierarchy = 'assigned_at'
    ordering = ('-assigned_at',)

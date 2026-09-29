from django.db import models
from patients.models import Patient
from doctors.models import Doctor

class MappingQuerySet(models.QuerySet):
    def with_details(self):
        """Pre-fetch related patient and doctor models in a single JOIN to prevent N+1 queries."""
        return self.select_related('patient', 'doctor')

    def for_patient(self, patient_id):
        return self.with_details().filter(patient_id=patient_id)

class PatientDoctorMapping(models.Model):
    patient = models.ForeignKey(
        Patient,
        on_delete=models.CASCADE,
        related_name='doctor_mappings',
        db_index=True
    )
    doctor = models.ForeignKey(
        Doctor,
        on_delete=models.CASCADE,
        related_name='patient_mappings',
        db_index=True
    )
    notes = models.TextField(blank=True, null=True)
    assigned_at = models.DateTimeField(auto_now_add=True, db_index=True)

    objects = MappingQuerySet.as_manager()

    class Meta:
        unique_together = ('patient', 'doctor')
        ordering = ['-assigned_at']
        indexes = [
            models.Index(fields=['patient', 'doctor']),
            models.Index(fields=['-assigned_at']),
        ]

    def __str__(self):
        return f"Patient: {self.patient.name} -> Doctor: Dr. {self.doctor.name}"

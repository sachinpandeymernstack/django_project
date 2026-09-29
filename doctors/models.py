from django.db import models

class DoctorQuerySet(models.QuerySet):
    def active(self):
        return self.filter(is_active=True)

    def by_specialization(self, specialization):
        return self.filter(specialization__iexact=specialization)

class Doctor(models.Model):
    name = models.CharField(max_length=255, db_index=True)
    specialization = models.CharField(max_length=255, db_index=True)
    email = models.EmailField(unique=True, db_index=True)
    phone = models.CharField(max_length=20, blank=True, null=True)
    years_of_experience = models.PositiveIntegerField(default=0)
    hospital_name = models.CharField(max_length=255, blank=True, null=True, db_index=True)
    is_active = models.BooleanField(default=True, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = DoctorQuerySet.as_manager()

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['specialization', 'is_active']),
            models.Index(fields=['name', 'specialization']),
        ]

    def __str__(self):
        return f"Dr. {self.name} - {self.specialization}"

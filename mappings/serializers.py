from rest_framework import serializers
from .models import PatientDoctorMapping
from patients.serializers import PatientSerializer
from doctors.serializers import DoctorSerializer
from patients.models import Patient
from doctors.models import Doctor

class PatientDoctorMappingSerializer(serializers.ModelSerializer):
    patient_id = serializers.PrimaryKeyRelatedField(
        queryset=Patient.objects.all(), source='patient', write_only=True
    )
    doctor_id = serializers.PrimaryKeyRelatedField(
        queryset=Doctor.objects.all(), source='doctor', write_only=True
    )
    patient = PatientSerializer(read_only=True)
    doctor = DoctorSerializer(read_only=True)

    class Meta:
        model = PatientDoctorMapping
        fields = (
            'id',
            'patient_id',
            'doctor_id',
            'patient',
            'doctor',
            'notes',
            'assigned_at',
        )
        read_only_fields = ('id', 'assigned_at')

    def validate(self, attrs):
        patient = attrs.get('patient')
        doctor = attrs.get('doctor')
        if PatientDoctorMapping.objects.filter(patient=patient, doctor=doctor).exists():
            raise serializers.ValidationError("This doctor is already assigned to the specified patient.")
        return attrs

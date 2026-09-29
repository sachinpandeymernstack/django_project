from rest_framework import status, permissions, generics
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from .models import PatientDoctorMapping
from .serializers import PatientDoctorMappingSerializer
from patients.models import Patient

class MappingListCreateView(generics.ListCreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = PatientDoctorMappingSerializer

    def get_queryset(self):
        # Uses with_details() to apply select_related('patient', 'doctor') and prevent N+1 queries
        return PatientDoctorMapping.objects.with_details()


class PatientDoctorsOrMappingDetailView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, pk):
        """
        GET /api/mappings/<patient_id>/ -> Retrieve all doctors assigned to a specific patient.
        If patient not found, attempts to find and return mapping by mapping ID.
        """
        patient = Patient.objects.filter(pk=pk).first()
        if patient:
            # Uses for_patient() with pre-fetched related patient and doctor models
            mappings = PatientDoctorMapping.objects.for_patient(patient.id)
            serializer = PatientDoctorMappingSerializer(mappings, many=True)
            return Response({
                'patient_id': patient.id,
                'patient_name': patient.name,
                'assigned_doctors_count': mappings.count(),
                'mappings': serializer.data
            }, status=status.HTTP_200_OK)

        mapping = get_object_or_404(PatientDoctorMapping.objects.with_details(), pk=pk)
        serializer = PatientDoctorMappingSerializer(mapping)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def delete(self, request, pk):
        """
        DELETE /api/mappings/<id>/ -> Remove a patient-doctor mapping record.
        """
        mapping = get_object_or_404(PatientDoctorMapping, pk=pk)
        mapping.delete()
        return Response({'message': 'Patient-Doctor mapping removed successfully.'}, status=status.HTTP_200_OK)

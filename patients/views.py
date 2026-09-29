from rest_framework import status, permissions, generics
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Patient
from .serializers import PatientSerializer

class PatientListCreateView(generics.ListCreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = PatientSerializer

    def get_queryset(self):
        # Retrieve all patients created by the authenticated user
        return Patient.objects.filter(created_by=self.request.user).order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)


class PatientDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = PatientSerializer

    def get_queryset(self):
        return Patient.objects.filter(created_by=self.request.user)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response({'message': 'Patient record deleted successfully.'}, status=status.HTTP_200_OK)

from rest_framework import status, permissions, generics
from rest_framework.response import Response
from .models import Patient
from .serializers import PatientSerializer

class PatientListCreateView(generics.ListCreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = PatientSerializer

    def get_queryset(self):
        if not self.request.user or not self.request.user.is_authenticated:
            return Patient.objects.none()
        return Patient.objects.for_user(self.request.user)

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)


class PatientDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = PatientSerializer

    def get_queryset(self):
        if not self.request.user or not self.request.user.is_authenticated:
            return Patient.objects.none()
        return Patient.objects.for_user(self.request.user)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response({'message': 'Patient record deleted successfully.'}, status=status.HTTP_200_OK)

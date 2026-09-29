from rest_framework import status, permissions, generics
from rest_framework.response import Response
from .models import Doctor
from .serializers import DoctorSerializer

class DoctorListCreateView(generics.ListCreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    queryset = Doctor.objects.all().order_by('-created_at')
    serializer_class = DoctorSerializer


class DoctorDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [permissions.IsAuthenticated]
    queryset = Doctor.objects.all()
    serializer_class = DoctorSerializer

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response({'message': 'Doctor record deleted successfully.'}, status=status.HTTP_200_OK)

from django.urls import path
from .views import MappingListCreateView, PatientDoctorsOrMappingDetailView

urlpatterns = [
    path('', MappingListCreateView.as_view(), name='mapping_list_create'),
    path('<int:pk>/', PatientDoctorsOrMappingDetailView.as_view(), name='mapping_detail_or_patient'),
]

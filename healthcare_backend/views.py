from django.shortcuts import render
from patients.models import Patient
from doctors.models import Doctor
from mappings.models import PatientDoctorMapping

def home_mvt_view(request):
    """
    Healthcare Portal Homepage View:
    Passes all current patients, doctors, and mappings to render the server-side HTML dashboard.
    """
    context = {
        'total_patients': Patient.objects.count(),
        'total_doctors': Doctor.objects.count(),
        'total_mappings': PatientDoctorMapping.objects.count(),
        'doctors': Doctor.objects.all().order_by('-created_at')[:10],
        'patients': Patient.objects.select_related('created_by').all().order_by('-created_at')[:10],
        'mappings': PatientDoctorMapping.objects.with_details().order_by('-assigned_at')[:10],
    }
    return render(request, 'home.html', context)


def react_app_view(request):
    """
    Serves the interactive React 19 Single Page Application (SPA).
    """
    return render(request, 'index.html')


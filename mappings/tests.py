from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model
from patients.models import Patient
from doctors.models import Doctor
from mappings.models import PatientDoctorMapping

User = get_user_model()

class MappingAPITestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username='mapadmin@example.com', email='mapadmin@example.com', password='Password123!')
        self.list_create_url = reverse('mapping_list_create')

        self.patient = Patient.objects.create(
            created_by=self.user,
            name='Alice Smith',
            email='alice@example.com'
        )

        self.doctor = Doctor.objects.create(
            name='Bob Jones',
            specialization='Cardiology',
            email='drbob@example.com'
        )

    def test_create_mapping(self):
        self.client.force_authenticate(user=self.user)
        data = {
            'patient_id': self.patient.id,
            'doctor_id': self.doctor.id,
            'notes': 'Initial consultation scheduled'
        }
        response = self.client.post(self.list_create_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(PatientDoctorMapping.objects.filter(patient=self.patient, doctor=self.doctor).exists())

    def test_duplicate_mapping_validation(self):
        self.client.force_authenticate(user=self.user)
        PatientDoctorMapping.objects.create(patient=self.patient, doctor=self.doctor)

        data = {
            'patient_id': self.patient.id,
            'doctor_id': self.doctor.id
        }
        response = self.client.post(self.list_create_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_get_doctors_assigned_to_patient(self):
        self.client.force_authenticate(user=self.user)
        mapping = PatientDoctorMapping.objects.create(patient=self.patient, doctor=self.doctor)

        patient_url = reverse('mapping_detail_or_patient', kwargs={'pk': self.patient.pk})
        response = self.client.get(patient_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['assigned_doctors_count'], 1)
        self.assertEqual(response.data['mappings'][0]['doctor']['name'], 'Bob Jones')

    def test_delete_mapping(self):
        self.client.force_authenticate(user=self.user)
        mapping = PatientDoctorMapping.objects.create(patient=self.patient, doctor=self.doctor)

        delete_url = reverse('mapping_detail_or_patient', kwargs={'pk': mapping.pk})
        response = self.client.delete(delete_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertFalse(PatientDoctorMapping.objects.filter(pk=mapping.pk).exists())

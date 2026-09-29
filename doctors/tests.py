from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model
from doctors.models import Doctor

User = get_user_model()

class DoctorAPITestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username='docadmin@example.com', email='docadmin@example.com', password='Password123!')
        self.list_create_url = reverse('doctor_list_create')

        self.doctor = Doctor.objects.create(
            name='House',
            specialization='Diagnostics',
            email='drhouse@example.com',
            years_of_experience=15,
            hospital_name='Princeton-Plainsboro'
        )

    def test_create_doctor_unauthenticated(self):
        response = self.client.post(self.list_create_url, {'name': 'Dr. Strange'}, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(response.data['status'], 'error')

    def test_create_doctor_authenticated(self):
        self.client.force_authenticate(user=self.user)
        data = {
            'name': 'Stephen Strange',
            'specialization': 'Neurosurgery',
            'email': 'drstrange@example.com',
            'years_of_experience': 12,
            'hospital_name': 'Metro General'
        }
        response = self.client.post(self.list_create_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['name'], 'Stephen Strange')

    def test_list_doctors(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.get(self.list_create_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        results = response.data.get('results', response.data) if isinstance(response.data, dict) else response.data
        self.assertEqual(len(results), 1)

    def test_get_doctor_detail(self):
        self.client.force_authenticate(user=self.user)
        detail_url = reverse('doctor_detail', kwargs={'pk': self.doctor.pk})
        response = self.client.get(detail_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], 'House')

    def test_update_doctor(self):
        self.client.force_authenticate(user=self.user)
        detail_url = reverse('doctor_detail', kwargs={'pk': self.doctor.pk})
        response = self.client.put(detail_url, {
            'name': 'Gregory House',
            'specialization': 'Diagnostics',
            'email': 'drhouse@example.com',
            'years_of_experience': 20,
            'hospital_name': 'Princeton-Plainsboro'
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.doctor.refresh_from_db()
        self.assertEqual(self.doctor.years_of_experience, 20)

    def test_delete_doctor(self):
        self.client.force_authenticate(user=self.user)
        detail_url = reverse('doctor_detail', kwargs={'pk': self.doctor.pk})
        response = self.client.delete(detail_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertFalse(Doctor.objects.filter(pk=self.doctor.pk).exists())

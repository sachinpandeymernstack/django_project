from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model
from patients.models import Patient

User = get_user_model()

class PatientAPITestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user1 = User.objects.create_user(username='user1@example.com', email='user1@example.com', password='Password123!', name='User One')
        self.user2 = User.objects.create_user(username='user2@example.com', email='user2@example.com', password='Password123!', name='User Two')

        self.list_create_url = reverse('patient_list_create')

        # Create patient for user1
        self.patient1 = Patient.objects.create(
            created_by=self.user1,
            name='John Doe',
            email='johndoe@example.com',
            phone='1234567890',
            gender='Male'
        )

    def test_create_patient_unauthenticated(self):
        response = self.client.post(self.list_create_url, {'name': 'Jane Doe'}, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(response.data['status'], 'error')

    def test_create_patient_authenticated(self):
        self.client.force_authenticate(user=self.user1)
        data = {
            'name': 'Jane Smith',
            'email': 'janesmith@example.com',
            'phone': '9876543210',
            'gender': 'Female'
        }
        response = self.client.post(self.list_create_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['name'], 'Jane Smith')
        self.assertEqual(response.data['created_by'], self.user1.id)

    def test_list_patients_user_scoping(self):
        # User2 creates a patient
        Patient.objects.create(created_by=self.user2, name='User2 Patient', email='u2p@example.com')

        # User1 requests list
        self.client.force_authenticate(user=self.user1)
        response = self.client.get(self.list_create_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Note: if paginated, data is in 'results' key or list directly
        results = response.data.get('results', response.data) if isinstance(response.data, dict) else response.data
        self.assertEqual(len(results), 1)
        self.assertEqual(results[0]['name'], 'John Doe')

    def test_get_patient_detail(self):
        self.client.force_authenticate(user=self.user1)
        detail_url = reverse('patient_detail', kwargs={'pk': self.patient1.pk})
        response = self.client.get(detail_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], 'John Doe')

    def test_update_patient(self):
        self.client.force_authenticate(user=self.user1)
        detail_url = reverse('patient_detail', kwargs={'pk': self.patient1.pk})
        response = self.client.put(detail_url, {'name': 'John Updated', 'phone': '1112223333'}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.patient1.refresh_from_db()
        self.assertEqual(self.patient1.name, 'John Updated')

    def test_delete_patient(self):
        self.client.force_authenticate(user=self.user1)
        detail_url = reverse('patient_detail', kwargs={'pk': self.patient1.pk})
        response = self.client.delete(detail_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertFalse(Patient.objects.filter(pk=self.patient1.pk).exists())

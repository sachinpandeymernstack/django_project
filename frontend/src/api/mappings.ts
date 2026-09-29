import api from './axios';
import { Patient } from './patients';
import { Doctor } from './doctors';

export interface PatientDoctorMapping {
  id: number;
  patient_id?: number;
  doctor_id?: number;
  patient: Patient;
  doctor: Doctor;
  notes?: string;
  assigned_at?: string;
}

export interface PatientDoctorsResponse {
  patient_id: number;
  patient_name: string;
  assigned_doctors_count: number;
  mappings: PatientDoctorMapping[];
}

export interface CreateMappingPayload {
  patient_id: number;
  doctor_id: number;
  notes?: string;
}

export const getMappingsApi = async (): Promise<PatientDoctorMapping[]> => {
  const response = await api.get<PatientDoctorMapping[]>('/mappings/');
  return response.data;
};

export const getPatientDoctorsApi = async (patientId: number): Promise<PatientDoctorsResponse> => {
  const response = await api.get<PatientDoctorsResponse>(`/mappings/${patientId}/`);
  return response.data;
};

export const createMappingApi = async (payload: CreateMappingPayload): Promise<PatientDoctorMapping> => {
  const response = await api.post<PatientDoctorMapping>('/mappings/', payload);
  return response.data;
};

export const deleteMappingApi = async (id: number): Promise<{ message: string }> => {
  const response = await api.delete<{ message: string }>(`/mappings/${id}/`);
  return response.data;
};

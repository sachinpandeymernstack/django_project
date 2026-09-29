import api from './axios';

export interface Patient {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  date_of_birth?: string;
  gender?: 'Male' | 'Female' | 'Other';
  address?: string;
  medical_history?: string;
  created_by?: number;
  created_by_email?: string;
  created_at?: string;
  updated_at?: string;
}

export type PatientCreatePayload = Omit<Patient, 'id' | 'created_by' | 'created_by_email' | 'created_at' | 'updated_at'>;

export const getPatientsApi = async (): Promise<Patient[]> => {
  const response = await api.get<Patient[]>('/patients/');
  return response.data;
};

export const getPatientDetailApi = async (id: number): Promise<Patient> => {
  const response = await api.get<Patient>(`/patients/${id}/`);
  return response.data;
};

export const createPatientApi = async (payload: PatientCreatePayload): Promise<Patient> => {
  const response = await api.post<Patient>('/patients/', payload);
  return response.data;
};

export const updatePatientApi = async (id: number, payload: Partial<PatientCreatePayload>): Promise<Patient> => {
  const response = await api.put<Patient>(`/patients/${id}/`, payload);
  return response.data;
};

export const deletePatientApi = async (id: number): Promise<{ message: string }> => {
  const response = await api.delete<{ message: string }>(`/patients/${id}/`);
  return response.data;
};

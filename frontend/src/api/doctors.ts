import api from './axios';

export interface Doctor {
  id: number;
  name: string;
  specialization: string;
  email: string;
  phone?: string;
  years_of_experience: number;
  hospital_name?: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export type DoctorCreatePayload = Omit<Doctor, 'id' | 'created_at' | 'updated_at'>;

export const getDoctorsApi = async (): Promise<Doctor[]> => {
  const response = await api.get<Doctor[]>('/doctors/');
  return response.data;
};

export const getDoctorDetailApi = async (id: number): Promise<Doctor> => {
  const response = await api.get<Doctor>(`/doctors/${id}/`);
  return response.data;
};

export const createDoctorApi = async (payload: DoctorCreatePayload): Promise<Doctor> => {
  const response = await api.post<Doctor>('/doctors/', payload);
  return response.data;
};

export const updateDoctorApi = async (id: number, payload: Partial<DoctorCreatePayload>): Promise<Doctor> => {
  const response = await api.put<Doctor>(`/doctors/${id}/`, payload);
  return response.data;
};

export const deleteDoctorApi = async (id: number): Promise<{ message: string }> => {
  const response = await api.delete<{ message: string }>(`/doctors/${id}/`);
  return response.data;
};

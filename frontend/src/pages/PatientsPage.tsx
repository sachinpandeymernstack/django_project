import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getPatientsApi, createPatientApi, updatePatientApi, deletePatientApi, Patient, PatientCreatePayload } from '../api/patients';
import { Plus, Search, Edit2, Trash2, User, Phone, Mail, Calendar, MapPin, FileText, Loader2 } from 'lucide-react';
import { Modal } from '../components/Modal';
import { motion } from 'framer-motion';
import { showErrorToast, showSuccessToast } from '../utils/toast';

export const PatientsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);

  // Form fields
  const [formData, setFormData] = useState<PatientCreatePayload>({
    name: '',
    email: '',
    phone: '',
    date_of_birth: '',
    gender: 'Male',
    address: '',
    medical_history: '',
  });

  // Queries & Mutations
  const { data: patients = [], isLoading, isError } = useQuery({
    queryKey: ['patients'],
    queryFn: getPatientsApi,
  });

  const createMutation = useMutation({
    mutationFn: createPatientApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] });
      setIsAddModalOpen(false);
      resetForm();
      showSuccessToast('Patient created successfully!');
    },
    onError: (err: any) => {
      showErrorToast(err, 'Failed to create patient');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<PatientCreatePayload> }) =>
      updatePatientApi(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] });
      setEditingPatient(null);
      resetForm();
      showSuccessToast('Patient record updated successfully!');
    },
    onError: (err: any) => {
      showErrorToast(err, 'Failed to update patient record');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deletePatientApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] });
      showSuccessToast('Patient record deleted');
    },
    onError: (err: any) => {
      showErrorToast(err, 'Failed to delete patient record');
    },
  });

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      date_of_birth: '',
      gender: 'Male',
      address: '',
      medical_history: '',
    });
  };

  const handleOpenEdit = (patient: Patient) => {
    setEditingPatient(patient);
    setFormData({
      name: patient.name,
      email: patient.email || '',
      phone: patient.phone || '',
      date_of_birth: patient.date_of_birth || '',
      gender: patient.gender || 'Male',
      address: patient.address || '',
      medical_history: patient.medical_history || '',
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingPatient) {
      updateMutation.mutate({ id: editingPatient.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const filteredPatients = patients.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.email && p.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (p.phone && p.phone.includes(searchTerm))
  );

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-100">Patient Directory</h2>
          <p className="text-sm text-slate-400">Manage records created by your authenticated user.</p>
        </div>
        <button
          onClick={() => { resetForm(); setEditingPatient(null); setIsAddModalOpen(true); }}
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs flex items-center space-x-2 shadow-lg shadow-blue-500/20 transition-all"
        >
          <Plus className="h-4 w-4" />
          <span>Add New Patient</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
        <input
          type="text"
          placeholder="Search patient by name, email, or phone..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-sm text-slate-200 placeholder-slate-500"
        />
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="flex justify-center items-center p-12">
          <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
        </div>
      )}

      {/* Error state */}
      {isError && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
          Failed to load patient records from backend API.
        </div>
      )}

      {/* Patients Grid */}
      {!isLoading && !isError && (
        <>
          {filteredPatients.length === 0 ? (
            <div className="glass-panel p-12 text-center rounded-2xl border border-slate-800">
              <User className="h-10 w-10 text-slate-600 mx-auto mb-3" />
              <h3 className="text-base font-semibold text-slate-300">No Patients Found</h3>
              <p className="text-xs text-slate-500 mt-1">Try adding a new patient or modifying your search.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredPatients.map((patient, idx) => (
                <motion.div
                  key={patient.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="glass-card p-5 rounded-2xl border border-slate-800 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-400 font-bold text-sm flex items-center justify-center">
                          {patient.name.charAt(0)}
                        </div>
                        <div>
                          <h4 className="text-base font-semibold text-slate-100">{patient.name}</h4>
                          <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-mono">
                            Patient ID: #{patient.id}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => handleOpenEdit(patient)}
                          className="p-1.5 text-slate-400 hover:text-blue-400 hover:bg-slate-800 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Delete patient record for ${patient.name}?`)) {
                              deleteMutation.mutate(patient.id);
                            }
                          }}
                          className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1.5 pt-2 border-t border-slate-800/80 text-xs text-slate-400">
                      {patient.email && (
                        <div className="flex items-center space-x-2">
                          <Mail className="h-3.5 w-3.5 text-slate-500" />
                          <span>{patient.email}</span>
                        </div>
                      )}
                      {patient.phone && (
                        <div className="flex items-center space-x-2">
                          <Phone className="h-3.5 w-3.5 text-slate-500" />
                          <span>{patient.phone}</span>
                        </div>
                      )}
                      {patient.date_of_birth && (
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-3.5 w-3.5 text-slate-500" />
                          <span>DOB: {patient.date_of_birth}</span>
                        </div>
                      )}
                      {patient.address && (
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-3.5 w-3.5 text-slate-500" />
                          <span className="truncate">{patient.address}</span>
                        </div>
                      )}
                      {patient.medical_history && (
                        <div className="flex items-start space-x-2 pt-1">
                          <FileText className="h-3.5 w-3.5 text-slate-500 mt-0.5" />
                          <span className="text-slate-300 italic line-clamp-2">{patient.medical_history}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="pt-3 mt-3 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-500">
                    <span>Gender: {patient.gender || 'Unspecified'}</span>
                    <span>By: {patient.created_by_email || 'You'}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Add / Edit Modal */}
      <Modal
        isOpen={isAddModalOpen || !!editingPatient}
        onClose={() => { setIsAddModalOpen(false); setEditingPatient(null); }}
        title={editingPatient ? 'Edit Patient Record' : 'Add New Patient'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Full Name *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. John Doe"
              className="w-full px-3.5 py-2 rounded-xl glass-input text-sm text-slate-200"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="patient@example.com"
                className="w-full px-3.5 py-2 rounded-xl glass-input text-sm text-slate-200"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Phone</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="123-456-7890"
                className="w-full px-3.5 py-2 rounded-xl glass-input text-sm text-slate-200"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Date of Birth</label>
              <input
                type="date"
                value={formData.date_of_birth}
                onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl glass-input text-sm text-slate-200"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Gender</label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                className="w-full px-3.5 py-2 rounded-xl glass-input text-sm text-slate-200 bg-slate-900"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Address</label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="123 Health St, Suite 4B"
              className="w-full px-3.5 py-2 rounded-xl glass-input text-sm text-slate-200"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Medical History / Notes</label>
            <textarea
              rows={3}
              value={formData.medical_history}
              onChange={(e) => setFormData({ ...formData, medical_history: e.target.value })}
              placeholder="Past conditions, allergies, or diagnostic notes..."
              className="w-full px-3.5 py-2 rounded-xl glass-input text-sm text-slate-200 resize-none"
            />
          </div>

          <div className="pt-2 flex justify-end space-x-3 border-t border-slate-800">
            <button
              type="button"
              onClick={() => { setIsAddModalOpen(false); setEditingPatient(null); }}
              className="px-4 py-2 rounded-xl glass-card text-xs font-medium text-slate-300 hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createMutation.isPending || updateMutation.isPending}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium shadow-md flex items-center space-x-1.5"
            >
              {(createMutation.isPending || updateMutation.isPending) && (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              )}
              <span>{editingPatient ? 'Save Changes' : 'Create Patient'}</span>
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

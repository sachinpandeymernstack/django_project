import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getDoctorsApi, createDoctorApi, updateDoctorApi, deleteDoctorApi, Doctor, DoctorCreatePayload } from '../api/doctors';
import { Plus, Search, Edit2, Trash2, Stethoscope, Mail, Phone, Award, Building, Loader2 } from 'lucide-react';
import { Modal } from '../components/Modal';
import { motion } from 'framer-motion';
import { showErrorToast, showSuccessToast } from '../utils/toast';

export const DoctorsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpec, setSelectedSpec] = useState('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);

  const [formData, setFormData] = useState<DoctorCreatePayload>({
    name: '',
    specialization: '',
    email: '',
    phone: '',
    years_of_experience: 0,
    hospital_name: '',
    is_active: true,
  });

  const { data: doctors = [], isLoading, isError } = useQuery({
    queryKey: ['doctors'],
    queryFn: getDoctorsApi,
  });

  const createMutation = useMutation({
    mutationFn: createDoctorApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['doctors'] });
      setIsAddModalOpen(false);
      resetForm();
      showSuccessToast('Doctor added successfully!');
    },
    onError: (err: any) => {
      showErrorToast(err, 'Failed to add doctor');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<DoctorCreatePayload> }) =>
      updateDoctorApi(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['doctors'] });
      setEditingDoctor(null);
      resetForm();
      showSuccessToast('Doctor record updated successfully!');
    },
    onError: (err: any) => {
      showErrorToast(err, 'Failed to update doctor record');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteDoctorApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['doctors'] });
      showSuccessToast('Doctor record deleted');
    },
    onError: (err: any) => {
      showErrorToast(err, 'Failed to delete doctor record');
    },
  });

  const resetForm = () => {
    setFormData({
      name: '',
      specialization: '',
      email: '',
      phone: '',
      years_of_experience: 0,
      hospital_name: '',
      is_active: true,
    });
  };

  const handleOpenEdit = (doc: Doctor) => {
    setEditingDoctor(doc);
    setFormData({
      name: doc.name,
      specialization: doc.specialization,
      email: doc.email,
      phone: doc.phone || '',
      years_of_experience: doc.years_of_experience,
      hospital_name: doc.hospital_name || '',
      is_active: doc.is_active,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingDoctor) {
      updateMutation.mutate({ id: editingDoctor.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const specializations = ['All', ...Array.from(new Set(doctors.map((d) => d.specialization)))];

  const filteredDoctors = doctors.filter((doc) => {
    const matchesSearch =
      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpec = selectedSpec === 'All' || doc.specialization === selectedSpec;
    return matchesSearch && matchesSpec;
  });

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-100">Doctor Directory</h2>
          <p className="text-sm text-slate-400">View and manage hospital medical specialists.</p>
        </div>
        <button
          onClick={() => { resetForm(); setEditingDoctor(null); setIsAddModalOpen(true); }}
          className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs flex items-center space-x-2 shadow-lg shadow-emerald-500/20 transition-all"
        >
          <Plus className="h-4 w-4" />
          <span>Add New Doctor</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search by doctor name or specialty..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-sm text-slate-200 placeholder-slate-500"
          />
        </div>

        {/* Specialization Pill Filters */}
        <div className="flex items-center space-x-2 overflow-x-auto w-full sm:w-auto pb-1">
          {specializations.map((spec) => (
            <button
              key={spec}
              onClick={() => setSelectedSpec(spec)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                selectedSpec === spec
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-sm'
                  : 'bg-slate-900/60 text-slate-400 border border-slate-800 hover:text-slate-200'
              }`}
            >
              {spec}
            </button>
          ))}
        </div>
      </div>

      {isLoading && (
        <div className="flex justify-center items-center p-12">
          <Loader2 className="h-8 w-8 text-emerald-500 animate-spin" />
        </div>
      )}

      {isError && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
          Failed to load doctor directory from backend API.
        </div>
      )}

      {!isLoading && !isError && (
        <>
          {filteredDoctors.length === 0 ? (
            <div className="glass-panel p-12 text-center rounded-2xl border border-slate-800">
              <Stethoscope className="h-10 w-10 text-slate-600 mx-auto mb-3" />
              <h3 className="text-base font-semibold text-slate-300">No Doctors Found</h3>
              <p className="text-xs text-slate-500 mt-1">Try adding a doctor or clear search filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredDoctors.map((doc, idx) => (
                <motion.div
                  key={doc.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="glass-card p-5 rounded-2xl border border-slate-800 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 rounded-xl bg-emerald-600/20 border border-emerald-500/30 text-emerald-400 font-bold text-sm flex items-center justify-center">
                          Dr.
                        </div>
                        <div>
                          <h4 className="text-base font-semibold text-slate-100">{doc.name}</h4>
                          <span className="text-xs font-medium text-emerald-400">
                            {doc.specialization}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => handleOpenEdit(doc)}
                          className="p-1.5 text-slate-400 hover:text-emerald-400 hover:bg-slate-800 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Delete doctor record for Dr. ${doc.name}?`)) {
                              deleteMutation.mutate(doc.id);
                            }
                          }}
                          className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-slate-800/80 text-xs text-slate-400">
                      <div className="flex items-center space-x-2">
                        <Mail className="h-3.5 w-3.5 text-slate-500" />
                        <span>{doc.email}</span>
                      </div>
                      {doc.phone && (
                        <div className="flex items-center space-x-2">
                          <Phone className="h-3.5 w-3.5 text-slate-500" />
                          <span>{doc.phone}</span>
                        </div>
                      )}
                      {doc.hospital_name && (
                        <div className="flex items-center space-x-2">
                          <Building className="h-3.5 w-3.5 text-slate-500" />
                          <span>{doc.hospital_name}</span>
                        </div>
                      )}
                      <div className="flex items-center space-x-2">
                        <Award className="h-3.5 w-3.5 text-amber-500" />
                        <span className="text-slate-300">{doc.years_of_experience} Years Experience</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 mt-3 border-t border-slate-800/60 flex items-center justify-between text-[11px]">
                    <span className="text-slate-500">ID: #{doc.id}</span>
                    <span
                      className={`px-2 py-0.5 rounded-full font-medium ${
                        doc.is_active
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-slate-800 text-slate-500'
                      }`}
                    >
                      {doc.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Add / Edit Doctor Modal */}
      <Modal
        isOpen={isAddModalOpen || !!editingDoctor}
        onClose={() => { setIsAddModalOpen(false); setEditingDoctor(null); }}
        title={editingDoctor ? 'Edit Doctor Record' : 'Add New Doctor'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Doctor Name *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Gregory House"
              className="w-full px-3.5 py-2 rounded-xl glass-input text-sm text-slate-200"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Specialization *</label>
              <input
                type="text"
                required
                value={formData.specialization}
                onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                placeholder="e.g. Cardiology, Diagnostics"
                className="w-full px-3.5 py-2 rounded-xl glass-input text-sm text-slate-200"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Email *</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="doctor@hospital.org"
                className="w-full px-3.5 py-2 rounded-xl glass-input text-sm text-slate-200"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Phone</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="555-0192"
                className="w-full px-3.5 py-2 rounded-xl glass-input text-sm text-slate-200"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Years of Experience</label>
              <input
                type="number"
                min="0"
                value={formData.years_of_experience}
                onChange={(e) => setFormData({ ...formData, years_of_experience: parseInt(e.target.value) || 0 })}
                className="w-full px-3.5 py-2 rounded-xl glass-input text-sm text-slate-200"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Hospital / Clinic Name</label>
            <input
              type="text"
              value={formData.hospital_name}
              onChange={(e) => setFormData({ ...formData, hospital_name: e.target.value })}
              placeholder="Princeton-Plainsboro Teaching Hospital"
              className="w-full px-3.5 py-2 rounded-xl glass-input text-sm text-slate-200"
            />
          </div>

          <div className="pt-2 flex justify-end space-x-3 border-t border-slate-800">
            <button
              type="button"
              onClick={() => { setIsAddModalOpen(false); setEditingDoctor(null); }}
              className="px-4 py-2 rounded-xl glass-card text-xs font-medium text-slate-300 hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createMutation.isPending || updateMutation.isPending}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium shadow-md flex items-center space-x-1.5"
            >
              {(createMutation.isPending || updateMutation.isPending) && (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              )}
              <span>{editingDoctor ? 'Save Changes' : 'Create Doctor'}</span>
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

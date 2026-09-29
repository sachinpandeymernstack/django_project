import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getPatientsApi } from '../api/patients';
import { getDoctorsApi } from '../api/doctors';
import { getMappingsApi, createMappingApi, deleteMappingApi } from '../api/mappings';
import { GitMerge, Plus, Trash2, ArrowRight, User, Stethoscope, FileText, Filter, Loader2 } from 'lucide-react';
import { Modal } from '../components/Modal';
import { SkeletonGrid } from '../components/Skeleton';
import { motion } from 'framer-motion';
import { showErrorToast, showSuccessToast } from '../utils/toast';


export const MappingsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedPatientFilter, setSelectedPatientFilter] = useState<number | 'All'>('All');

  // Form states
  const [patientId, setPatientId] = useState<number | ''>('');
  const [doctorId, setDoctorId] = useState<number | ''>('');
  const [notes, setNotes] = useState('');

  // Queries
  const { data: patients = [] } = useQuery({ queryKey: ['patients'], queryFn: getPatientsApi });
  const { data: doctors = [] } = useQuery({ queryKey: ['doctors'], queryFn: getDoctorsApi });
  const { data: mappings = [], isLoading, isError } = useQuery({ queryKey: ['mappings'], queryFn: getMappingsApi });

  const createMutation = useMutation({
    mutationFn: createMappingApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mappings'] });
      setIsAssignModalOpen(false);
      resetForm();
      showSuccessToast('Doctor successfully assigned to patient!');
    },
    onError: (err: any) => {
      showErrorToast(err, 'Failed to assign doctor to patient');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteMappingApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mappings'] });
      showSuccessToast('Doctor unassigned from patient');
    },
    onError: (err: any) => {
      showErrorToast(err, 'Failed to remove mapping');
    },
  });

  const resetForm = () => {
    setPatientId('');
    setDoctorId('');
    setNotes('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientId || !doctorId) {
      showErrorToast(null, 'Please select both a patient and a doctor.');
      return;
    }
    createMutation.mutate({
      patient_id: Number(patientId),
      doctor_id: Number(doctorId),
      notes,
    });
  };

  const filteredMappings = mappings.filter((m) => {
    if (selectedPatientFilter === 'All') return true;
    return m.patient?.id === selectedPatientFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-100">Patient - Doctor Mappings</h2>
          <p className="text-sm text-slate-400">Assign specialized doctors to patient care plans.</p>
        </div>
        <button
          onClick={() => { resetForm(); setIsAssignModalOpen(true); }}
          className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-medium text-xs flex items-center space-x-2 shadow-lg shadow-purple-500/20 transition-all"
        >
          <Plus className="h-4 w-4" />
          <span>Assign Doctor to Patient</span>
        </button>
      </div>

      {/* Filter Selector */}
      <div className="flex items-center space-x-3 glass-panel p-3.5 rounded-2xl border border-slate-800">
        <Filter className="h-4 w-4 text-purple-400 ml-1" />
        <span className="text-xs font-medium text-slate-300">Filter by Patient:</span>
        <select
          value={selectedPatientFilter}
          onChange={(e) =>
            setSelectedPatientFilter(e.target.value === 'All' ? 'All' : Number(e.target.value))
          }
          className="bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
        >
          <option value="All">All Patients ({mappings.length})</option>
          {patients.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name} (ID: #{p.id})
            </option>
          ))}
        </select>
      </div>

      {isLoading && <SkeletonGrid count={4} />}


      {isError && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
          Failed to load patient-doctor mappings from backend API.
        </div>
      )}

      {!isLoading && !isError && (
        <>
          {filteredMappings.length === 0 ? (
            <div className="glass-panel p-12 text-center rounded-2xl border border-slate-800">
              <GitMerge className="h-10 w-10 text-slate-600 mx-auto mb-3" />
              <h3 className="text-base font-semibold text-slate-300">No Mappings Found</h3>
              <p className="text-xs text-slate-500 mt-1">Assign doctors to patients to create care relationships.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {filteredMappings.map((mapping, idx) => (
                <motion.div
                  key={mapping.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="glass-card p-5 rounded-2xl border border-slate-800 flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    {/* Patient -> Doctor Flow Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-xs font-mono text-purple-400 bg-purple-500/10 px-2.5 py-1 rounded-lg border border-purple-500/20">
                        <GitMerge className="h-3.5 w-3.5" />
                        <span>Mapping ID: #{mapping.id}</span>
                      </div>
                      <button
                        onClick={() => {
                          if (confirm('Unassign doctor from patient?')) {
                            deleteMutation.mutate(mapping.id);
                          }
                        }}
                        className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-colors"
                        title="Remove Mapping"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Visual Pair Card */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                      {/* Patient Info */}
                      <div className="flex items-center space-x-3">
                        <div className="h-9 w-9 rounded-xl bg-blue-600/20 text-blue-400 font-bold text-xs flex items-center justify-center shrink-0">
                          <User className="h-4 w-4" />
                        </div>
                        <div className="truncate">
                          <p className="text-xs font-medium text-slate-400">Patient</p>
                          <p className="text-sm font-semibold text-slate-100 truncate">
                            {mapping.patient?.name || 'Patient Deleted'}
                          </p>
                        </div>
                      </div>

                      {/* Doctor Info */}
                      <div className="flex items-center space-x-3 sm:border-l sm:border-slate-800 sm:pl-3">
                        <div className="h-9 w-9 rounded-xl bg-emerald-600/20 text-emerald-400 font-bold text-xs flex items-center justify-center shrink-0">
                          <Stethoscope className="h-4 w-4" />
                        </div>
                        <div className="truncate">
                          <p className="text-xs font-medium text-slate-400">Doctor</p>
                          <p className="text-sm font-semibold text-slate-100 truncate">
                            Dr. {mapping.doctor?.name || 'Doctor Deleted'}
                          </p>
                          <p className="text-[11px] text-emerald-400 truncate">
                            {mapping.doctor?.specialization}
                          </p>
                        </div>
                      </div>
                    </div>

                    {mapping.notes && (
                      <div className="text-xs text-slate-400 flex items-start space-x-2 pt-1">
                        <FileText className="h-3.5 w-3.5 text-slate-500 mt-0.5 shrink-0" />
                        <span className="italic">{mapping.notes}</span>
                      </div>
                    )}
                  </div>

                  <div className="pt-3 mt-3 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-500">
                    <span>Assigned: {mapping.assigned_at ? new Date(mapping.assigned_at).toLocaleDateString() : 'N/A'}</span>
                    <span className="flex items-center gap-1 text-purple-400">
                      Active Care Plan <ArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Assign Doctor Modal */}
      <Modal
        isOpen={isAssignModalOpen}
        onClose={() => { setIsAssignModalOpen(false); resetForm(); }}
        title="Assign Doctor to Patient"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Select Patient *</label>
            <select
              required
              value={patientId}
              onChange={(e) => setPatientId(e.target.value === '' ? '' : Number(e.target.value))}
              className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm text-slate-200 bg-slate-900"
            >
              <option value="">-- Choose Patient --</option>
              {patients.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} (ID: #{p.id})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Select Doctor *</label>
            <select
              required
              value={doctorId}
              onChange={(e) => setDoctorId(e.target.value === '' ? '' : Number(e.target.value))}
              className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm text-slate-200 bg-slate-900"
            >
              <option value="">-- Choose Doctor --</option>
              {doctors.map((d) => (
                <option key={d.id} value={d.id}>
                  Dr. {d.name} ({d.specialization})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Clinical Notes / Reason</label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Reason for consultation, treatment plan notes..."
              className="w-full px-3.5 py-2 rounded-xl glass-input text-sm text-slate-200 resize-none"
            />
          </div>

          <div className="pt-2 flex justify-end space-x-3 border-t border-slate-800">
            <button
              type="button"
              onClick={() => { setIsAssignModalOpen(false); resetForm(); }}
              className="px-4 py-2 rounded-xl glass-card text-xs font-medium text-slate-300 hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createMutation.isPending}
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-medium shadow-md flex items-center space-x-1.5"
            >
              {createMutation.isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              <span>Create Assignment</span>
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

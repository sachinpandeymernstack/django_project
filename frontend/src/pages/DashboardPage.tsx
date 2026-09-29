import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getPatientsApi } from '../api/patients';
import { getDoctorsApi } from '../api/doctors';
import { getMappingsApi } from '../api/mappings';
import { Users, Stethoscope, GitMerge, Plus, ArrowUpRight, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface DashboardPageProps {
  setActiveTab: (tab: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ setActiveTab }) => {
  const { data: patients = [] } = useQuery({ queryKey: ['patients'], queryFn: getPatientsApi });
  const { data: doctors = [] } = useQuery({ queryKey: ['doctors'], queryFn: getDoctorsApi });
  const { data: mappings = [] } = useQuery({ queryKey: ['mappings'], queryFn: getMappingsApi });

  const stats = [
    {
      title: 'My Patients',
      count: patients.length,
      icon: Users,
      color: 'from-blue-500 to-indigo-600',
      action: 'patients',
    },
    {
      title: 'Active Doctors',
      count: doctors.length,
      icon: Stethoscope,
      color: 'from-emerald-500 to-teal-600',
      action: 'doctors',
    },
    {
      title: 'Care Mappings',
      count: mappings.length,
      icon: GitMerge,
      color: 'from-purple-500 to-pink-600',
      action: 'mappings',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 bg-gradient-to-r from-blue-900/20 via-indigo-900/10 to-transparent flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-100">Healthcare Dashboard</h2>
          <p className="text-sm text-slate-400 mt-1">
            Manage patient records, medical staff directory, and doctor-patient care plans.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setActiveTab('patients')}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs flex items-center space-x-2 shadow-lg shadow-blue-500/20 transition-all"
          >
            <Plus className="h-4 w-4" />
            <span>Add Patient</span>
          </button>
          <button
            onClick={() => setActiveTab('mappings')}
            className="px-4 py-2.5 rounded-xl glass-card hover:bg-slate-800 text-slate-200 font-medium text-xs flex items-center space-x-2 transition-all"
          >
            <GitMerge className="h-4 w-4 text-purple-400" />
            <span>Assign Doctor</span>
          </button>
        </div>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1, duration: 0.3 }}
              className="glass-card p-5 rounded-2xl border border-slate-800 flex flex-col justify-between relative overflow-hidden group cursor-pointer"
              onClick={() => setActiveTab(stat.action)}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-semibold text-slate-400">{stat.title}</span>
                <div className={`h-10 w-10 rounded-xl bg-gradient-to-tr ${stat.color} flex items-center justify-center text-white shadow-md`}>
                  <Icon className="h-5 w-5" />
                </div>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-extrabold text-slate-100">{stat.count}</span>
                <ArrowUpRight className="h-4 w-4 text-slate-500 group-hover:text-blue-400 transition-colors" />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Two Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Patients */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-slate-200">Recent Patients</h3>
            <button
              onClick={() => setActiveTab('patients')}
              className="text-xs text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="h-3 w-3" />
            </button>
          </div>

          {patients.length === 0 ? (
            <div className="p-8 text-center border border-dashed border-slate-800 rounded-xl">
              <Users className="h-8 w-8 text-slate-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-slate-400">No patients recorded yet.</p>
              <p className="text-xs text-slate-500 mt-1">Click Add Patient to create your first record.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {patients.slice(0, 5).map((patient) => (
                <div
                  key={patient.id}
                  className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3">
                    <div className="h-9 w-9 rounded-full bg-blue-600/20 border border-blue-500/30 text-blue-400 font-bold text-xs flex items-center justify-center">
                      {patient.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-200">{patient.name}</p>
                      <p className="text-xs text-slate-500">{patient.email || patient.phone || 'No contact info'}</p>
                    </div>
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-slate-800 text-slate-400 font-mono">
                    ID: #{patient.id}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Doctors */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-slate-200">Medical Specialists</h3>
            <button
              onClick={() => setActiveTab('doctors')}
              className="text-xs text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1"
            >
              <span>View Directory</span>
              <ArrowRight className="h-3 w-3" />
            </button>
          </div>

          {doctors.length === 0 ? (
            <div className="p-8 text-center border border-dashed border-slate-800 rounded-xl">
              <Stethoscope className="h-8 w-8 text-slate-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-slate-400">No doctors registered yet.</p>
              <p className="text-xs text-slate-500 mt-1">Navigate to Doctors tab to add specialists.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {doctors.slice(0, 5).map((doctor) => (
                <div
                  key={doctor.id}
                  className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3">
                    <div className="h-9 w-9 rounded-full bg-emerald-600/20 border border-emerald-500/30 text-emerald-400 font-bold text-xs flex items-center justify-center">
                      Dr.
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-200">Dr. {doctor.name}</p>
                      <p className="text-xs text-emerald-400">{doctor.specialization}</p>
                    </div>
                  </div>
                  <span className="text-xs text-slate-400 font-medium">
                    {doctor.years_of_experience} Yrs Exp
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

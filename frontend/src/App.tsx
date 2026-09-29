import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { AuthPage } from './pages/AuthPage';
import { DashboardPage } from './pages/DashboardPage';
import { PatientsPage } from './pages/PatientsPage';
import { DoctorsPage } from './pages/DoctorsPage';
import { MappingsPage } from './pages/MappingsPage';
import { LayoutDashboard, Users, Stethoscope, GitMerge } from 'lucide-react';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const MainContent: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  if (!isAuthenticated) {
    return <AuthPage />;
  }

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col">
      <Navbar activeTab={activeTab} />

      <div className="flex-1 flex overflow-hidden">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        <main className="flex-1 p-4 md:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
          {/* Mobile Tab Navigation */}
          <div className="flex md:hidden items-center space-x-1 mb-6 p-1 rounded-xl glass-panel border border-slate-800 overflow-x-auto">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium flex items-center justify-center space-x-1.5 ${
                activeTab === 'dashboard' ? 'bg-blue-600 text-white' : 'text-slate-400'
              }`}
            >
              <LayoutDashboard className="h-3.5 w-3.5" />
              <span>Dashboard</span>
            </button>
            <button
              onClick={() => setActiveTab('patients')}
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium flex items-center justify-center space-x-1.5 ${
                activeTab === 'patients' ? 'bg-blue-600 text-white' : 'text-slate-400'
              }`}
            >
              <Users className="h-3.5 w-3.5" />
              <span>Patients</span>
            </button>
            <button
              onClick={() => setActiveTab('doctors')}
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium flex items-center justify-center space-x-1.5 ${
                activeTab === 'doctors' ? 'bg-blue-600 text-white' : 'text-slate-400'
              }`}
            >
              <Stethoscope className="h-3.5 w-3.5" />
              <span>Doctors</span>
            </button>
            <button
              onClick={() => setActiveTab('mappings')}
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium flex items-center justify-center space-x-1.5 ${
                activeTab === 'mappings' ? 'bg-blue-600 text-white' : 'text-slate-400'
              }`}
            >
              <GitMerge className="h-3.5 w-3.5" />
              <span>Mappings</span>
            </button>
          </div>

          {activeTab === 'dashboard' && <DashboardPage setActiveTab={setActiveTab} />}
          {activeTab === 'patients' && <PatientsPage />}
          {activeTab === 'doctors' && <DoctorsPage />}
          {activeTab === 'mappings' && <MappingsPage />}
        </main>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Toaster position="top-right" />
        <MainContent />
      </AuthProvider>
    </QueryClientProvider>
  );
}

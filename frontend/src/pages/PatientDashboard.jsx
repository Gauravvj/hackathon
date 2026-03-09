import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import Layout from '../components/Layout';
import MedicineCard from '../components/MedicineCard';
import VoiceConfirmation from '../components/VoiceConfirmation';
import CameraVerification from '../components/CameraVerification';

/**
 * PatientDashboard — main screen for patients.
 * Shows: medicine schedule cards, voice/camera confirmation,
 * today's stats, and a reminder banner.
 */
export default function PatientDashboard() {
  const { user } = useAuth();
  const [medicines, setMedicines] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedMedicine, setSelectedMedicine] = useState(null);

  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = async () => {
    try {
      const [medsRes, statsRes] = await Promise.all([
        api.get(`/medicines/${user._id}`),
        api.get(`/logs/stats/${user._id}`),
      ]);
      setMedicines(medsRes.data);
      setStats(statsRes.data);
    } catch (err) {
      console.error('Failed to fetch data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogged = () => {
    fetchData(); // Refresh data after logging a dose
  };

  const handleVoiceConfirm = async (method) => {
    if (selectedMedicine) {
      try {
        await api.post('/logs', {
          patientId: user._id,
          medicineId: selectedMedicine._id,
          confirmationMethod: method,
        });
        fetchData();
        setSelectedMedicine(null);
      } catch (err) {
        if (err.response?.status === 409) {
          alert(err.response.data.message);
        }
      }
    }
  };

  // Current time for greeting
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-slate-400 text-lg">Loading your dashboard...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-8 animate-fade-in">
        {/* Greeting Header */}
        <div>
          <h1 className="text-3xl font-bold text-slate-100">
            {greeting}, <span className="bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">{user.name}</span> 👋
          </h1>
          <p className="text-slate-400 mt-1">Here's your medicine schedule for today</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="glass-card p-5 text-center">
            <p className="text-3xl font-bold text-indigo-400">{stats?.totalLogs || 0}</p>
            <p className="text-sm text-slate-400 mt-1">Total Doses Logged</p>
          </div>
          <div className="glass-card p-5 text-center">
            <p className="text-3xl font-bold text-green-400">{stats?.adherenceRate || 0}%</p>
            <p className="text-sm text-slate-400 mt-1">Adherence Rate</p>
          </div>
          <div className="glass-card p-5 text-center">
            <p className="text-3xl font-bold text-yellow-400">{medicines.length}</p>
            <p className="text-sm text-slate-400 mt-1">Active Medicines</p>
          </div>
        </div>

        {/* Medicine Schedule */}
        <div>
          <h2 className="text-xl font-bold text-slate-200 mb-4">💊 Today's Medicines</h2>
          {medicines.length === 0 ? (
            <div className="glass-card p-8 text-center">
              <span className="text-4xl block mb-3">📭</span>
              <p className="text-slate-400">No medicines scheduled. Ask your caregiver to add medicines.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {medicines.map((med) => (
                <div key={med._id}>
                  <MedicineCard
                    medicine={med}
                    patientId={user._id}
                    onLogged={handleLogged}
                  />
                  {/* Select for voice/camera */}
                  <button
                    onClick={() => setSelectedMedicine(med)}
                    className="mt-2 w-full text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
                    style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                  >
                    🎤📷 Use Voice or Camera for "{med.medicineName}"
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Voice & Camera Section */}
        {selectedMedicine && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-slate-200">
              Confirm: <span className="text-indigo-400">{selectedMedicine.medicineName}</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <VoiceConfirmation onConfirm={handleVoiceConfirm} />
              <CameraVerification onVerified={handleVoiceConfirm} />
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

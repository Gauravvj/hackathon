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
    <div className="min-h-[85vh] flex flex-col gap-14 animate-fade-in">

      {/* Greeting Header */}
      <div className="mb-4">
        <h1 className="text-4xl font-bold text-slate-100">
          {greeting},{" "}
          <span className="bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
            {user.name}
          </span>{" "}
          👋
        </h1>

        <p className="text-slate-400 text-base mt-2">
          Here's your medicine schedule for today
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 w-full">

        <div className="glass-card p-10 text-center transition-all hover:scale-[1.03] hover:shadow-lg">
          <p className="text-5xl font-bold text-indigo-400">
            {stats?.totalLogs || 0}
          </p>
          <p className="text-sm text-slate-400 mt-3">
            Total Doses Logged
          </p>
        </div>

        <div className="glass-card p-10 text-center transition-all hover:scale-[1.03] hover:shadow-lg">
          <p className="text-5xl font-bold text-green-400">
            {stats?.adherenceRate || 0}%
          </p>
          <p className="text-sm text-slate-400 mt-3">
            Adherence Rate
          </p>
        </div>

        <div className="glass-card p-10 text-center transition-all hover:scale-[1.03] hover:shadow-lg">
          <p className="text-5xl font-bold text-yellow-400">
            {medicines.length}
          </p>
          <p className="text-sm text-slate-400 mt-3">
            Active Medicines
          </p>
        </div>

      </div>

      {/* Medicine Section */}
      <div className="flex-1">

        <h2 className="text-2xl font-bold text-slate-200 mb-10 flex items-center gap-2">
          💊 Today's Medicines
        </h2>

        {medicines.length === 0 ? (

          <div className="glass-card p-16 text-center min-h-[260px] flex flex-col justify-center">

            <span className="text-6xl block mb-5">📭</span>

            <p className="text-slate-400 text-lg">
              No medicines scheduled
            </p>

            <p className="text-slate-500 text-sm mt-2">
              Ask your caregiver to add medicines.
            </p>

          </div>

        ) : (

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

            {medicines.map((med) => (
              <div
                key={med._id}
                className="glass-card p-8 transition hover:shadow-lg"
              >

                <MedicineCard
                  medicine={med}
                  patientId={user._id}
                  onLogged={handleLogged}
                />

                <button
                  onClick={() => setSelectedMedicine(med)}
                  className="mt-5 w-full text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer"
                  }}
                >
                  🎤📷 Use Voice or Camera for "{med.medicineName}"
                </button>

              </div>
            ))}

          </div>

        )}
      </div>

      {/* Voice + Camera */}
      {selectedMedicine && (

        <div className="space-y-8 glass-card p-10">

          <h2 className="text-2xl font-bold text-slate-200">
            Confirm:
            <span className="text-indigo-400 ml-2">
              {selectedMedicine.medicineName}
            </span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

            <VoiceConfirmation onConfirm={handleVoiceConfirm} />

            <CameraVerification onVerified={handleVoiceConfirm} />

          </div>

        </div>

      )}

    </div>
  </Layout>
);
}

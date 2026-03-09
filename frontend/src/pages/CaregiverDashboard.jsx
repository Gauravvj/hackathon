import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import Layout from '../components/Layout';

/**
 * CaregiverDashboard — main screen for caregivers.
 * Shows: linked patients, adherence stats, alerts, and trends.
 */
export default function CaregiverDashboard() {
  const { user } = useAuth();
  const [patients, setPatients] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [allPatients, setAllPatients] = useState([]);
  const [patientStats, setPatientStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = async () => {
    try {
      const [profileRes, alertsRes, allPatientsRes] = await Promise.all([
        api.get('/auth/me'),
        api.get(`/alerts/${user._id}`),
        api.get('/auth/patients'),
      ]);

      const linkedPatients = profileRes.data.linkedPatients || [];
      setPatients(linkedPatients);
      setAlerts(alertsRes.data);
      setAllPatients(allPatientsRes.data);

      // Fetch stats for each linked patient
      const statsMap = {};
      for (const p of linkedPatients) {
        try {
          const statsRes = await api.get(`/logs/stats/${p._id}`);
          statsMap[p._id] = statsRes.data;
        } catch {
          statsMap[p._id] = { totalLogs: 0, takenCount: 0, missedCount: 0, adherenceRate: 0 };
        }
      }
      setPatientStats(statsMap);
    } catch (err) {
      console.error('Failed to fetch data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLinkPatient = async (patientId) => {
    try {
      await api.put(`/auth/link-patient/${patientId}`);
      fetchData();
    } catch (err) {
      alert('Failed to link patient');
    }
  };

  const handleMarkRead = async (alertId) => {
    try {
      await api.put(`/alerts/${alertId}/read`);
      setAlerts(alerts.map(a => a._id === alertId ? { ...a, read: true } : a));
    } catch (err) {
      console.error('Failed to mark alert as read');
    }
  };

  const unlinkedPatients = allPatients.filter(
    p => !patients.some(lp => lp._id === p._id)
  );

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-slate-400 text-lg">Loading dashboard...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-8 animate-fade-in">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-slate-100">
            Caregiver Dashboard
          </h1>
          <p className="text-slate-400 mt-1">Monitor your patients' medication adherence</p>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="glass-card p-5 text-center">
            <p className="text-3xl font-bold text-indigo-400">{patients.length}</p>
            <p className="text-sm text-slate-400 mt-1">Linked Patients</p>
          </div>
          <div className="glass-card p-5 text-center">
            <p className="text-3xl font-bold text-red-400">{alerts.filter(a => !a.read).length}</p>
            <p className="text-sm text-slate-400 mt-1">Unread Alerts</p>
          </div>
          <div className="glass-card p-5 text-center">
            <p className="text-3xl font-bold text-green-400">
              {patients.length > 0
                ? Math.round(Object.values(patientStats).reduce((sum, s) => sum + (s.adherenceRate || 0), 0) / patients.length)
                : 0}%
            </p>
            <p className="text-sm text-slate-400 mt-1">Avg Adherence</p>
          </div>
          <div className="glass-card p-5 text-center">
            <p className="text-3xl font-bold text-yellow-400">
              {Object.values(patientStats).reduce((sum, s) => sum + (s.missedCount || 0), 0)}
            </p>
            <p className="text-sm text-slate-400 mt-1">Total Missed</p>
          </div>
        </div>

        {/* Patient Cards */}
        <div>
          <h2 className="text-xl font-bold text-slate-200 mb-4">👥 Your Patients</h2>
          {patients.length === 0 ? (
            <div className="glass-card p-8 text-center">
              <span className="text-4xl block mb-3">👤</span>
              <p className="text-slate-400">No patients linked yet. Link a patient below.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {patients.map((patient) => {
                const s = patientStats[patient._id] || {};
                return (
                  <div key={patient._id} className="glass-card p-5">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center text-lg">
                        👤
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-100">{patient.name}</h3>
                        <p className="text-xs text-slate-400">{patient.email}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div>
                        <p className="text-lg font-bold text-green-400">{s.takenCount || 0}</p>
                        <p className="text-xs text-slate-500">Taken</p>
                      </div>
                      <div>
                        <p className="text-lg font-bold text-red-400">{s.missedCount || 0}</p>
                        <p className="text-xs text-slate-500">Missed</p>
                      </div>
                      <div>
                        <p className="text-lg font-bold text-indigo-400">{s.adherenceRate || 0}%</p>
                        <p className="text-xs text-slate-500">Adherence</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Link New Patient */}
        {unlinkedPatients.length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-slate-200 mb-4">➕ Link a Patient</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {unlinkedPatients.map((p) => (
                <div key={p._id} className="glass-card p-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-slate-200">{p.name}</p>
                    <p className="text-xs text-slate-400">{p.email}</p>
                  </div>
                  <button
                    onClick={() => handleLinkPatient(p._id)}
                    className="btn-primary text-xs py-2 px-3"
                  >
                    Link
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Alerts Section */}
        <div>
          <h2 className="text-xl font-bold text-slate-200 mb-4">🔔 Recent Alerts</h2>
          {alerts.length === 0 ? (
            <div className="glass-card p-8 text-center">
              <span className="text-4xl block mb-3">✅</span>
              <p className="text-slate-400">No alerts. All patients are on track!</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {alerts.slice(0, 20).map((alert) => (
                <div
                  key={alert._id}
                  className={`glass-card p-4 flex items-center justify-between ${
                    !alert.read ? 'border-l-4 border-l-red-500' : 'opacity-60'
                  }`}
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className={`badge ${
                        alert.type === 'missed_dose' ? 'badge-danger' :
                        alert.type === 'double_dose_attempt' ? 'badge-warning' : 'badge-info'
                      }`}>
                        {alert.type?.replace(/_/g, ' ')}
                      </span>
                      <span className="text-xs text-slate-500">
                        {new Date(alert.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm text-slate-300">{alert.message}</p>
                    {alert.patientId && (
                      <p className="text-xs text-slate-500 mt-1">
                        Patient: {alert.patientId.name || 'Unknown'}
                      </p>
                    )}
                  </div>
                  {!alert.read && (
                    <button
                      onClick={() => handleMarkRead(alert._id)}
                      className="btn-outline text-xs py-1 px-3 ml-3"
                    >
                      Mark Read
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import Layout from '../components/Layout';

export default function MedicationHistoryPage() {
  const { user } = useAuth();
  const [logs, setLogs] = useState([]);
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(user.role === 'patient' ? user._id : '');
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (user.role === 'caregiver') {
      api.get('/auth/me').then(res => {
        setPatients(res.data.linkedPatients || []);
        if (res.data.linkedPatients?.length > 0) setSelectedPatient(res.data.linkedPatients[0]._id);
      }).catch(() => {});
    }
  }, [user]);

  useEffect(() => { if (selectedPatient) fetchLogs(); }, [selectedPatient]);

  const fetchLogs = async () => {
    setLoading(true);
    try { const res = await api.get(`/logs/${selectedPatient}`); setLogs(res.data); }
    catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const filteredLogs = filter === 'all' ? logs : logs.filter(l => l.status === filter);
  const methodEmoji = (m) => m === 'voice' ? '🎤' : m === 'camera' ? '📷' : '👆';

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-100">📋 Medication History</h1>
            <p className="text-slate-400 text-sm mt-1">View complete medication log records</p>
          </div>
          {user.role === 'caregiver' && patients.length > 0 && (
            <select value={selectedPatient} onChange={(e) => setSelectedPatient(e.target.value)} className="input-field w-auto">
              {patients.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
            </select>
          )}
        </div>

        <div className="flex space-x-2">
          {['all', 'taken', 'missed'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                filter === f ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' : 'text-slate-400 hover:bg-white/5 border border-transparent'
              }`}>
              {f === 'all' ? '📋 All' : f === 'taken' ? '✅ Taken' : '❌ Missed'}
              <span className="ml-2 text-xs opacity-60">({f === 'all' ? logs.length : logs.filter(l => l.status === f).length})</span>
            </button>
          ))}
        </div>

        {loading ? <div className="text-center text-slate-400 py-10">Loading...</div>
        : filteredLogs.length === 0 ? (
          <div className="glass-card p-8 text-center"><span className="text-4xl block mb-3">📭</span><p className="text-slate-400">No logs found.</p></div>
        ) : (
          <div className="glass-card overflow-hidden"><div className="overflow-x-auto"><table className="w-full">
            <thead><tr className="border-b border-slate-700">
              <th className="text-left text-xs font-semibold text-slate-400 uppercase px-5 py-3">Medicine</th>
              <th className="text-left text-xs font-semibold text-slate-400 uppercase px-5 py-3">Status</th>
              <th className="text-left text-xs font-semibold text-slate-400 uppercase px-5 py-3">Method</th>
              <th className="text-left text-xs font-semibold text-slate-400 uppercase px-5 py-3">Time</th>
            </tr></thead>
            <tbody>{filteredLogs.map((log, i) => (
              <tr key={log._id} className={`border-b border-slate-700/50 hover:bg-white/5 ${i % 2 === 0 ? 'bg-white/[0.02]' : ''}`}>
                <td className="px-5 py-3"><span className="font-medium text-slate-200">{log.medicineId?.medicineName || 'Unknown'}</span></td>
                <td className="px-5 py-3"><span className={`badge ${log.status === 'taken' ? 'badge-success' : 'badge-danger'}`}>{log.status}</span></td>
                <td className="px-5 py-3 text-sm text-slate-300">{methodEmoji(log.confirmationMethod)} {log.confirmationMethod}</td>
                <td className="px-5 py-3 text-sm text-slate-400">{new Date(log.takenTime).toLocaleString()}</td>
              </tr>
            ))}</tbody>
          </table></div></div>
        )}
      </div>
    </Layout>
  );
}

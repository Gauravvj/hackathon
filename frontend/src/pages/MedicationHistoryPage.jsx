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
      {/* Outer Wrapper: Forces everything to the center. 
        'flex flex-col items-center' guarantees horizontal centering. 
      */}
      <div className="min-h-screen w-full flex flex-col items-center pt-10 pb-24 px-4 sm:px-8">
        
        {/* Inner Container: Holds the content and restricts how wide it can get.
          'max-w-5xl' keeps it pleasantly wide but not stretched across ultra-wide monitors.
        */}
        <div className="w-full max-w-5xl flex flex-col animate-fade-in">
          
          {/* Header Section */}
          <div className="flex flex-col items-center justify-center text-center gap-4 mb-12 mt-4">
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-100 tracking-tight">
              📋 Medication History
            </h1>
            <p className="text-slate-400 text-lg md:text-xl mt-2">
              View complete medication log records
            </p>
            
            {user.role === 'caregiver' && patients.length > 0 && (
              <select 
                value={selectedPatient} 
                onChange={(e) => setSelectedPatient(e.target.value)} 
                className="input-field w-auto min-w-[250px] mt-6 px-6 py-3 text-lg bg-slate-800/80 border border-slate-600 rounded-xl text-white shadow-lg focus:ring-2 focus:ring-indigo-500"
              >
                {patients.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
              </select>
            )}
          </div>

          {/* Filter Cards Section */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8 w-full mb-12">
            {[
              { key: 'all', label: 'All Logs', icon: '📋', count: logs.length },
              { key: 'taken', label: 'Taken', icon: '✅', count: logs.filter(l => l.status === 'taken').length },
              { key: 'missed', label: 'Missed', icon: '❌', count: logs.filter(l => l.status === 'missed').length }
            ].map(item => (
              <button
                key={item.key}
                onClick={() => setFilter(item.key)}
                className={`p-8 min-h-[160px] rounded-3xl border transition-all duration-300 flex flex-col items-center justify-center text-center
                ${
                  filter === item.key
                    ? 'bg-indigo-500/20 border-indigo-400 shadow-[0_0_30px_rgba(99,102,241,0.15)] scale-[1.03]'
                    : 'bg-white/[0.03] border-slate-700/50 hover:bg-white/[0.08] hover:border-slate-500'
                }`}
              >
                <div className="flex items-center justify-center gap-3 mb-3">
                  <span className="text-2xl">{item.icon}</span>
                  <span className="text-lg md:text-xl text-slate-300 font-semibold tracking-wide">{item.label}</span>
                </div>
                <div className="text-5xl font-black text-white">
                  {item.count}
                </div>
              </button>
            ))}
          </div>

          {/* Main Content Area */}
          <div className="w-full flex flex-col">
            {loading ? (
              <div className="flex-grow flex items-center justify-center py-20">
                <div className="text-xl text-slate-400 animate-pulse font-medium">Loading records...</div>
              </div>
            ) : filteredLogs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 bg-slate-800/30 border border-slate-700/50 rounded-3xl shadow-inner w-full">
                <span className="text-7xl block mb-6 drop-shadow-lg">📭</span>
                <p className="text-slate-200 text-3xl font-bold">
                  No logs found
                </p>
                <p className="text-slate-500 text-base mt-3 font-medium">
                  There are currently no records to display here.
                </p>
              </div>
            ) : (
              <div className="glass-card overflow-hidden rounded-3xl border border-slate-700/50 shadow-2xl w-full bg-slate-900/40">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[600px]">
                    <thead>
                      <tr className="bg-slate-800/80 border-b border-slate-700/80">
                        <th className="text-sm font-bold text-slate-300 uppercase tracking-widest px-6 md:px-8 py-5">Medicine</th>
                        <th className="text-sm font-bold text-slate-300 uppercase tracking-widest px-6 md:px-8 py-5">Status</th>
                        <th className="text-sm font-bold text-slate-300 uppercase tracking-widest px-6 md:px-8 py-5">Method</th>
                        <th className="text-sm font-bold text-slate-300 uppercase tracking-widest px-6 md:px-8 py-5">Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredLogs.map((log, i) => (
                        <tr 
                          key={log._id} 
                          className={`border-b border-slate-700/30 hover:bg-white/[0.05] transition-colors duration-150 ${
                            i % 2 === 0 ? 'bg-transparent' : 'bg-slate-800/20'
                          }`}
                        >
                          <td className="px-6 md:px-8 py-5">
                            <span className="text-base md:text-lg font-semibold text-slate-100">{log.medicineId?.medicineName || 'Unknown'}</span>
                          </td>
                          <td className="px-6 md:px-8 py-5">
                            <span className={`px-3 py-1.5 rounded-full text-xs md:text-sm font-bold tracking-wide ${
                              log.status === 'taken' 
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                                : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                            }`}>
                              {log.status.toUpperCase()}
                            </span>
                          </td>
                          <td className="px-6 md:px-8 py-5 text-slate-300 font-medium flex items-center gap-2">
                            <span className="text-lg">{methodEmoji(log.confirmationMethod)}</span> 
                            <span className="capitalize text-sm md:text-base">{log.confirmationMethod}</span>
                          </td>
                          <td className="px-6 md:px-8 py-5 text-sm md:text-base text-slate-400 font-medium whitespace-nowrap">
                            {new Date(log.takenTime).toLocaleString(undefined, { 
                              dateStyle: 'medium', 
                              timeStyle: 'short' 
                            })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
          
        </div>
      </div>
    </Layout>
  );
}

import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import Layout from '../components/Layout';

/**
 * MedicineSchedulePage — add/edit/delete medicines for a patient.
 * Caregivers can manage medicines for their linked patients.
 * Patients see their own medicines.
 */
export default function MedicineSchedulePage() {
  const { user } = useAuth();
  const [medicines, setMedicines] = useState([]);
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(user.role === 'patient' ? user._id : '');
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingMed, setEditingMed] = useState(null);
  const [formData, setFormData] = useState({
    medicineName: '',
    dosage: '',
    scheduleTimes: '',
    instructions: '',
  });

  useEffect(() => {
    if (user.role === 'caregiver') {
      api.get('/auth/me').then(res => {
        setPatients(res.data.linkedPatients || []);
        if (res.data.linkedPatients?.length > 0) {
          setSelectedPatient(res.data.linkedPatients[0]._id);
        }
      }).catch(() => {});
    }
  }, [user]);

  useEffect(() => {
    if (selectedPatient) fetchMedicines();
  }, [selectedPatient]);

  const fetchMedicines = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/medicines/${selectedPatient}`);
      setMedicines(res.data);
    } catch (err) {
      console.error('Failed to fetch medicines:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      patientId: selectedPatient,
      medicineName: formData.medicineName,
      dosage: formData.dosage,
      scheduleTimes: formData.scheduleTimes.split(',').map(t => t.trim()),
      instructions: formData.instructions,
    };

    try {
      if (editingMed) {
        await api.put(`/medicines/${editingMed._id}`, payload);
      } else {
        await api.post('/medicines', payload);
      }
      setShowForm(false);
      setEditingMed(null);
      setFormData({ medicineName: '', dosage: '', scheduleTimes: '', instructions: '' });
      fetchMedicines();
    } catch (err) {
      alert('Failed to save medicine');
    }
  };

  const handleEdit = (med) => {
    setEditingMed(med);
    setFormData({
      medicineName: med.medicineName,
      dosage: med.dosage,
      scheduleTimes: med.scheduleTimes.join(', '),
      instructions: med.instructions || '',
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to remove this medicine?')) return;
    try {
      await api.delete(`/medicines/${id}`);
      fetchMedicines();
    } catch (err) {
      alert('Failed to delete medicine');
    }
  };

  return (
  <Layout>
    <div className="min-h-[85vh] flex flex-col gap-12 animate-fade-in">

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">

        <div>
          <h1 className="text-4xl font-bold text-slate-100">
            💊 Medicine Schedule
          </h1>

          <p className="text-slate-400 text-base mt-2">
            Manage daily medicines and schedule times
          </p>
        </div>

        <div className="flex items-center gap-4">

          {user.role === "caregiver" && patients.length > 0 && (
            <select
              value={selectedPatient}
              onChange={(e) => setSelectedPatient(e.target.value)}
              className="input-field w-auto"
            >
              {patients.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.name}
                </option>
              ))}
            </select>
          )}

          <button
            onClick={() => {
              setShowForm(!showForm);
              setEditingMed(null);
              setFormData({
                medicineName: "",
                dosage: "",
                scheduleTimes: "",
                instructions: "",
              });
            }}
            className="btn-primary px-6 py-3 text-sm"
          >
            {showForm ? "✕ Cancel" : "➕ Add Medicine"}
          </button>
        </div>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="glass-card p-8 space-y-6">

          <h2 className="text-xl font-bold text-slate-200">
            {editingMed ? "✏️ Edit Medicine" : "➕ New Medicine"}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Medicine Name
              </label>

              <input
                value={formData.medicineName}
                onChange={(e) =>
                  setFormData({ ...formData, medicineName: e.target.value })
                }
                className="input-field"
                placeholder="e.g., Aspirin"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Dosage
              </label>

              <input
                value={formData.dosage}
                onChange={(e) =>
                  setFormData({ ...formData, dosage: e.target.value })
                }
                className="input-field"
                placeholder="e.g., 500mg"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Schedule Times
              </label>

              <input
                value={formData.scheduleTimes}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    scheduleTimes: e.target.value,
                  })
                }
                className="input-field"
                placeholder="e.g., 08:00, 14:00, 20:00"
                required
              />

              <p className="text-xs text-slate-500 mt-1">
                Comma-separated, 24h format
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Instructions
              </label>

              <input
                value={formData.instructions}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    instructions: e.target.value,
                  })
                }
                className="input-field"
                placeholder="e.g., Take after meals"
              />
            </div>
          </div>

          <button type="submit" className="btn-success px-6 py-3">
            {editingMed ? "💾 Update Medicine" : "✅ Add Medicine"}
          </button>
        </form>
      )}

      {/* Medicines List */}
      {loading ? (
        <div className="text-center text-slate-400 py-16">
          Loading medicines...
        </div>
      ) : medicines.length === 0 ? (
        <div className="glass-card p-16 text-center min-h-[240px] flex flex-col justify-center">

          <span className="text-6xl block mb-5">📭</span>

          <p className="text-slate-400 text-lg">
            No medicines added yet
          </p>

          <p className="text-slate-500 text-sm mt-2">
            Click "Add Medicine" to create one
          </p>

        </div>
      ) : (
        <div className="space-y-6">

          {medicines.map((med) => (
            <div
              key={med._id}
              className="glass-card p-7 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
            >

              <div className="flex-1">

                <div className="flex items-center gap-4 mb-3">
                  <h3 className="text-xl font-bold text-slate-100">
                    {med.medicineName}
                  </h3>

                  <span className="badge badge-info">
                    {med.dosage}
                  </span>
                </div>

                <div className="flex flex-wrap gap-3 mb-2">
                  {med.scheduleTimes.map((t, i) => (
                    <span
                      key={i}
                      className="bg-indigo-500/10 text-indigo-300 px-4 py-1 rounded-lg text-xs font-medium"
                    >
                      🕐 {t}
                    </span>
                  ))}
                </div>

                {med.instructions && (
                  <p className="text-xs text-slate-500 italic">
                    📝 {med.instructions}
                  </p>
                )}
              </div>

              <div className="flex gap-3">

                <button
                  onClick={() => handleEdit(med)}
                  className="btn-outline text-xs py-2 px-4"
                >
                  ✏️ Edit
                </button>

                <button
                  onClick={() => handleDelete(med._id)}
                  className="btn-danger text-xs py-2 px-4"
                >
                  🗑️ Delete
                </button>

              </div>

            </div>
          ))}

        </div>
      )}
    </div>
  </Layout>
);
}

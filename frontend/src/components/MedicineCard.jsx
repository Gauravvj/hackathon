import api from '../services/api';

/**
 * MedicineCard component.
 * Displays a single medicine with its schedule and provides
 * a confirm button for logging intake.
 */
export default function MedicineCard({ medicine, patientId, onLogged }) {
  const handleConfirm = async (method = 'manual') => {
    try {
      const res = await api.post('/logs', {
        patientId,
        medicineId: medicine._id,
        confirmationMethod: method,
      });

      if (res.data.isDuplicate) {
        alert(res.data.message);
      } else {
        onLogged?.(res.data);
      }
    } catch (err) {
      if (err.response?.status === 409) {
        alert(err.response.data.message);
      } else {
        alert('Failed to log medicine');
      }
    }
  };

  // Check if any schedule time is near the current time (±30 min)
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const isUpcoming = medicine.scheduleTimes?.some(time => {
    const [h, m] = time.split(':').map(Number);
    const scheduleMinutes = h * 60 + m;
    const diff = scheduleMinutes - currentMinutes;
    return diff >= -30 && diff <= 30;
  });

  return (
    <div className={`glass-card p-5 animate-fade-in ${isUpcoming ? 'reminder-pulse border-indigo-500/40' : ''}`}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-lg font-bold text-slate-100">{medicine.medicineName}</h3>
          <p className="text-sm text-slate-400">{medicine.dosage}</p>
        </div>
        {isUpcoming && (
          <span className="badge badge-warning">⏰ Due Now</span>
        )}
      </div>

      {/* Schedule Times */}
      <div className="flex flex-wrap gap-2 mb-3">
        {medicine.scheduleTimes?.map((time, i) => (
          <span key={i} className="bg-indigo-500/10 text-indigo-300 px-3 py-1 rounded-lg text-xs font-medium">
            🕐 {time}
          </span>
        ))}
      </div>

      {/* Instructions */}
      {medicine.instructions && (
        <p className="text-xs text-slate-500 mb-4 italic">📝 {medicine.instructions}</p>
      )}

      {/* Action Button */}
      <button
        onClick={() => handleConfirm('manual')}
        className="btn-success w-full text-sm"
      >
        ✅ I Took This Medicine
      </button>
    </div>
  );
}

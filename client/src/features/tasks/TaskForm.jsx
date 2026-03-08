import { useMemo, useRef, useState } from "react";
import tasksApi from "./tasksApi";
import { toast } from "../../ui/Toast";
import CalendarPicker from "../../ui/CalendarPicker";

function pad(n) { return String(n).padStart(2, "0"); }
function todayYMD() {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}
function nowHM() {
  const d = new Date();
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
function toISO(dateStr, timeStr) {
  const dt = new Date(`${dateStr}T${timeStr}`);
  return isNaN(dt.getTime()) ? null : dt.toISOString();
}
function isoToDateHM(iso) {
  if (!iso) return { date: '', time: '' };
  const d = new Date(iso);
  if (isNaN(d.getTime())) return { date: '', time: '' };
  const date = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const time = `${pad(d.getHours())}:${pad(d.getMinutes())}`;
  return { date, time };
}

export default function TaskForm({ onSubmit, onCancel, initialData, isEditing }) {
  const deadlineInit = isoToDateHM(initialData?.deadline);
  const alarmInit = isoToDateHM(initialData?.alarmTime);

  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    description: initialData?.description || "",
    priority: initialData?.priority || "medium",
    deadlineDate: deadlineInit.date,
    deadlineTime: deadlineInit.time,
    alarmDate: alarmInit.date,
    alarmTime: alarmInit.time,
    alarmDurationMinutes: initialData?.alarmDurationMinutes || 5,
    customAlarmUrl: initialData?.customAlarmUrl || "",
  });

  const [uploadingAlarm, setUploadingAlarm] = useState(false);
  const [uploadedAlarmName, setUploadedAlarmName] = useState(
    initialData?.customAlarmUrl ? '(existing custom alarm)' : ''
  );
  const deadlineTimeRef = useRef(null);
  const alarmTimeRef = useRef(null);
  const [deadlineQuickMsg, setDeadlineQuickMsg] = useState('');
  const [alarmQuickMsg, setAlarmQuickMsg] = useState('');

  const minDate = useMemo(() => todayYMD(), []);
  const minTimeToday = useMemo(() => nowHM(), []);

  const handleDeadlineDateChange = (value) => {
    setFormData(p => ({ ...p, deadlineDate: value }));
    setTimeout(() => deadlineTimeRef.current?.focus(), 0);
  };
  const handleAlarmDateChange = (value) => {
    setFormData(p => ({ ...p, alarmDate: value }));
    setTimeout(() => alarmTimeRef.current?.focus(), 0);
  };
  const setDeadlineToday = () => {
    setFormData(p => ({ ...p, deadlineDate: todayYMD() }));
    setTimeout(() => deadlineTimeRef.current?.focus(), 0);
  };
  const setDeadlineEndOfDay = () => {
    if (!formData.deadlineDate) { setDeadlineQuickMsg('Set date first'); return; }
    setDeadlineQuickMsg('');
    setFormData(p => ({ ...p, deadlineTime: '23:59' }));
  };
  const setAlarmToday = () => {
    setFormData(p => ({ ...p, alarmDate: todayYMD() }));
    setTimeout(() => alarmTimeRef.current?.focus(), 0);
  };
  const setAlarmAutoTwoHoursBeforeDeadline = () => {
    if (!formData.deadlineTime) { setAlarmQuickMsg('Set deadline time first'); return; }
    setAlarmQuickMsg('');
    const [hh, mm] = formData.deadlineTime.split(':').map(Number);
    if (Number.isNaN(hh) || Number.isNaN(mm)) { setAlarmQuickMsg('Invalid deadline time'); return; }
    const total = (hh * 60 + mm - 120 + 24 * 60) % (24 * 60);
    const outH = Math.floor(total / 60);
    const outM = total % 60;
    setFormData(p => ({ ...p, alarmTime: `${pad(outH)}:${pad(outM)}` }));
  };

  const handleAlarmFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingAlarm(true);
    try {
      const result = await tasksApi.uploadAlarm(file);
      setFormData(p => ({ ...p, customAlarmUrl: result.url }));
      setUploadedAlarmName(result.originalName);
      toast.success('🎵 Custom alarm uploaded!');
    } catch (err) {
      toast.error('Failed to upload alarm sound');
    } finally {
      setUploadingAlarm(false);
    }
  };

  const clearCustomAlarm = () => {
    setFormData(p => ({ ...p, customAlarmUrl: '' }));
    setUploadedAlarmName('');
  };

  const deadlineMinTime = formData.deadlineDate === minDate ? minTimeToday : undefined;
  const alarmMinTime = formData.alarmDate === minDate ? minTimeToday : undefined;
  const hasAlarmTime = formData.alarmDate && formData.alarmTime;

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      title: formData.title.trim(),
      description: formData.description,
      priority: formData.priority,
      alarmDurationMinutes: Number(formData.alarmDurationMinutes) || 5,
    };
    if (formData.deadlineDate && formData.deadlineTime) {
      const iso = toISO(formData.deadlineDate, formData.deadlineTime);
      if (iso) data.deadline = iso;
    } else if (isEditing) {
      data.deadline = null;
    }
    if (formData.alarmDate && formData.alarmTime) {
      const iso = toISO(formData.alarmDate, formData.alarmTime);
      if (iso) data.alarmTime = iso;
    } else if (isEditing) {
      data.alarmTime = null;
    }
    if (formData.customAlarmUrl) {
      data.customAlarmUrl = formData.customAlarmUrl;
    } else if (isEditing) {
      data.customAlarmUrl = null;
    }
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit} className="task-form">
      <div className="form-group">
        <label>Task Title *</label>
        <input
          type="text"
          value={formData.title}
          onChange={e => setFormData({ ...formData, title: e.target.value })}
          placeholder="What must be done...?"
          required
        />
      </div>

      <div className="form-group">
        <label>Description</label>
        <textarea
          value={formData.description}
          onChange={e => setFormData({ ...formData, description: e.target.value })}
          rows="3"
          placeholder="Elaborate on this mission..."
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Priority</label>
          <select
            value={formData.priority}
            onChange={e => setFormData({ ...formData, priority: e.target.value })}
            className={`priority-select priority-select--${formData.priority}`}
          >
            <option value="low">🌿 Low</option>
            <option value="medium">⚡ Medium</option>
            <option value="high">🔥 High</option>
          </select>
        </div>

        <div className="form-group">
          <label>Deadline</label>
          <CalendarPicker
            value={formData.deadlineDate}
            onChange={handleDeadlineDateChange}
            minDate={minDate}
            placeholder="Pick deadline date"
          />
          <div style={{ marginTop: 8 }}>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <input
                ref={deadlineTimeRef}
                type="time"
                value={formData.deadlineTime}
                min={deadlineMinTime}
                step={60}
                onChange={e => { setDeadlineQuickMsg(''); setFormData({ ...formData, deadlineTime: e.target.value }); }}
                style={{ flex: 1 }}
              />
              <button type="button" className="btn btn-secondary btn-small" onClick={setDeadlineEndOfDay} disabled={!formData.deadlineDate}>
                {!formData.deadlineDate ? 'Set date' : '11:59 PM'}
              </button>
            </div>
            {deadlineQuickMsg && <div style={{ marginTop: 4, color: 'var(--text-dim)', fontSize: 12 }}>{deadlineQuickMsg}</div>}
          </div>
        </div>
      </div>

      {/* Alarm Section */}
      <div className="form-group alarm-section">
        <label className="alarm-section-label">⏰ Alarm Settings</label>

        <CalendarPicker
          value={formData.alarmDate}
          onChange={handleAlarmDateChange}
          minDate={minDate}
          placeholder="Pick alarm date"
        />
        <div style={{ marginTop: 8 }}>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <input
              ref={alarmTimeRef}
              type="time"
              value={formData.alarmTime}
              min={alarmMinTime}
              step={60}
              onChange={e => { setAlarmQuickMsg(''); setFormData({ ...formData, alarmTime: e.target.value }); }}
              style={{ flex: 1 }}
            />
            <button type="button" className="btn btn-secondary btn-small" onClick={setAlarmAutoTwoHoursBeforeDeadline}>
              Auto (-2h)
            </button>
          </div>
          {alarmQuickMsg && <div style={{ marginTop: 4, color: 'var(--text-dim)', fontSize: 12 }}>{alarmQuickMsg}</div>}
        </div>

        {/* Alarm Duration — only shown when alarm time is set */}
        {hasAlarmTime && (
          <div style={{ marginTop: 12, padding: '10px 12px', background: 'rgba(139,92,246,0.1)', borderRadius: 8, border: '1px solid rgba(139,92,246,0.3)' }}>
            <label style={{ fontSize: 13, color: '#a78bfa', display: 'block', marginBottom: 6 }}>
              ⏳ Alarm ring duration: <strong style={{color: '#8b5cf6'}}>{formData.alarmDurationMinutes} minutes</strong>
            </label>
            <input
              type="range"
              min="1" max="15" step="0.5"
              value={formData.alarmDurationMinutes}
              onChange={e => setFormData({ ...formData, alarmDurationMinutes: Number(e.target.value) })}
              style={{ width: '100%', accentColor: '#8b5cf6' }}
            />
            <p style={{ fontSize: 11, color: '#64748b', marginTop: 4 }}>
              Alarm rings for this long. If you don't act → missed alarm (chaos +3). High chaos = game lockout!
            </p>
          </div>
        )}

        {/* Custom Alarm Sound */}
        <div style={{ marginTop: 12 }}>
          <label style={{ fontSize: 13, color: '#94a3b8', display: 'block', marginBottom: 6 }}>
            🎵 Custom alarm sound (optional)
          </label>
          {uploadedAlarmName ? (
            <div className="custom-alarm-preview">
              <span>🎵 {uploadedAlarmName}</span>
              <button type="button" onClick={clearCustomAlarm} className="btn btn-danger btn-small" style={{ marginLeft: 8, padding: '4px 10px', fontSize: 12 }}>
                ✕ Remove
              </button>
            </div>
          ) : (
            <label className="upload-label">
              {uploadingAlarm ? '⏳ Uploading...' : '📁 Upload audio (.mp3, .wav, .ogg)'}
              <input
                type="file"
                accept="audio/*"
                onChange={handleAlarmFileUpload}
                disabled={uploadingAlarm}
                style={{ display: 'none' }}
              />
            </label>
          )}
        </div>
      </div>

      <div className="task-form-actions">
        <button type="submit" className="btn btn-primary" style={{ width: 'auto', paddingLeft: 32, paddingRight: 32 }}>
          {isEditing ? '💾 Save Changes' : '🎭 Create Task'}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} className="btn btn-secondary">Cancel</button>
        )}
      </div>
    </form>
  );
}

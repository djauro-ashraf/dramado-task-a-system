import { useMemo, useRef, useState } from "react";

function pad(n) {
  return String(n).padStart(2, "0");
}

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

export default function TaskForm({ onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "medium",

    deadlineDate: "",
    deadlineTime: "",

    alarmDate: "",
    alarmTime: "",
  });

  const deadlineTimeRef = useRef(null);
  const alarmTimeRef = useRef(null);

  const [deadlineQuickMsg, setDeadlineQuickMsg] = useState('');
  const [alarmQuickMsg, setAlarmQuickMsg] = useState('');

  const minDate = useMemo(() => todayYMD(), []);
  const minTimeToday = useMemo(() => nowHM(), []);

  const handleDeadlineDateChange = (value) => {
    setFormData((p) => ({ ...p, deadlineDate: value }));
    setTimeout(() => deadlineTimeRef.current?.focus(), 0);
  };

  const handleAlarmDateChange = (value) => {
    setFormData((p) => ({ ...p, alarmDate: value }));
    setTimeout(() => alarmTimeRef.current?.focus(), 0);
  };

  const setDeadlineToday = () => {
    const d = todayYMD();
    setFormData((p) => ({ ...p, deadlineDate: d }));
    setTimeout(() => deadlineTimeRef.current?.focus(), 0);
  };

  const setDeadlineEndOfDay = () => {
    if (!formData.deadlineDate) {
      setDeadlineQuickMsg('Not set');
      return;
    }
    setDeadlineQuickMsg('');
    setFormData((p) => ({ ...p, deadlineTime: '23:59' }));
    setTimeout(() => deadlineTimeRef.current?.focus(), 0);
  };

  const setAlarmToday = () => {
    const d = todayYMD();
    setFormData((p) => ({ ...p, alarmDate: d }));
    setTimeout(() => alarmTimeRef.current?.focus(), 0);
  };

  const setAlarmAutoTwoHoursBeforeDeadline = () => {
    if (!formData.deadlineTime) {
      setAlarmQuickMsg('Not set');
      return;
    }
    setAlarmQuickMsg('');
    const [hh, mm] = formData.deadlineTime.split(':').map(Number);
    if (Number.isNaN(hh) || Number.isNaN(mm)) {
      setAlarmQuickMsg('Not set');
      return;
    }
    const total = (hh * 60 + mm - 120 + 24 * 60) % (24 * 60);
    const outH = Math.floor(total / 60);
    const outM = total % 60;
    setFormData((p) => ({ ...p, alarmTime: `${pad(outH)}:${pad(outM)}` }));
    setTimeout(() => alarmTimeRef.current?.focus(), 0);
  };

  const deadlineMinTime =
    formData.deadlineDate && formData.deadlineDate === minDate ? minTimeToday : undefined;

  const alarmMinTime =
    formData.alarmDate && formData.alarmDate === minDate ? minTimeToday : undefined;

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = {
      title: formData.title.trim(),
      description: formData.description,
      priority: formData.priority,
    };

    if (formData.deadlineDate && formData.deadlineTime) {
      const iso = toISO(formData.deadlineDate, formData.deadlineTime);
      if (iso) data.deadline = iso;
    }

    if (formData.alarmDate && formData.alarmTime) {
      const iso = toISO(formData.alarmDate, formData.alarmTime);
      if (iso) data.alarmTime = iso;
    }

    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit} className="task-form">
      <div className="form-group">
        <label>Task Title</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        />
      </div>

      <div className="form-group">
        <label>Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows="3"
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Priority</label>
          <select
            value={formData.priority}
            onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div className="form-group">
          <label>Deadline</label>

          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <input
              type="date"
              value={formData.deadlineDate}
              min={minDate}
              onChange={(e) => handleDeadlineDateChange(e.target.value)}
              style={{ flex: 1 }}
            />
            <button type="button" className="btn btn-secondary" onClick={setDeadlineToday}>
              Today
            </button>
          </div>

          <div style={{ marginTop: 8 }}>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <input
                ref={deadlineTimeRef}
                type="time"
                value={formData.deadlineTime}
                min={deadlineMinTime}
                step={60}
                onChange={(e) => {
                  setDeadlineQuickMsg('');
                  setFormData({ ...formData, deadlineTime: e.target.value });
                }}
                style={{ flex: 1 }}
              />
              <button
                type="button"
                className="btn btn-secondary"
                onClick={setDeadlineEndOfDay}
                disabled={!formData.deadlineDate}
                title={!formData.deadlineDate ? 'Deadline date not set' : 'Set 11:59 PM'}
              >
                {!formData.deadlineDate ? 'Not set' : '11:59 PM'}
              </button>
            </div>
            {deadlineQuickMsg && (
              <div style={{ marginTop: 6, color: 'var(--text-dim)', fontSize: 12 }}>
                {deadlineQuickMsg}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="form-group">
        <label>Alarm Time (optional)</label>

        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <input
            type="date"
            value={formData.alarmDate}
            min={minDate}
            onChange={(e) => handleAlarmDateChange(e.target.value)}
            style={{ flex: 1 }}
          />
          <button type="button" className="btn btn-secondary" onClick={setAlarmToday}>
            Today
          </button>
        </div>

        <div style={{ marginTop: 8 }}>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <input
              ref={alarmTimeRef}
              type="time"
              value={formData.alarmTime}
              min={alarmMinTime}
              step={60}
              onChange={(e) => {
                setAlarmQuickMsg('');
                setFormData({ ...formData, alarmTime: e.target.value });
              }}
              style={{ flex: 1 }}
            />
            <button
              type="button"
              className="btn btn-secondary"
              onClick={setAlarmAutoTwoHoursBeforeDeadline}
              title={!formData.deadlineTime ? 'Deadline time not set' : 'Set to 2 hours before deadline time'}
            >
              {!formData.deadlineTime ? 'Not set' : 'Auto (-2h)'}
            </button>
          </div>
          {alarmQuickMsg && (
            <div style={{ marginTop: 6, color: 'var(--text-dim)', fontSize: 12 }}>
              {alarmQuickMsg}
            </div>
          )}
        </div>
      </div>

      <div className="task-actions">
        <button type="submit" className="btn btn-primary">🎭 Create Task</button>
        {onCancel && (
          <button type="button" onClick={onCancel} className="btn btn-secondary">
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

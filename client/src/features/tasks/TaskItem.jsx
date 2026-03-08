import { useState } from 'react';
import TaskForm from './TaskForm';

const PRIORITY_CONFIG = {
  high: { label: 'HIGH', bg: '#ef4444', glow: 'rgba(239,68,68,0.3)', icon: '🔥' },
  medium: { label: 'MEDIUM', bg: '#f59e0b', glow: 'rgba(245,158,11,0.3)', icon: '⚡' },
  low: { label: 'LOW', bg: '#10b981', glow: 'rgba(16,185,129,0.25)', icon: '🌿' },
};

const STATUS_CONFIG = {
  todo: { label: 'TO DO', color: '#8b5cf6', bg: 'rgba(139,92,246,0.15)' },
  done: { label: 'DONE', color: '#10b981', bg: 'rgba(16,185,129,0.15)' },
  overdue: { label: 'OVERDUE', color: '#ef4444', bg: 'rgba(239,68,68,0.2)' },
};

const formatDate = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleString(undefined, {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
};

const isOverdue = (task) => {
  if (task.status === 'done') return false;
  if (!task.deadline) return false;
  return new Date() > new Date(task.deadline);
};

export default function TaskItem({ task, onComplete, onDelete, onEdit }) {
  const [editing, setEditing] = useState(false);

  const p = PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG.medium;
  const s = STATUS_CONFIG[task.status] || STATUS_CONFIG.todo;
  const overdue = isOverdue(task);

  const handleEdit = async (formData) => {
    await onEdit(task._id, formData);
    setEditing(false);
  };

  if (editing) {
    return (
      <div className="task-item task-item--editing" style={{ borderColor: p.bg }}>
        <div style={{ marginBottom: 12, fontWeight: 'bold', color: '#94a3b8', fontSize: 13 }}>
          ✏️ EDITING: {task.title}
        </div>
        <TaskForm
          initialData={task}
          onSubmit={handleEdit}
          onCancel={() => setEditing(false)}
          isEditing
        />
      </div>
    );
  }

  return (
    <div
      className={`task-item task-item--${task.priority} task-item--${task.status} ${overdue ? 'task-item--overdue-blink' : ''}`}
      style={{
        borderLeftColor: p.bg,
        boxShadow: `0 0 16px ${p.glow}, 0 2px 8px rgba(0,0,0,0.4)`,
      }}
    >
      {/* Priority stripe */}
      <div className="task-priority-stripe" style={{ background: p.bg }}>
        <span className="task-priority-stripe-icon">{p.icon}</span>
        <span className="task-priority-stripe-label">{p.label}</span>
      </div>

      <div className="task-body">
        <div className="task-header-row">
          <h3 className={`task-title-text ${task.status === 'done' ? 'task-done-title' : ''}`}>
            {task.title}
          </h3>
          <span className="task-status-badge" style={{ color: s.color, background: s.bg }}>
            {s.label}
          </span>
        </div>

        {task.description && (
          <p className="task-desc-text">{task.description}</p>
        )}

        <div className="task-meta-row">
          {task.deadline && (
            <span className={`task-meta-chip ${overdue ? 'task-meta-chip--overdue' : ''}`}>
              📅 {overdue ? '⚠️ OVERDUE' : 'Deadline'}: {formatDate(task.deadline)}
            </span>
          )}
          {task.alarmTime && (
            <span className="task-meta-chip task-meta-chip--alarm">
              ⏰ Alarm: {formatDate(task.alarmTime)}
              {task.alarmDurationMinutes && ` (${task.alarmDurationMinutes}min window)`}
            </span>
          )}
          {task.missedAlarmCount > 0 && (
            <span className="task-meta-chip task-meta-chip--missed">
              🚨 {task.missedAlarmCount}x missed
            </span>
          )}
          {task.customAlarmUrl && (
            <span className="task-meta-chip task-meta-chip--custom">
              🎵 Custom alarm
            </span>
          )}
        </div>

        <div className="task-actions-row">
          {task.status !== 'done' && (
            <button onClick={() => onComplete(task._id)} className="task-btn task-btn--complete">
              ✅ Complete
            </button>
          )}
          {task.status !== 'done' && (
            <button onClick={() => setEditing(true)} className="task-btn task-btn--edit">
              ✏️ Edit
            </button>
          )}
          <button onClick={() => onDelete(task._id)} className="task-btn task-btn--delete">
            🗑️ Delete
          </button>
        </div>
      </div>
    </div>
  );
}

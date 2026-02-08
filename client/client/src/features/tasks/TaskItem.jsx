export default function TaskItem({ task, onComplete, onDelete }) {
  const formatDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleString();
  };

  return (
    <div className={`task-item priority-${task.priority} ${task.status}`}>
      <div className="task-header">
        <h3 className="task-title">{task.title}</h3>
        <span className={`task-priority priority-${task.priority}`}>{task.priority}</span>
      </div>
      {task.description && <p className="task-description">{task.description}</p>}
      <div className="task-meta">
        {task.deadline && <span>📅 Deadline: {formatDate(task.deadline)}</span>}
        {task.alarmTime && <span>⏰ Alarm: {formatDate(task.alarmTime)}</span>}
        <span>Status: {task.status}</span>
      </div>
      <div className="task-actions">
        {task.status !== 'done' && (
          <button onClick={() => onComplete(task._id)} className="btn btn-success btn-small">
            ✅ Complete
          </button>
        )}
        <button onClick={() => onDelete(task._id)} className="btn btn-danger btn-small">
          🗑️ Delete
        </button>
      </div>
    </div>
  );
}
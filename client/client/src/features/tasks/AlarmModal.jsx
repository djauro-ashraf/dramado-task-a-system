import Modal from '../../ui/Modal';

export default function AlarmModal({ task, onComplete, onSnooze, onIgnore }) {
  if (!task) return null;

  const snoozeDurations = [5, 10, 15, 30];

  return (
    <Modal isOpen={!!task} onClose={() => {}}>
      <div className="alarm-modal">
        <h1 className="alarm-title">🚨 ALARM! 🚨</h1>
        <h2 className="alarm-task-title">{task.title}</h2>
        <p>{task.description || 'No description'}</p>
        <p style={{marginTop: '10px', color: 'var(--text-dim)'}}>
          Priority: <strong style={{color: 'var(--danger)'}}>{task.priority.toUpperCase()}</strong>
        </p>
        <div style={{marginTop: '20px'}}>
          <p style={{marginBottom: '10px', fontWeight: 'bold'}}>Snooze for:</p>
          <div className="snooze-options">
            {snoozeDurations.map(min => (
              <button key={min} onClick={() => onSnooze(task._id, min)} className="btn btn-secondary btn-small">
                {min}m
              </button>
            ))}
          </div>
        </div>
        <div className="modal-actions" style={{marginTop: '20px'}}>
          <button onClick={() => onComplete(task._id)} className="btn btn-success">
            ✅ Complete Now
          </button>
          <button onClick={() => onIgnore(task._id)} className="btn btn-danger">
            🙈 Ignore
          </button>
        </div>
      </div>
    </Modal>
  );
}
import { useState } from 'react';

export default function TaskForm({ onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    deadline: '',
    alarmTime: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = { ...formData };
    if (data.deadline) data.deadline = new Date(data.deadline).toISOString();
    if (data.alarmTime) data.alarmTime = new Date(data.alarmTime).toISOString();
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit} className="task-form">
      <div className="form-group">
        <label>Task Title</label>
        <input type="text" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} required />
      </div>
      <div className="form-group">
        <label>Description</label>
        <textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} rows="3" />
      </div>
      <div className="form-row">
        <div className="form-group">
          <label>Priority</label>
          <select value={formData.priority} onChange={(e) => setFormData({...formData, priority: e.target.value})}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
        <div className="form-group">
          <label>Deadline</label>
          <input type="datetime-local" value={formData.deadline} onChange={(e) => setFormData({...formData, deadline: e.target.value})} />
        </div>
      </div>
      <div className="form-group">
        <label>Alarm Time (optional)</label>
        <input type="datetime-local" value={formData.alarmTime} onChange={(e) => setFormData({...formData, alarmTime: e.target.value})} />
      </div>
      <div className="task-actions">
        <button type="submit" className="btn btn-primary">🎭 Create Task</button>
        {onCancel && <button type="button" onClick={onCancel} className="btn btn-secondary">Cancel</button>}
      </div>
    </form>
  );
}
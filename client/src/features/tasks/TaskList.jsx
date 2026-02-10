import TaskItem from './TaskItem';

export default function TaskList({ tasks, onComplete, onDelete }) {
  if (tasks.length === 0) {
    return <p style={{textAlign: 'center', color: 'var(--text-dim)'}}>No tasks yet. Create one to begin the drama!</p>;
  }

  return (
    <div className="task-list">
      {tasks.map(task => (
        <TaskItem key={task._id} task={task} onComplete={onComplete} onDelete={onDelete} />
      ))}
    </div>
  );
}
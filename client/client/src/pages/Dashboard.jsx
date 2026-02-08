import { useState, useEffect } from 'react';
import { useAuth } from '../auth/AuthContext';
import Navbar from '../ui/Navbar';
import TaskForm from '../features/tasks/TaskForm';
import TaskList from '../features/tasks/TaskList';
import AlarmModal from '../features/tasks/AlarmModal';
import ActivityTimeline from '../features/activity/ActivityTimeline';
import tasksApi from '../features/tasks/tasksApi';
import useAlarmEngine from '../features/tasks/useAlarmEngine';
import { toast } from '../ui/Toast';

export default function Dashboard() {
  const { user, updateUser } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [alarmTask, setAlarmTask] = useState(null);
  
  const { audioEnabled, enableAudio } = useAlarmEngine(tasks, (task) => {
    setAlarmTask(task);
  });

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const data = await tasksApi.getTasks();
      setTasks(data);
    } catch (error) {
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (taskData) => {
    try {
      await tasksApi.createTask(taskData);
      toast.success('🎭 Task created! The drama begins!');
      setShowForm(false);
      loadTasks();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create task');
    }
  };

  const handleCompleteTask = async (id) => {
    try {
      const { user: updatedUser } = await tasksApi.completeTask(id);
      updateUser(updatedUser);
      toast.success('✅ Task completed!');
      setAlarmTask(null);
      loadTasks();
    } catch (error) {
      toast.error('Failed to complete task');
    }
  };

  const handleSnoozeTask = async (id, minutes) => {
    try {
      const { user: updatedUser } = await tasksApi.snoozeTask(id, minutes);
      updateUser(updatedUser);
      toast.success(`⏰ Snoozed for ${minutes} minutes`);
      setAlarmTask(null);
      loadTasks();
    } catch (error) {
      toast.error('Failed to snooze task');
    }
  };

  const handleIgnoreTask = async (id) => {
    try {
      const { user: updatedUser } = await tasksApi.ignoreTask(id);
      updateUser(updatedUser);
      toast.success('🙈 Task ignored!');
      setAlarmTask(null);
      loadTasks();
    } catch (error) {
      toast.error('Failed to ignore task');
    }
  };

  const handleDeleteTask = async (id) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await tasksApi.deleteTask(id);
      toast.success('🗑️ Task deleted!');
      loadTasks();
    } catch (error) {
      toast.error('Failed to delete task');
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  const todoTasks = tasks.filter(t => t.status === 'todo');
  const doneTasks = tasks.filter(t => t.status === 'done');

  return (
    <>
      <Navbar />
      <div className="dashboard">
        <div className="container">
          <div className="dashboard-header">
            <h1 className="dashboard-title">🎭 Your Dramatic Dashboard</h1>
            <p style={{color: 'var(--text-dim)', marginBottom: '20px'}}>
              Welcome back, {user.name}! Ready for some drama?
            </p>
            {!audioEnabled && (
              <button onClick={enableAudio} className="btn btn-primary">
                🔊 Enable Dramatic Alarms
              </button>
            )}
          </div>

          <div className="dashboard-stats">
            <div className="stat-card">
              <div className="stat-value">{user.disciplineScore}</div>
              <div className="stat-label">🎯 Discipline Score</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{user.chaosScore}</div>
              <div className="stat-label">🌪️ Chaos Score</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{todoTasks.length}</div>
              <div className="stat-label">📋 Active Tasks</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{doneTasks.length}</div>
              <div className="stat-label">✅ Completed</div>
            </div>
          </div>

          <div className="tasks-section">
            <div className="section-header">
              <h2>📋 Tasks</h2>
              <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
                {showForm ? '❌ Cancel' : '➕ New Task'}
              </button>
            </div>
            {showForm && <TaskForm onSubmit={handleCreateTask} onCancel={() => setShowForm(false)} />}
            <TaskList tasks={todoTasks} onComplete={handleCompleteTask} onDelete={handleDeleteTask} />
            {doneTasks.length > 0 && (
              <>
                <h3 style={{marginTop: '30px', marginBottom: '15px'}}>✅ Completed Tasks</h3>
                <TaskList tasks={doneTasks} onComplete={handleCompleteTask} onDelete={handleDeleteTask} />
              </>
            )}
          </div>

          <ActivityTimeline />
        </div>
      </div>

      <AlarmModal
        task={alarmTask}
        onComplete={handleCompleteTask}
        onSnooze={handleSnoozeTask}
        onIgnore={handleIgnoreTask}
      />
    </>
  );
}
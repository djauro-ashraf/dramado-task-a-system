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

function DramaBanner({ message }) {
  if (!message) return null;
  return (
    <div className="drama-banner" role="status" aria-live="polite">
      {message}
    </div>
  );
}

export default function Dashboard() {
  const { user, updateUser } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [alarmTask, setAlarmTask] = useState(null);
  const [activityRefresh, setActivityRefresh] = useState(0);
  const [dramaMessage, setDramaMessage] = useState('');
  
  const { audioEnabled, enableAudio, resetFired } = useAlarmEngine(tasks, (task) => {
    setAlarmTask(task);
  });

  const flashDrama = (msg) => {
    if (!msg) return;
    setDramaMessage(msg);
    window.clearTimeout(flashDrama._t);
    flashDrama._t = window.setTimeout(() => setDramaMessage(''), 2200);
  };

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
      const res = await tasksApi.createTask(taskData);
      toast.success(res.message || '🎭 Task created!');
      flashDrama(res.message);
      setShowForm(false);
      loadTasks();
      setActivityRefresh((x) => x + 1);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create task');
    }
  };

  const handleCompleteTask = async (id) => {
    try {
      const res = await tasksApi.completeTask(id);
      const { user: updatedUser } = res;
      updateUser(updatedUser);
      toast.success(res.message || '✅ Task completed!');
      flashDrama(res.message);
      resetFired(id);
      setAlarmTask(null);
      loadTasks();
      setActivityRefresh((x) => x + 1);
    } catch (error) {
      toast.error('Failed to complete task');
    }
  };

  const handleSnoozeTask = async (id, minutes) => {
    try {
      const res = await tasksApi.snoozeTask(id, minutes);
      const { user: updatedUser } = res;
      updateUser(updatedUser);
      toast.success(res.message || `⏰ Snoozed`);
      flashDrama(res.message);
      resetFired(id);
      setAlarmTask(null);
      loadTasks();
      setActivityRefresh((x) => x + 1);
    } catch (error) {
      toast.error('Failed to snooze task');
    }
  };

  const handleIgnoreTask = async (id) => {
    try {
      const res = await tasksApi.ignoreTask(id);
      const { user: updatedUser } = res;
      updateUser(updatedUser);
      toast.success(res.message || '🙈 Task ignored!');
      flashDrama(res.message);
      resetFired(id);
      setAlarmTask(null);
      loadTasks();
      setActivityRefresh((x) => x + 1);
    } catch (error) {
      toast.error('Failed to ignore task');
    }
  };

  const handleDeleteTask = async (id) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      const res = await tasksApi.deleteTask(id);
      toast.success(res?.message || '🗑️ Task deleted!');
      flashDrama(res?.message);
      resetFired(id);
      loadTasks();
      setActivityRefresh((x) => x + 1);
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
      <DramaBanner message={dramaMessage} />
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

          <ActivityTimeline refreshToken={activityRefresh} />
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
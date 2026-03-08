import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../auth/AuthContext';
import Navbar from '../ui/Navbar';
import TaskForm from '../features/tasks/TaskForm';
import TaskList from '../features/tasks/TaskList';
import AlarmModal from '../features/tasks/AlarmModal';
import ActivityTimeline from '../features/activity/ActivityTimeline';
import tasksApi from '../features/tasks/tasksApi';
import activityApi from '../features/activity/activityApi';
import useAlarmEngine from '../features/tasks/useAlarmEngine';
import usePushNotifications from '../features/tasks/usePushNotifications';
import { toast } from '../ui/Toast';

// ─── DRAMA BANNER ────────────────────────────────────────────────────────────
function DramaBanner({ message }) {
  if (!message) return null;
  return (
    <div className="drama-banner" role="status" aria-live="polite">
      {message}
    </div>
  );
}

// ─── ACTIVITY LOG HELPERS ─────────────────────────────────────────────────────
const TYPE_META = {
  COMPLETED:       { icon: '✅', label: 'Completed',      color: '#10b981' },
  SNOOZED:         { icon: '😴', label: 'Snoozed',        color: '#f59e0b' },
  IGNORED:         { icon: '🙈', label: 'Ignored alarm',  color: '#ef4444' },
  MISSED_DEADLINE: { icon: '💀', label: 'Missed deadline',color: '#ef4444' },
  MISSED_ALARM:    { icon: '🚨', label: 'Missed alarm',   color: '#ef4444' },
  CREATED_TASK:    { icon: '📋', label: 'Created task',   color: '#8b5cf6' },
  UPDATED_TASK:    { icon: '✏️', label: 'Updated task',   color: '#6366f1' },
  DELETED_TASK:    { icon: '🗑️', label: 'Deleted task',   color: '#64748b' },
  UPLOAD_SOUND:    { icon: '🎵', label: 'Uploaded sound', color: '#06b6d4' },
  LOGIN:           { icon: '🔑', label: 'Logged in',      color: '#94a3b8' },
};

function fmtDate(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleString(undefined, {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
}

function humanLog(activity) {
  const m = TYPE_META[activity.type] || { icon: '📌', label: activity.type, color: '#94a3b8' };
  const taskName = activity.taskId?.title ? `"${activity.taskId.title}"` : null;
  const date = fmtDate(activity.createdAt);

  switch (activity.type) {
    case 'COMPLETED':
      return { icon: m.icon, color: m.color,
        text: `${taskName ? `Completed ${taskName}` : 'Completed a task'} on ${date}` };
    case 'SNOOZED':
      return { icon: m.icon, color: m.color,
        text: `Snoozed ${taskName || 'a task'}${activity.meta?.minutes ? ` for ${activity.meta.minutes}m` : ''} on ${date}` };
    case 'IGNORED':
      return { icon: m.icon, color: m.color,
        text: `Ignored alarm for ${taskName || 'a task'} on ${date}` };
    case 'MISSED_DEADLINE':
      return { icon: m.icon, color: m.color,
        text: `Missed deadline for ${taskName || 'a task'}${activity.meta?.hoursOverdue ? ` (${activity.meta.hoursOverdue}h overdue)` : ''} on ${date}` };
    case 'MISSED_ALARM':
      return { icon: m.icon, color: m.color,
        text: `Missed alarm for ${taskName || 'a task'} on ${date}` };
    case 'CREATED_TASK':
      return { icon: m.icon, color: m.color,
        text: `Created ${taskName || 'a task'} on ${date}` };
    case 'UPDATED_TASK':
      return { icon: m.icon, color: m.color,
        text: `Updated ${taskName || 'a task'} on ${date}` };
    case 'DELETED_TASK':
      return { icon: m.icon, color: m.color,
        text: `Deleted "${activity.meta?.taskTitle || 'a task'}" on ${date}` };
    default:
      return { icon: m.icon, color: m.color, text: `${m.label} on ${date}` };
  }
}

function LogList({ logs, emptyMsg }) {
  if (!logs || logs.length === 0) {
    return <p style={{ color: '#64748b', fontSize: 13, fontStyle: 'italic', padding: '8px 0' }}>{emptyMsg || 'No logs yet.'}</p>;
  }
  return (
    <div className="log-list">
      {logs.slice(0, 12).map(a => {
        const { icon, color, text } = humanLog(a);
        return (
          <div key={a._id} className="log-item">
            <span className="log-icon" style={{ color }}>{icon}</span>
            <span className="log-text">{text}</span>
          </div>
        );
      })}
    </div>
  );
}

// ─── SCORE DETAIL MODAL ───────────────────────────────────────────────────────
function ScoreDetailModal({ type, user, onClose }) {
  const [logs, setLogs] = useState([]);
  const [loadingLogs, setLoadingLogs] = useState(true);

  const net = (user?.disciplineScore || 0) - (user?.chaosScore || 0);

  useEffect(() => {
    const typeMap = {
      discipline: 'COMPLETED',
      chaos:      'SNOOZED,IGNORED,MISSED_DEADLINE,MISSED_ALARM',
      active:     'CREATED_TASK,UPDATED_TASK',
      completed:  'COMPLETED',
    };
    const t = typeMap[type];
    activityApi.getActivities(20, t).then(data => {
      setLogs(data.activities || []);
      setLoadingLogs(false);
    }).catch(() => setLoadingLogs(false));
  }, [type]);

  return (
    <div className="score-modal-overlay" onClick={onClose}>
      <div className="score-modal" onClick={e => e.stopPropagation()}>
        <button className="score-modal-close" onClick={onClose}>✕</button>

        {type === 'discipline' && (
          <>
            <div className="score-modal-icon">🎯</div>
            <h2 className="score-modal-title">Discipline Score: <span style={{color:'#8b5cf6'}}>{user.disciplineScore}</span></h2>
            <div className="score-modal-body">
              <p className="score-modal-desc">Your discipline score is earned by completing tasks. Your <strong>net score</strong> (discipline − chaos = <strong style={{color: net >= 0 ? '#10b981' : '#ef4444'}}>{net >= 0 ? '+' : ''}{net}</strong>) determines your overall state.</p>
              <div className="score-breakdown">
                <div className="score-item score-item--positive"><span>✅ Complete task on time</span><span className="score-delta">+2</span></div>
                <div className="score-item score-item--positive"><span>✅ Complete task (late)</span><span className="score-delta">+1</span></div>
              </div>
              <div className="score-insight">
                {user.disciplineScore >= 15 ? '🏆 Strong discipline. The universe is cautiously impressed.'
                  : user.disciplineScore >= 8 ? '💪 Decent. Not legendary, but not embarrassing either.'
                  : user.disciplineScore >= 3 ? '🌱 Growing. Every completion was earned. Protect them.'
                  : '😬 Starting from zero. The only direction is up. Allegedly.'}
              </div>
              <h4 style={{marginTop: 16, marginBottom: 8, color: '#94a3b8', fontSize: 13}}>📜 Recent completions:</h4>
              {loadingLogs ? <p style={{color:'#64748b',fontSize:13}}>Loading...</p> : <LogList logs={logs} emptyMsg="No completions yet. Tasks await your attention." />}
            </div>
          </>
        )}

        {type === 'chaos' && (
          <>
            <div className="score-modal-icon">🌪️</div>
            <h2 className="score-modal-title">Chaos Score: <span style={{color: user.chaosScore > 10 ? '#ef4444' : user.chaosScore > 5 ? '#f59e0b' : '#94a3b8'}}>{user.chaosScore}</span></h2>
            <div className="score-modal-body">
              <p className="score-modal-desc">Chaos accumulates from every act of avoidance. Your <strong>net score</strong> (discipline − chaos = <strong style={{color: net >= 0 ? '#10b981' : '#ef4444'}}>{net >= 0 ? '+' : ''}{net}</strong>) is what matters. If net ≤ −10, alarms enter <strong style={{color:'#ef4444'}}>GAME LOCKOUT</strong> mode.</p>
              <div className="score-breakdown">
                <div className="score-item score-item--negative"><span>😴 Snooze alarm</span><span className="score-delta">+1</span></div>
                <div className="score-item score-item--negative"><span>🙈 Ignore alarm</span><span className="score-delta">+2</span></div>
                <div className="score-item score-item--negative"><span>💀 Miss deadline</span><span className="score-delta">+3</span></div>
                <div className="score-item score-item--negative"><span>🚨 Missed alarm window</span><span className="score-delta">+3</span></div>
              </div>
              {net <= -10 && (
                <div className="score-warning">⚠️ CHAOS LOCKOUT ACTIVE! Net score ≤ −10. You must win a mini-game before each alarm interaction. Complete tasks to recover.</div>
              )}
              <div className="score-insight">
                {net <= -10 ? '🔴 LOCKOUT ZONE. Mini-games are mandatory. This is the consequence of sustained avoidance.'
                  : net <= -3 ? '🟠 Struggling. A few more bad decisions away from game lockout. Consider behaving.'
                  : net <= 2 ? '🟡 Borderline. Chaos and discipline are sparring. Chaos is currently ahead on points.'
                  : '🟢 Under control. The alarm buttons remain unguarded. For now.'}
              </div>
              <h4 style={{marginTop: 16, marginBottom: 8, color: '#94a3b8', fontSize: 13}}>📜 Recent chaos events:</h4>
              {loadingLogs ? <p style={{color:'#64748b',fontSize:13}}>Loading...</p> : <LogList logs={logs} emptyMsg="No chaos events recorded. Suspicious." />}
            </div>
          </>
        )}

        {type === 'active' && (
          <>
            <div className="score-modal-icon">📋</div>
            <h2 className="score-modal-title">Active Tasks</h2>
            <div className="score-modal-body">
              <p className="score-modal-desc">Tasks with <strong>todo</strong> or <strong>overdue</strong> status. They exist. They wait. They judge silently.</p>
              <div className="score-breakdown">
                <div className="score-item score-item--neutral"><span>📋 todo</span><span>Pending your attention</span></div>
                <div className="score-item score-item--negative"><span>⚠️ overdue</span><span>Deadline has passed</span></div>
                <div className="score-item score-item--positive"><span>✅ Complete them</span><span>+discipline, −chaos-risk</span></div>
              </div>
              <h4 style={{marginTop: 16, marginBottom: 8, color: '#94a3b8', fontSize: 13}}>📜 Recent task activity:</h4>
              {loadingLogs ? <p style={{color:'#64748b',fontSize:13}}>Loading...</p> : <LogList logs={logs} emptyMsg="No task activity yet." />}
            </div>
          </>
        )}

        {type === 'completed' && (
          <>
            <div className="score-modal-icon">✅</div>
            <h2 className="score-modal-title">Completed Tasks</h2>
            <div className="score-modal-body">
              <p className="score-modal-desc">The hall of genuine accomplishment. Each entry here represents a moment when you chose competence over avoidance. Savor it.</p>
              <div className="score-insight">
                {user.disciplineScore > 0
                  ? `${user.disciplineScore} total discipline points earned — one completion at a time. Evidence that you can, in fact, finish things.`
                  : 'No completions yet. The hall awaits its first exhibit.'}
              </div>
              <h4 style={{marginTop: 16, marginBottom: 8, color: '#94a3b8', fontSize: 13}}>📜 Completion history:</h4>
              {loadingLogs ? <p style={{color:'#64748b',fontSize:13}}>Loading...</p> : <LogList logs={logs} emptyMsg="Nothing completed yet. The hall is empty and echoing." />}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ─── MAIN DASHBOARD ──────────────────────────────────────────────────────────
export default function Dashboard() {
  const { user, updateUser } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [alarmTask, setAlarmTask] = useState(null);
  const [activityRefresh, setActivityRefresh] = useState(0);
  const [dramaMessage, setDramaMessage] = useState('');
  const [scoreModal, setScoreModal] = useState(null);

  const handleMissedAlarm = useCallback((task, message) => {
    flashDrama(message || `🚨 MISSED ALARM on "${task.title}"! Chaos +3!`);
    setAlarmTask(null);
    loadTasks();
    setActivityRefresh(x => x + 1);
  }, []);

  const handleUserUpdate = useCallback((updatedUser) => {
    updateUser(updatedUser);
  }, [updateUser]);

  const { audioEnabled, enableAudio, resetFired, primeAudioBestEffort, playAlarmNow } = useAlarmEngine(
    tasks,
    (task) => setAlarmTask(task),
    handleMissedAlarm,
    handleUserUpdate
  );

  // ── Push notifications: fires alarms even when tab is closed ─────────────
  // When user clicks a push notification and the tab is already open,
  // the SW posts a message with the taskId → we pop the alarm modal directly.
  const handlePushNotificationClick = useCallback(async (taskId) => {
    if (!taskId) return;
    const task = tasks.find(t => t._id === taskId);
    if (!task || task.status !== 'todo') return;

    const unlocked = await primeAudioBestEffort();
    setAlarmTask(task);
    if (unlocked) playAlarmNow(task);
  }, [tasks, primeAudioBestEffort, playAlarmNow]);

  const { pushStatus, enablePush, disablePush } = usePushNotifications(handlePushNotificationClick);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const taskIdFromPush = params.get('alarmTaskId');
    if (!taskIdFromPush || tasks.length === 0) return;

    handlePushNotificationClick(taskIdFromPush);

    params.delete('alarmTaskId');
    params.delete('fromPush');
    const next = `${window.location.pathname}${params.toString() ? `?${params.toString()}` : ''}${window.location.hash || ''}`;
    window.history.replaceState({}, '', next);
  }, [tasks, handlePushNotificationClick]);

  const flashDrama = (msg) => {
    if (!msg) return;
    setDramaMessage(msg);
    window.clearTimeout(flashDrama._t);
    flashDrama._t = window.setTimeout(() => setDramaMessage(''), 5000);
  };

  useEffect(() => { loadTasks(); }, []);

  const loadTasks = async () => {
    try {
      const data = await tasksApi.getTasks();
      setTasks(data);
    } catch {
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
      setActivityRefresh(x => x + 1);
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to create task');
    }
  };

  const handleEditTask = async (id, updates) => {
    try {
      const res = await tasksApi.updateTask(id, updates);
      toast.success(res.message || '✏️ Task updated!');
      flashDrama(res.message);
      loadTasks();
      setActivityRefresh(x => x + 1);
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to update task');
    }
  };

  const handleCompleteTask = async (id) => {
    try {
      const res = await tasksApi.completeTask(id);
      updateUser(res.user);
      toast.success(res.message || '✅ Task completed!');
      flashDrama(res.message);
      resetFired(id);
      setAlarmTask(null);
      loadTasks();
      setActivityRefresh(x => x + 1);
    } catch {
      toast.error('Failed to complete task');
    }
  };

  const handleSnoozeTask = async (id, minutes) => {
    try {
      const res = await tasksApi.snoozeTask(id, minutes);
      updateUser(res.user);
      toast.success(res.message || `⏰ Snoozed`);
      flashDrama(res.message);
      resetFired(id);
      setAlarmTask(null);
      loadTasks();
      setActivityRefresh(x => x + 1);
    } catch {
      toast.error('Failed to snooze task');
    }
  };

  const handleIgnoreTask = async (id) => {
    try {
      const res = await tasksApi.ignoreTask(id);
      updateUser(res.user);
      toast.success(res.message || '🙈 Task ignored!');
      flashDrama(res.message);
      resetFired(id);
      setAlarmTask(null);
      loadTasks();
      setActivityRefresh(x => x + 1);
    } catch {
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
      setActivityRefresh(x => x + 1);
    } catch {
      toast.error('Failed to delete task');
    }
  };

  if (loading) return <div className="loading">Loading your dramatic dashboard...</div>;

  const todoTasks     = tasks.filter(t => t.status === 'todo');
  const overdueTasks  = tasks.filter(t => t.status === 'overdue');
  const doneTasks     = tasks.filter(t => t.status === 'done');
  const activeTasks   = [...todoTasks, ...overdueTasks];

  const disciplineScore = user.disciplineScore || 0;
  const chaosScore      = user.chaosScore || 0;
  const net             = disciplineScore - chaosScore;
  // isChaosLocked comes from backend virtual, but also compute locally as fallback
  const isChaosLocked   = user.isChaosLocked ?? (net <= -10);

  return (
    <>
      <Navbar />
      <DramaBanner message={dramaMessage} />
      <div className="dashboard">
        <div className="container">
          <div className="dashboard-header">
            <h1 className="dashboard-title">🎭 Your Dramatic Dashboard</h1>
            <p style={{color:'var(--text-dim)', marginBottom:'20px'}}>
              Welcome back, <strong>{user.name}</strong>! Net score: <strong style={{color: net >= 0 ? '#10b981' : '#ef4444'}}>{net >= 0 ? '+' : ''}{net}</strong>
            </p>
            {!audioEnabled && (
              <>
                <button onClick={enableAudio} className="btn btn-primary" style={{width:'auto'}}>
                  🔊 Enable Dramatic Alarms
                </button>
                <p style={{color:'#94a3b8', fontSize:13, marginTop:8}}>
                  Needed once so the browser lets the app play alarm audio. Clicking a background notification will now also try to unlock audio automatically, but some browsers still require one tap inside the page first.
                </p>
              </>
            )}
            {/* Push notification toggle — shown separately from audio */}
            {pushStatus === 'idle' && (
              <button onClick={enablePush} className="btn btn-secondary" style={{width:'auto', marginTop: 8}}>
                🔔 Enable Background Alarms (when tab is closed)
              </button>
            )}
            {pushStatus === 'loading' && (
              <button className="btn btn-secondary" style={{width:'auto', marginTop: 8}} disabled>
                🔔 Enabling...
              </button>
            )}
            {pushStatus === 'granted' && (
              <button onClick={disablePush} className="btn btn-secondary" style={{width:'auto', marginTop: 8, opacity: 0.7}}>
                🔔 Background Alarms ON — click to disable
              </button>
            )}
            {pushStatus === 'denied' && (
              <p style={{color:'#ef4444', fontSize:13, marginTop:8}}>
                🔕 Notifications blocked. Enable them in your browser settings to get background alarms.
              </p>
            )}
            {pushStatus === 'unsupported' && (
              <p style={{color:'#f59e0b', fontSize:13, marginTop:8}}>
                ⚠️ This browser does not fully support push notifications for background alarms.
              </p>
            )}
            {pushStatus === 'error' && (
              <p style={{color:'#ef4444', fontSize:13, marginTop:8}}>
                ⚠️ Notifications permission may be enabled, but push setup failed. Check service worker registration, login state, backend API, and VAPID keys.
              </p>
            )}
          </div>

          {/* STAT CARDS */}
          <div className="dashboard-stats">
            <div className="stat-card stat-card--clickable" onClick={() => setScoreModal('discipline')} title="Click for details">
              <div className="stat-value stat-value--discipline">{disciplineScore}</div>
              <div className="stat-label">🎯 Discipline Score</div>
              <div className="stat-hint">Click to see logs</div>
            </div>
            <div
              className={`stat-card stat-card--clickable ${isChaosLocked ? 'stat-card--danger' : net <= -3 ? 'stat-card--warning' : ''}`}
              onClick={() => setScoreModal('chaos')} title="Click for details"
            >
              <div className={`stat-value ${isChaosLocked ? 'stat-value--danger' : net <= -3 ? 'stat-value--warning' : 'stat-value--chaos'}`}>
                {chaosScore}
              </div>
              <div className="stat-label">🌪️ Chaos Score</div>
              <div className="stat-hint">{isChaosLocked ? '🔴 LOCKOUT (net '+net+')' : `net ${net >= 0 ? '+' : ''}${net}`}</div>
            </div>
            <div className="stat-card stat-card--clickable" onClick={() => setScoreModal('active')} title="Click for details">
              <div className="stat-value">{activeTasks.length}</div>
              <div className="stat-label">📋 Active Tasks</div>
              {overdueTasks.length > 0
                ? <div className="stat-hint stat-hint--danger">⚠️ {overdueTasks.length} overdue</div>
                : <div className="stat-hint">Click to see logs</div>}
            </div>
            <div className="stat-card stat-card--clickable" onClick={() => setScoreModal('completed')} title="Click for details">
              <div className="stat-value stat-value--success">{doneTasks.length}</div>
              <div className="stat-label">✅ Completed</div>
              <div className="stat-hint">Click to see logs</div>
            </div>
          </div>

          {/* TASKS */}
          <div className="tasks-section">
            <div className="section-header">
              <h2>📋 Tasks</h2>
              <button onClick={() => setShowForm(!showForm)} className="btn btn-primary" style={{width:'auto'}}>
                {showForm ? '❌ Cancel' : '➕ New Task'}
              </button>
            </div>

            {showForm && <TaskForm onSubmit={handleCreateTask} onCancel={() => setShowForm(false)} />}

            {overdueTasks.length > 0 && (
              <>
                <h3 className="tasks-subsection-title tasks-subsection-title--danger">⚠️ Overdue Tasks</h3>
                <TaskList tasks={overdueTasks} onComplete={handleCompleteTask} onDelete={handleDeleteTask} onEdit={handleEditTask} />
              </>
            )}

            {todoTasks.length > 0 && (
              <>
                {overdueTasks.length > 0 && <h3 className="tasks-subsection-title">📋 Pending Tasks</h3>}
                <TaskList tasks={todoTasks} onComplete={handleCompleteTask} onDelete={handleDeleteTask} onEdit={handleEditTask} />
              </>
            )}

            {activeTasks.length === 0 && !showForm && (
              <div className="empty-tasks">
                <p>🎭 No active tasks. Either you're amazingly productive or dangerously idle.</p>
                <button onClick={() => setShowForm(true)} className="btn btn-primary" style={{width:'auto', marginTop:12}}>
                  ➕ Add a Task
                </button>
              </div>
            )}

            {doneTasks.length > 0 && (
              <>
                <h3 className="tasks-subsection-title tasks-subsection-title--done">✅ Completed Tasks</h3>
                <TaskList tasks={doneTasks} onComplete={handleCompleteTask} onDelete={handleDeleteTask} onEdit={handleEditTask} />
              </>
            )}
          </div>

          <ActivityTimeline refreshToken={activityRefresh} />
        </div>
      </div>

      <AlarmModal
        task={alarmTask}
        isChaosLocked={isChaosLocked}
        onComplete={handleCompleteTask}
        onSnooze={handleSnoozeTask}
        onIgnore={handleIgnoreTask}
        enableAudio={enableAudio}
        playAlarmNow={playAlarmNow}
      />

      {scoreModal && (
        <ScoreDetailModal
          type={scoreModal}
          user={user}
          onClose={() => setScoreModal(null)}
        />
      )}
    </>
  );
}

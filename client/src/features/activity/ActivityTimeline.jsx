import { useState, useEffect } from 'react';
import activityApi from './activityApi';

export default function ActivityTimeline({ refreshToken = 0 }) {
  const [activities, setActivities] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadActivities();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshToken]);

  const loadActivities = async () => {
    try {
      const data = await activityApi.getActivities(20);
      setActivities(data.activities);
      setStats(data.stats);
    } catch (error) {
      console.error('Failed to load activities:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (date) => {
    const d = new Date(date);
    return d.toLocaleString();
  };

  if (loading) return <div>Loading activities...</div>;

  return (
    <div className="activity-timeline">
      <h2 style={{marginBottom: '20px'}}>📜 Activity Timeline</h2>
      {stats && (
        <div className="dashboard-stats" style={{marginBottom: '20px'}}>
          <div className="stat-card">
            <div className="stat-value">{stats.tasksCompleted}</div>
            <div className="stat-label">Completed</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.tasksSnoozed}</div>
            <div className="stat-label">Snoozed</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{(stats.tasksIgnored || 0) + (stats.missedDeadlines || 0)}</div>
            <div className="stat-label">Missed</div>
          </div>
        </div>
      )}
      {activities.length === 0 ? (
        <p style={{textAlign: 'center', color: 'var(--text-dim)'}}>No activity yet. Start creating tasks!</p>
      ) : (
        activities.map(activity => (
          <div key={activity._id} className="activity-item">
            <div className="activity-message">{activity.message}</div>
            <div className="activity-time">{formatTime(activity.createdAt)}</div>
          </div>
        ))
      )}
    </div>
  );
}
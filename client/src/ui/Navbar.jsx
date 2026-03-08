import { useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import MoodBadge from '../features/mood/MoodBadge';
import activityApi from '../features/activity/activityApi';
import { useEffect } from 'react';

function fmtDate(iso) {
  if (!iso) return '';
  return new Date(iso).toLocaleString(undefined, {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
}

function humanLog(a) {
  const taskName = a.taskId?.title ? `"${a.taskId.title}"` : 'a task';
  switch (a.type) {
    case 'COMPLETED':       return { icon: '✅', text: `Completed ${taskName} — ${fmtDate(a.createdAt)}` };
    case 'SNOOZED':         return { icon: '😴', text: `Snoozed ${taskName} — ${fmtDate(a.createdAt)}` };
    case 'IGNORED':         return { icon: '🙈', text: `Ignored alarm for ${taskName} — ${fmtDate(a.createdAt)}` };
    case 'MISSED_DEADLINE': return { icon: '💀', text: `Missed deadline for ${taskName} — ${fmtDate(a.createdAt)}` };
    case 'MISSED_ALARM':    return { icon: '🚨', text: `Missed alarm for ${taskName} — ${fmtDate(a.createdAt)}` };
    case 'CREATED_TASK':    return { icon: '📋', text: `Created ${taskName} — ${fmtDate(a.createdAt)}` };
    default:                return { icon: '📌', text: `${a.type} — ${fmtDate(a.createdAt)}` };
  }
}

const MOOD_DETAILS = {
  heroic: {
    title: '🏆 HEROIC',
    color: '#fbbf24',
    condition: 'net score ≥ +15 AND chaos < 5',
    description: 'You have achieved HEROIC status. Net score ≥ +15 with minimal chaos. The universe is momentarily impressed — and that almost never happens.',
    advice: 'Maintain this divine state. Do NOT snooze your alarms. The fall from heroic is swift, dramatic, and poorly received.'
  },
  focused: {
    title: '🎯 FOCUSED',
    color: '#3b82f6',
    condition: 'net score ≥ +6',
    description: 'Focused and functional. Net score ≥ +6. Discipline is outpacing chaos. The narrator is cautiously, almost reluctantly, optimistic.',
    advice: 'Keep completing tasks. Heroic status is visible from here — it\'s just whether you actually want to reach it.'
  },
  chaotic: {
    title: '🌪️ CHAOTIC',
    color: '#ef4444',
    condition: 'net score ≤ −10',
    description: 'CHAOS MODE. Net score ≤ −10. Your discipline has been obliterated by accumulated avoidance. Alarm GAME LOCKOUT is now active.',
    advice: '⚠️ LOCKOUT ACTIVE. Every alarm triggers a mini-game before you can interact with it. Complete tasks. Stop ignoring things. Your only way out is through.'
  },
  struggling: {
    title: '😤 STRUGGLING',
    color: '#f97316',
    condition: 'net score ≤ −3',
    description: 'Struggling. Net score ≤ −3. Chaos is winning the slow war of attrition. Not catastrophic yet. The word "yet" is doing a lot of work there.',
    advice: 'Danger zone. Two or three more bad decisions away from game lockout. Behave. Complete things. Please.'
  },
  neutral: {
    title: '😐 NEUTRAL',
    color: '#64748b',
    condition: 'everything else',
    description: 'Neutral. The universe has no strong opinions about you right now. Net score is between −2 and +5 — neither inspiring nor alarming. A liminal state of mediocre potential.',
    advice: 'Complete tasks to ascend to Focused. Start slipping and you\'ll descend to Struggling. The choice, as always, is yours.'
  }
};

function MoodModal({ user, onClose }) {
  const mood   = user?.mood || 'neutral';
  const detail = MOOD_DETAILS[mood] || MOOD_DETAILS.neutral;
  const net    = (user?.disciplineScore || 0) - (user?.chaosScore || 0);

  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    activityApi.getActivities(15).then(data => {
      setLogs(data.activities || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  return (
    <div className="score-modal-overlay" onClick={onClose}>
      <div className="score-modal" onClick={e => e.stopPropagation()}>
        <button className="score-modal-close" onClick={onClose}>✕</button>
        <div className="score-modal-icon">{detail.title.split(' ')[0]}</div>
        <h2 className="score-modal-title" style={{ color: detail.color }}>{detail.title}</h2>

        <div className="score-modal-body">
          <p className="score-modal-desc">{detail.description}</p>

          <div className="mood-condition-box">
            <span className="mood-condition-label">📐 Condition:</span>
            <code className="mood-condition-code">{detail.condition}</code>
          </div>

          <div className="score-breakdown" style={{ marginTop: 14 }}>
            <div className="score-item score-item--positive">
              <span>🎯 Discipline</span><span className="score-delta">{user?.disciplineScore || 0}</span>
            </div>
            <div className="score-item score-item--negative">
              <span>🌪️ Chaos</span><span className="score-delta">{user?.chaosScore || 0}</span>
            </div>
            <div className="score-item" style={{ borderTop: '1px solid rgba(255,255,255,0.15)', marginTop: 4, paddingTop: 8 }}>
              <span><strong>Net Score</strong></span>
              <span className="score-delta" style={{ color: net >= 0 ? '#10b981' : '#ef4444', fontSize: 16 }}>
                {net >= 0 ? '+' : ''}{net}
              </span>
            </div>
          </div>

          <div className="score-insight" style={{ marginTop: 12 }}>💡 {detail.advice}</div>

          {/* All mood states */}
          <div style={{ marginTop: 14 }}>
            <p style={{ fontSize: 12, color: '#64748b', marginBottom: 8 }}>All mood states (net-score based):</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {Object.entries(MOOD_DETAILS).map(([key, d]) => (
                <span key={key} style={{
                  padding: '3px 10px', borderRadius: 12, fontSize: 11,
                  background: key === mood ? d.color : 'rgba(255,255,255,0.05)',
                  color: key === mood ? '#000' : '#94a3b8',
                  fontWeight: key === mood ? 'bold' : 'normal'
                }}>
                  {d.title}
                </span>
              ))}
            </div>
          </div>

          {/* Recent activity log */}
          <h4 style={{ marginTop: 18, marginBottom: 8, color: '#94a3b8', fontSize: 13 }}>📜 Recent activity:</h4>
          {loading ? (
            <p style={{ color: '#64748b', fontSize: 13 }}>Loading...</p>
          ) : logs.length === 0 ? (
            <p style={{ color: '#64748b', fontSize: 13, fontStyle: 'italic' }}>No activity yet.</p>
          ) : (
            <div className="log-list">
              {logs.slice(0, 8).map(a => {
                const { icon, text } = humanLog(a);
                return (
                  <div key={a._id} className="log-item">
                    <span className="log-icon">{icon}</span>
                    <span className="log-text">{text}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Navbar() {
  const { user, logout } = useAuth();
  const [showMoodModal, setShowMoodModal] = useState(false);

  return (
    <>
      <nav className="navbar">
        <div className="container navbar-content">
          <div className="navbar-brand">🎭 DramaDo</div>
          <div className="navbar-user">
            <div onClick={() => setShowMoodModal(true)} title="Click to understand your mood" style={{ cursor: 'pointer' }}>
              <MoodBadge user={user} />
            </div>
            <span>👤 {user.name}</span>
            <button onClick={logout} className="btn btn-secondary btn-small">Logout</button>
          </div>
        </div>
      </nav>

      {showMoodModal && (
        <MoodModal user={user} onClose={() => setShowMoodModal(false)} />
      )}
    </>
  );
}

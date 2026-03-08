import { useState, useEffect, useRef, useCallback } from 'react';
import Modal from '../../ui/Modal';

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

// ═══════════════════════════════════════════════════════════════════════════════
//  CHAOS MESSAGES
// ═══════════════════════════════════════════════════════════════════════════════

const CHAOS_TAUNTS = [
  "😈 Your net score is an EMBARRASSMENT. You must EARN the right to manage your own tasks!",
  "💀 Discipline obliterated by chaos. The system has LOCKED YOU OUT. Play. The. Game.",
  "🌋 NET SCORE IN THE NEGATIVES!! The alarm refuses to yield without a fight!",
  "🎪 You've gamified your own dysfunction. This game is the CONSEQUENCE of your choices.",
  "😤 Every bomb represents a snooze, an ignore, a deadline you watched go by. Face them.",
  "🔴 Prove you still have basic cognitive function. Win the game. THEN touch the buttons.",
  "🤡 A mini-game stands between you and your own alarm. Sit with the choices that caused this.",
  "💥 The alarm system has lost faith in your voluntary compliance. WIN IT BACK.",
];

const CHAOS_LOCK_MESSAGES = [
  "🔴 NET SCORE ≤ −10 — ALARM LOCKED!! Your discipline has been outrun by your chaos. Play the game. WIN it. THEN you may touch your responsibilities like a person.",
  "💀 LOCKOUT ACTIVATED!! The system has observed your sustained avoidance and issued a verdict: NO FREE PASSES. A game stands between you and basic functionality. Yes, a game. This is your life now.",
  "🌋 YOUR NET SCORE IS SO NEGATIVE THE ALARM SYSTEM IS EMBARRASSED FOR YOU!! Play. Win. ONLY THEN shall the buttons emerge from hiding.",
  "🎪 You've reached a state so chaotic the system mandated MANDATORY FUN as a prerequisite for task management. Enjoy what you've constructed through your choices.",
  "🤡 Mini-game required. This is not a drill. This is a direct consequence. Look inward. Then win the game.",
];

const GAME_WIN_MESSAGES = [
  "🎉 WINNER!! Against all reasonable probability!! The locks disengage! Handle this alarm RESPONSIBLY FOR ONCE!!",
  "🏆 VICTORY!! The system, begrudgingly, tips its hat. The alarm controls are yours. USE THEM WISELY.",
  "⚡ GAME DEFEATED!! You have demonstrated sufficient function to manage your own schedule! DO SOMETHING GOOD WITH THIS!",
  "🎭 CHAMPION!! The chaos system concedes! ALARM UNLOCKED! Do NOT waste this hard-won opportunity on regret!",
];

const GAME_LOSE_MESSAGES = [
  "💀 YOU LOST. To a browser game. Designed to be beatable. By you specifically. The chaos feasts. TRY AGAIN.",
  "😱 DEFEATED!! The system expected this but is still somehow disappointed. Buttons stay locked. TRY AGAIN.",
  "🔥 GAME OVER!! Every failure is a metaphor. The alarm rings on. Pick yourself up. TRY AGAIN. It is not optional.",
  "🌋 L·O·S·T. A game made to give you a chance. You declined the chance. The irony is excruciating. TRY AGAIN.",
];

// ═══════════════════════════════════════════════════════════════════════════════
//  GAME 1: SOCKBOMB  (click bombs before they vanish)
// ═══════════════════════════════════════════════════════════════════════════════

const SB = { GRID: 5, NEED: 12, DURATION: 30, SPAWN_MS: 700, STAY_MS: 1200 };

const SB_POPS = [
  "💥 BOOM!", "🧨 DESTROYED!", "💣 GONE!", "🔥 OBLITERATED!",
  "⚡ CRUSHED!", "👊 SMASHED!", "🎯 HIT!", "💀 ELIMINATED!",
];

function SockbombGame({ onWin, onLose }) {
  const [bombs,    setBombs]    = useState([]);
  const [score,    setScore]    = useState(0);
  const [timeLeft, setTimeLeft] = useState(SB.DURATION);
  const [pops,     setPops]     = useState([]);
  const [taunt,    setTaunt]    = useState(pick(CHAOS_TAUNTS));
  const uid    = useRef(0);
  const wonRef = useRef(false);
  const over   = useRef(false);

  // Spawn bombs
  useEffect(() => {
    const t = setInterval(() => {
      if (over.current) return;
      const id = uid.current++;
      const row = Math.floor(Math.random() * SB.GRID);
      const col = Math.floor(Math.random() * SB.GRID);
      setBombs(prev => {
        const deduped = prev.filter(b => !(b.row === row && b.col === col));
        return [...deduped.slice(-6), { id, row, col, born: Date.now() }];
      });
    }, SB.SPAWN_MS);
    return () => clearInterval(t);
  }, []);

  // Expire old bombs
  useEffect(() => {
    const t = setInterval(() => {
      setBombs(prev => prev.filter(b => Date.now() - b.born < SB.STAY_MS));
    }, 150);
    return () => clearInterval(t);
  }, []);

  // Countdown
  useEffect(() => {
    const t = setInterval(() => {
      setTimeLeft(s => {
        if (s <= 1) {
          clearInterval(t);
          if (!wonRef.current && !over.current) { over.current = true; setTimeout(onLose, 200); }
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [onLose]);

  // Rotate taunts
  useEffect(() => {
    const t = setInterval(() => setTaunt(pick(CHAOS_TAUNTS)), 3500);
    return () => clearInterval(t);
  }, []);

  const hit = (id, row, col) => {
    if (over.current) return;
    setBombs(prev => prev.filter(b => b.id !== id));
    const pid = uid.current++;
    const x = (col / SB.GRID) * 88 + 6;
    const y = (row / (SB.GRID - 1)) * 80 + 5;
    setPops(p => [...p, { id: pid, x, y, text: pick(SB_POPS) }]);
    setTimeout(() => setPops(p => p.filter(pp => pp.id !== pid)), 800);
    setScore(prev => {
      const next = prev + 1;
      if (next >= SB.NEED && !wonRef.current) {
        wonRef.current = true; over.current = true;
        setTimeout(onWin, 300);
      }
      return next;
    });
  };

  const grid = Array.from({ length: SB.GRID }, (_, r) =>
    Array.from({ length: SB.GRID }, (_, c) =>
      bombs.find(b => b.row === r && b.col === c) || null
    )
  );

  const timerColor = timeLeft <= 8 ? '#ef4444' : timeLeft <= 15 ? '#f59e0b' : '#10b981';
  const pct = Math.min(100, (score / SB.NEED) * 100);

  return (
    <div className="minigame-wrap">
      <div className="minigame-title">💣 SOCKBOMB PANIC</div>
      <div className="minigame-taunt">{taunt}</div>
      <div className="minigame-hud">
        <span className="minigame-score">💣 {score}/{SB.NEED}</span>
        <span className="minigame-timer" style={{ color: timerColor }}>⏱ {timeLeft}s</span>
      </div>
      <div className="minigame-progress">
        <div className="minigame-progress-fill" style={{ width: `${pct}%` }} />
      </div>
      <div className="sb-grid">
        {grid.map((row, ri) => row.map((bomb, ci) => (
          <div key={`${ri}-${ci}`} className={`sb-cell ${bomb ? 'sb-cell--active' : ''}`}
            onClick={() => bomb && hit(bomb.id, ri, ci)}>
            {bomb && <span className="sb-bomb">💣</span>}
          </div>
        )))}
        {pops.map(p => (
          <div key={p.id} className="sb-pop" style={{ left: `${p.x}%`, top: `${p.y}%` }}>{p.text}</div>
        ))}
      </div>
      <p className="minigame-hint">Click {SB.NEED} bombs in {SB.DURATION}s!</p>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
//  GAME 2: PANIC PUSH  (sokoban)
// ═══════════════════════════════════════════════════════════════════════════════

const F=0, W=1, P=2, B=3, T=4, BT=5, PT=6;

// All levels verified solvable:
// L1: push box right once → done
// L2: go left-up push box1 to target, go down-right-right-up push box2 to target
// L3: push box up×2, go right-up push left×2 onto target
// L4: go left×2-up push box1 to target, go down-right×3-up push box2 to target
const SK_LEVELS = [
  {
    title: "THE WARM-UP (solution: →)",
    grid: [
      [W,W,W,W,W,W,W],
      [W,F,F,F,F,F,W],
      [W,F,P,B,T,F,W],
      [W,F,F,F,F,F,W],
      [W,W,W,W,W,W,W],
    ]
  },
  {
    title: "TWO BOXES (solution: ←↑ then ↓→→↑)",
    grid: [
      [W,W,W,W,W,W,W],
      [W,F,T,F,T,F,W],
      [W,F,B,F,B,F,W],
      [W,F,F,P,F,F,W],
      [W,W,W,W,W,W,W],
    ]
  },
  {
    title: "THE DETOUR (solution: ↑↑ →↑ ←←)",
    grid: [
      [W,W,W,W,W,W,W],
      [W,T,F,F,F,F,W],
      [W,F,F,F,F,F,W],
      [W,F,F,B,F,F,W],
      [W,F,F,P,F,F,W],
      [W,W,W,W,W,W,W],
    ]
  },
  {
    title: "THE JUGGLER (solution: ←←↑ then ↓→→→↑)",
    grid: [
      [W,W,W,W,W,W,W,W],
      [W,F,T,F,F,T,F,W],
      [W,F,B,F,F,B,F,W],
      [W,F,F,F,P,F,F,W],
      [W,W,W,W,W,W,W,W],
    ]
  },
];

const SK_TAUNTS = [
  "Use WASD or arrows — or is that also too difficult?",
  "Push 📦 onto 🎯. Yes, ALL of them.",
  "The boxes won't push themselves. Unfortunately.",
  "Think. Before. Pushing. A novel concept, I know.",
  "Every wrong push is a metaphor for your planning skills.",
  "Use Undo. It's right there. Unlike your discipline.",
];

function deepCopy(g) { return g.map(r => [...r]); }

function findPlayer(grid) {
  for (let r = 0; r < grid.length; r++)
    for (let c = 0; c < grid[r].length; c++)
      if (grid[r][c] === P || grid[r][c] === PT) return [r, c];
  return null;
}

function hasUnsolvedBoxes(grid) {
  for (let r = 0; r < grid.length; r++)
    for (let c = 0; c < grid[r].length; c++)
      if (grid[r][c] === B) return true;
  return false;
}

function applyMove(grid, dr, dc) {
  const pos = findPlayer(grid);
  if (!pos) return { grid, moved: false };
  const [pr, pc] = pos;
  const nr = pr + dr, nc = pc + dc;
  if (nr < 0 || nr >= grid.length || nc < 0 || nc >= grid[0].length) return { grid, moved: false };

  const dest = grid[nr][nc];
  const g    = deepCopy(grid);
  const wasOnTarget = g[pr][pc] === PT;

  if (dest === F || dest === T) {
    g[pr][pc] = wasOnTarget ? T : F;
    g[nr][nc] = dest === T ? PT : P;
    return { grid: g, moved: true };
  }

  if (dest === B || dest === BT) {
    const br = nr + dr, bc = nc + dc;
    if (br < 0 || br >= g.length || bc < 0 || bc >= g[0].length) return { grid, moved: false };
    const behind = g[br][bc];
    if (behind === W || behind === B || behind === BT) return { grid, moved: false };
    g[br][bc] = behind === T ? BT : B;
    g[pr][pc] = wasOnTarget ? T : F;
    g[nr][nc] = dest === BT ? PT : P;
    return { grid: g, moved: true };
  }

  return { grid, moved: false };
}

const CELL_ICON = { [F]:'', [W]:'🧱', [P]:'🧑', [B]:'📦', [T]:'🎯', [BT]:'✅', [PT]:'🧑' };
const CELL_BG   = {
  [F]:'transparent', [W]:'#1e293b',
  [P]:'rgba(139,92,246,0.2)', [B]:'rgba(245,158,11,0.2)',
  [T]:'rgba(16,185,129,0.15)', [BT]:'rgba(16,185,129,0.4)',
  [PT]:'rgba(139,92,246,0.2)',
};

function SokobanGame({ onWin, onLose }) {
  const lvlIdx = useRef(Math.floor(Math.random() * SK_LEVELS.length));
  const level  = SK_LEVELS[lvlIdx.current];

  const [grid,     setGrid]     = useState(() => deepCopy(level.grid));
  const [timeLeft, setTimeLeft] = useState(90);
  const [moves,    setMoves]    = useState(0);
  const [taunt,    setTaunt]    = useState(pick(SK_TAUNTS));
  const [history,  setHistory]  = useState([]);
  const wonRef = useRef(false);
  const over   = useRef(false);

  const doMove = useCallback((dr, dc) => {
    if (over.current) return;
    setGrid(prev => {
      const { grid: next, moved } = applyMove(prev, dr, dc);
      if (!moved) return prev;
      setMoves(m => m + 1);
      setHistory(h => [...h, prev]);
      if (!hasUnsolvedBoxes(next) && !wonRef.current) {
        wonRef.current = true; over.current = true;
        setTimeout(onWin, 400);
      }
      return next;
    });
  }, [onWin]);

  const undo = () => {
    if (history.length === 0) return;
    setGrid(history[history.length - 1]);
    setHistory(h => h.slice(0, -1));
    setMoves(m => Math.max(0, m - 1));
  };

  const reset = () => {
    setGrid(deepCopy(level.grid));
    setHistory([]);
    setMoves(0);
  };

  // Keyboard
  useEffect(() => {
    const onKey = (e) => {
      const map = {
        ArrowUp:[-1,0], ArrowDown:[1,0], ArrowLeft:[0,-1], ArrowRight:[0,1],
        w:[-1,0], s:[1,0], a:[0,-1], d:[0,1],
        W:[-1,0], S:[1,0], A:[0,-1], D:[0,1]
      };
      const dir = map[e.key];
      if (dir) { e.preventDefault(); doMove(...dir); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [doMove]);

  // Countdown
  useEffect(() => {
    const t = setInterval(() => {
      setTimeLeft(s => {
        if (s <= 1) {
          clearInterval(t);
          if (!wonRef.current && !over.current) { over.current = true; setTimeout(onLose, 200); }
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [onLose]);

  // Rotate taunts
  useEffect(() => {
    const t = setInterval(() => setTaunt(pick(SK_TAUNTS)), 5000);
    return () => clearInterval(t);
  }, []);

  // Count unsolved
  const rem = grid.flat().filter(c => c === B).length;
  const timerColor = timeLeft <= 15 ? '#ef4444' : timeLeft <= 30 ? '#f59e0b' : '#10b981';

  return (
    <div className="minigame-wrap">
      <div className="minigame-title">📦 PANIC PUSH</div>
      <div className="minigame-subtitle">{level.title}</div>
      <div className="minigame-taunt">{taunt}</div>
      <div className="minigame-hud">
        <span className="minigame-score">📦 {rem} left</span>
        <span className="minigame-score">👣 {moves}</span>
        <span className="minigame-timer" style={{ color: timerColor }}>⏱ {timeLeft}s</span>
      </div>

      <div className="sk-grid" style={{ '--sk-cols': level.grid[0].length }} tabIndex={0}>
        {grid.map((row, ri) => row.map((cell, ci) => (
          <div key={`${ri}-${ci}`} className={`sk-cell sk-cell--${cell}`} style={{ background: CELL_BG[cell] }}>
            {CELL_ICON[cell]}
          </div>
        )))}
      </div>

      <div className="sk-dpad">
        <div className="sk-dpad-row"><button className="sk-btn" onClick={() => doMove(-1,0)}>▲</button></div>
        <div className="sk-dpad-row">
          <button className="sk-btn" onClick={() => doMove(0,-1)}>◄</button>
          <button className="sk-btn" onClick={() => doMove(1,0)}>▼</button>
          <button className="sk-btn" onClick={() => doMove(0,1)}>►</button>
        </div>
      </div>

      <div className="sk-util-row">
        <button className="sk-util-btn" onClick={undo} disabled={history.length === 0}>↩ Undo</button>
        <button className="sk-util-btn" onClick={reset}>🔄 Reset</button>
      </div>

      <p className="minigame-hint">Push 📦 onto 🎯 — WASD / arrows / buttons. Undo if stuck!</p>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
//  GAME ROUTER
// ═══════════════════════════════════════════════════════════════════════════════

function ChaosGame({ onWin, onLose }) {
  const gameType = useRef(Math.random() < 0.5 ? 'sockbomb' : 'sokoban');
  return gameType.current === 'sockbomb'
    ? <SockbombGame onWin={onWin} onLose={onLose} />
    : <SokobanGame  onWin={onWin} onLose={onLose} />;
}

// ═══════════════════════════════════════════════════════════════════════════════
//  ALARM MODAL
// ═══════════════════════════════════════════════════════════════════════════════

export default function AlarmModal({ task, isChaosLocked, onComplete, onSnooze, onIgnore, enableAudio, playAlarmNow }) {
  const [gameState,    setGameState]    = useState('idle');
  const [alarmSeconds, setAlarmSeconds] = useState(null);
  const [chaosMsg,     setChaosMsg]     = useState('');
  const [resultMsg,    setResultMsg]    = useState('');
  const [gameKey,      setGameKey]      = useState(0);
  const [audioUnlocked, setAudioUnlocked] = useState(false);

  // Invisible click-to-unlock: entire modal is a silent trigger zone.
  // Any click anywhere on the modal unlocks audio and immediately starts the alarm.
  // No visual feedback — it just starts ringing. The user won't know what they triggered.
  const handleModalClick = useCallback(async () => {
    if (audioUnlocked) return; // already unlocked, normal clicks pass through
    if (!enableAudio) return;
    const ok = await enableAudio();
    if (ok) {
      setAudioUnlocked(true);
      // Start ringing immediately now that audio is unlocked
      if (playAlarmNow && task) await playAlarmNow(task);
    }
  }, [audioUnlocked, enableAudio, playAlarmNow, task]);

  // Merged into one effect so countdown interval starts immediately when task appears.
  // Previously split into two effects both keyed on [task?._id]: the first called
  // setAlarmSeconds() (async state update) and the second read alarmSeconds — but
  // since both ran in the same render cycle, alarmSeconds was still null in the
  // second effect, so the interval never started (countdown stuck at 5:00).
  useEffect(() => {
    if (!task) return;
    setGameState(isChaosLocked ? 'locked' : 'open');
    setChaosMsg(pick(CHAOS_LOCK_MESSAGES));
    setResultMsg('');
    setAudioUnlocked(false);

    const seconds = task.alarmDurationMinutes ? task.alarmDurationMinutes * 60 : null;
    setAlarmSeconds(seconds);

    if (!seconds) return;
    const t = setInterval(() => {
      setAlarmSeconds(s => s !== null ? Math.max(0, s - 1) : null);
    }, 1000);
    return () => clearInterval(t);
  }, [task?._id]); // eslint-disable-line

  if (!task) return null;

  const fmtTime = (s) => {
    if (s === null) return null;
    const m = Math.floor(s / 60), sec = s % 60;
    return m > 0 ? `${m}m ${sec}s` : `${sec}s`;
  };

  const PCOLOR = { high: '#ef4444', medium: '#f59e0b', low: '#10b981' };
  const pColor = PCOLOR[task.priority] || '#8b5cf6';

  const snoozeDurations = [0.5, 1, 5, 10, 15, 30];
  const labelFor = (m) => m < 1 ? `${Math.round(m * 60)}s` : `${m}m`;

  const handleWin  = () => { setResultMsg(pick(GAME_WIN_MESSAGES));  setGameState('won'); };
  const handleLose = () => { setResultMsg(pick(GAME_LOSE_MESSAGES)); setGameState('lost'); };
  const retryGame  = () => { setResultMsg(''); setGameKey(k => k + 1); setGameState('playing'); };

  const actionsOpen = gameState === 'open' || gameState === 'won';

  return (
    <Modal isOpen={!!task} onClose={() => {}}>
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events */}
      <div
        className="alarm-modal"
        onClick={handleModalClick}
        style={audioUnlocked ? {} : { cursor: 'default' }}
      >

        {/* Header */}
        <div className="alarm-header-pulse">
          <h1 className="alarm-title">🚨 ALARM! 🚨</h1>
          {alarmSeconds !== null && (
            <div className={`alarm-countdown ${alarmSeconds <= 30 ? 'alarm-countdown-urgent' : ''}`}>
              ⏳ Alarm window: <strong>{fmtTime(alarmSeconds)}</strong> remaining
              {alarmSeconds <= 10 && ' — ACT NOW!!'}
            </div>
          )}
        </div>

        {/* Task card */}
        <div className="alarm-task-card" style={{ borderColor: pColor }}>
          <h2 className="alarm-task-title">{task.title}</h2>
          {task.description && <p className="alarm-task-desc">{task.description}</p>}
          <span className="alarm-priority-badge" style={{ background: pColor }}>
            ⚡ {task.priority.toUpperCase()} PRIORITY
          </span>
        </div>

        {/* Chaos locked */}
        {isChaosLocked && gameState === 'locked' && (
          <div className="chaos-lock-panel">
            <div className="chaos-lock-warning">🔴 CHAOS LOCKOUT ACTIVE 🔴</div>
            <p className="chaos-lock-message">{chaosMsg}</p>
            <button className="btn btn-danger" style={{ marginTop: 14, fontSize: 17, padding: '13px 28px' }}
              onClick={() => { setGameKey(k => k + 1); setGameState('playing'); }}>
              💣 PLAY TO UNLOCK
            </button>
          </div>
        )}

        {/* Game playing */}
        {gameState === 'playing' && (
          <ChaosGame key={gameKey} onWin={handleWin} onLose={handleLose} />
        )}

        {/* Game lost */}
        {gameState === 'lost' && (
          <div className="chaos-lock-panel">
            <div className="chaos-lock-warning" style={{ color: '#ef4444' }}>💀 YOU LOST 💀</div>
            <p className="chaos-lock-message">{resultMsg}</p>
            <button className="btn btn-danger" style={{ marginTop: 14, fontSize: 15, padding: '11px 24px' }} onClick={retryGame}>
              🔄 TRY AGAIN (you can do this. probably.)
            </button>
          </div>
        )}

        {/* Win banner */}
        {isChaosLocked && gameState === 'won' && (
          <div className="chaos-unlock-banner">{resultMsg}</div>
        )}

        {/* Alarm actions */}
        {actionsOpen && (
          <div className="alarm-actions-section">
            <div style={{ marginBottom: 14 }}>
              <p style={{ fontWeight: 700, marginBottom: 8, color: '#94a3b8' }}>⏰ Snooze for:</p>
              <div className="snooze-options">
                {snoozeDurations.map(min => (
                  <button key={min} onClick={() => onSnooze(task._id, min)} className="btn btn-secondary btn-small snooze-btn">
                    {labelFor(min)}
                  </button>
                ))}
              </div>
            </div>
            <div className="alarm-main-actions">
              <button onClick={() => onComplete(task._id)} className="btn btn-success alarm-action-btn">✅ Complete Now</button>
              <button onClick={() => onIgnore(task._id)} className="btn btn-danger alarm-action-btn">🙈 Ignore</button>
            </div>
          </div>
        )}

      </div>
    </Modal>
  );
}

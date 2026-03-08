import { useState, useEffect, useRef, useCallback } from 'react';
import tasksApi from './tasksApi';

const DEFAULT_ALARM_DURATION_MINUTES = 5;
const DEFAULT_ALARM_SRC = '/alarms/alarm.mp3';

export default function useAlarmEngine(tasks, onAlarm, onMissedAlarm, onUserUpdate) {
  // Never read from localStorage — browser autoplay policy resets on every
  // new tab regardless of stored state, so a stored "true" is a lie that
  // causes startAlarmAudio to run during the polling tick, return a stop fn
  // (even though play() silently failed), and then fool playAlarmNow into
  // thinking audio is already playing.
  const [audioEnabled, setAudioEnabled] = useState(false);
  const audioEnabledRef = useRef(false);

  const firedAlarms = useRef(new Set());
  const alarmTimers = useRef(new Map()); // taskId → { stopAudio, timeoutId, expiresAt }

  // Keep ref in sync with state (for use inside callbacks and intervals)
  useEffect(() => {
    audioEnabledRef.current = audioEnabled;
  }, [audioEnabled]);

  // ── Resolve playback URL for a task ──────────────────────────────────────
  const resolveAlarmSrc = useCallback((task) => {
    const raw = task?.customAlarmUrl || DEFAULT_ALARM_SRC;
    try {
      return new URL(raw, window.location.origin).toString();
    } catch {
      return raw || DEFAULT_ALARM_SRC;
    }
  }, []);

  // ── Unlock browser audio context ──────────────────────────────────────────
  // Always primes with the default alarm (served from /public, zero latency).
  // Never uses the custom alarm URL here — that file lives behind the Vite
  // proxy → Express, which can be slow or unavailable, causing the primer to
  // fail and returning false even with a valid user gesture.
  const unlockAudio = useCallback(async () => {
    const primer = new Audio(DEFAULT_ALARM_SRC);
    primer.volume = 0;
    primer.muted = true;
    try {
      await primer.play();
      primer.pause();
      primer.currentTime = 0;
      primer.src = '';
      // Set ref immediately — don't wait for setAudioEnabled's useEffect
      audioEnabledRef.current = true;
      setAudioEnabled(true);
      return true;
    } catch (e) {
      console.error('[unlockAudio] failed:', e);
      primer.src = '';
      return false;
    }
  }, []);

  // ── Start looping audio for polling-tick alarms ───────────────────────────
  // Only runs when audioEnabledRef is already true (user previously clicked
  // Enable). Returns null if audio not yet enabled so the entry is stored
  // with stopAudio=null — playAlarmNow handles starting it on first click.
  const startAlarmAudio = useCallback((task) => {
    if (!audioEnabledRef.current) return null;

    const src = resolveAlarmSrc(task);
    const audio = new Audio(src);
    audio.loop = true;
    audio.preload = 'auto';
    audio.play().catch(e => console.error('[startAlarmAudio] play failed:', e));

    return () => {
      audio.loop = false;
      audio.pause();
      audio.currentTime = 0;
      audio.src = '';
    };
  }, [resolveAlarmSrc]);

  // ── Main polling loop ─────────────────────────────────────────────────────
  useEffect(() => {
    const checkAlarms = () => {
      const now = new Date();
      tasks.forEach(task => {
        if (task.status !== 'todo') return;
        if (!task.alarmTime) return;

        const taskId = task._id;
        if (firedAlarms.current.has(taskId)) return;

        const alarmTime    = new Date(task.alarmTime);
        const snoozedUntil = task.snoozedUntil ? new Date(task.snoozedUntil) : null;
        if (snoozedUntil && now < snoozedUntil) return;
        if (now < alarmTime) return;

        firedAlarms.current.add(taskId);

        const durationMs = (task.alarmDurationMinutes || DEFAULT_ALARM_DURATION_MINUTES) * 60 * 1000;
        const expiresAt  = new Date(now.getTime() + durationMs);

        // stopAudio may be null if audio isn't enabled yet — that's fine,
        // playAlarmNow will start audio on the first modal click.
        const stopAudio = startAlarmAudio(task);

        const timeoutId = setTimeout(async () => {
          const entry = alarmTimers.current.get(taskId);
          if (!entry) return;
          if (entry.stopAudio) entry.stopAudio();
          alarmTimers.current.delete(taskId);
          try {
            const res = await tasksApi.missedAlarm(taskId);
            if (onMissedAlarm) onMissedAlarm(task, res.message);
            if (onUserUpdate && res.user) onUserUpdate(res.user);
          } catch (e) { console.error('Failed to record missed alarm', e); }
        }, durationMs);

        alarmTimers.current.set(taskId, { stopAudio, timeoutId, expiresAt });
        onAlarm(task);
      });
    };

    const interval = setInterval(checkAlarms, 1000);
    return () => clearInterval(interval);
  }, [tasks, onAlarm, onMissedAlarm, onUserUpdate, startAlarmAudio]);

  // ── enableAudio: "Enable Dramatic Alarms" button ─────────────────────────
  const enableAudio = useCallback(() => {
    return unlockAudio();
  }, [unlockAudio]);

  // ── primeAudioBestEffort: push-notification click path ────────────────────
  const primeAudioBestEffort = useCallback(async () => {
    if (audioEnabledRef.current) return true;
    return unlockAudio();
  }, [unlockAudio]);

  // ── playAlarmNow: called from AlarmModal on first click ───────────────────
  //
  // Always stops any existing audio and restarts from scratch.
  // This is safe because:
  //   1. AlarmModal's audioUnlocked flag prevents this being called more than
  //      once per alarm (subsequent clicks hit the `if (audioUnlocked) return`
  //      guard and never reach playAlarmNow).
  //   2. startAlarmAudio returns a stop fn even when play() silently fails,
  //      so we can never reliably use entry.stopAudio as a "is playing" signal.
  //      The only safe approach is to stop+restart with an awaited play() call
  //      that will tell us if it actually worked.
  //
  const playAlarmNow = useCallback(async (task) => {
    if (!task) return false;
    const taskId = task._id;
    const entry  = alarmTimers.current.get(taskId);

    // Stop any previously created audio (may or may not have been playing)
    if (entry?.stopAudio) entry.stopAudio();

    // Start fresh, awaiting play() so we know it actually worked
    const src   = resolveAlarmSrc(task);
    const audio = new Audio(src);
    audio.loop    = true;
    audio.preload = 'auto';

    try {
      await audio.play();
    } catch (e) {
      console.error('[playAlarmNow] audio.play() failed for', src, e);
      audio.src = '';
      return false;
    }

    const stop = () => {
      audio.loop = false;
      audio.pause();
      audio.currentTime = 0;
      audio.src = '';
    };

    if (entry) {
      entry.stopAudio = stop;
      alarmTimers.current.set(taskId, entry);
    } else {
      alarmTimers.current.set(taskId, {
        stopAudio: stop,
        timeoutId: null,
        expiresAt: new Date(Date.now() + DEFAULT_ALARM_DURATION_MINUTES * 60000)
      });
    }
    return true;
  }, [resolveAlarmSrc]);

  // ── resetFired: call when user acts on an alarm ───────────────────────────
  const resetFired = (taskId) => {
    firedAlarms.current.delete(taskId);
    const entry = alarmTimers.current.get(taskId);
    if (entry) {
      if (entry.stopAudio) entry.stopAudio();
      if (entry.timeoutId) clearTimeout(entry.timeoutId);
      alarmTimers.current.delete(taskId);
    }
  };

  const getAlarmTimeRemaining = (taskId) => {
    const entry = alarmTimers.current.get(taskId);
    if (!entry) return null;
    return Math.max(0, Math.round((entry.expiresAt - Date.now()) / 1000));
  };

  return { audioEnabled, enableAudio, resetFired, getAlarmTimeRemaining, primeAudioBestEffort, playAlarmNow };
}

import { useState, useEffect, useRef } from 'react';

export default function useAlarmEngine(tasks, onAlarm) {
  const [audioEnabled, setAudioEnabled] = useState(false);
  const firedAlarms = useRef(new Set());
  const audioRef = useRef(null);

  useEffect(() => {
    const checkAlarms = () => {
      const now = new Date();
      tasks.forEach(task => {
        if (task.status !== 'todo') return;
        if (!task.alarmTime) return;
        if (firedAlarms.current.has(task._id)) return;

        const alarmTime = new Date(task.alarmTime);
        const snoozedUntil = task.snoozedUntil ? new Date(task.snoozedUntil) : null;

        if (snoozedUntil && now < snoozedUntil) return;
        if (now >= alarmTime) {
          firedAlarms.current.add(task._id);
          if (audioEnabled && audioRef.current) {
            audioRef.current.play().catch(console.error);
          }
          onAlarm(task);
        }
      });
    };

    const interval = setInterval(checkAlarms, 3000);
    return () => clearInterval(interval);
  }, [tasks, audioEnabled, onAlarm]);

  const enableAudio = () => {
    if (!audioRef.current) {
      // Put your audio file here: client/public/alarms/alarm.mp3
      // Then it will be served at /alarms/alarm.mp3
      audioRef.current = new Audio('/alarms/alarm.mp3');
      audioRef.current.preload = 'auto';
    }
    setAudioEnabled(true);
  };

  const resetFired = (taskId) => {
    firedAlarms.current.delete(taskId);
  };

  return { audioEnabled, enableAudio, resetFired };
}
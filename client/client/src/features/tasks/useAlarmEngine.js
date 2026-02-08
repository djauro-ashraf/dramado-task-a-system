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
      audioRef.current = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBitr0/PTgjMGHm7A7+OZSA0PVqzn77BiFwtDmuD0wXMpBSxw0/PWhzUGGWm98M+gUBUNTKXk8LJkGAg+k9nyyoM4BTJ+zfDajzsIGGS57uynUxYMSqHi8bllGAg8l9ryz4I2BTJ80fDaijwIH2q+8OScTQ');
    }
    setAudioEnabled(true);
  };

  const resetFired = (taskId) => {
    firedAlarms.current.delete(taskId);
  };

  return { audioEnabled, enableAudio, resetFired };
}
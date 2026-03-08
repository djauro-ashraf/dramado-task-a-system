import { useState, useEffect, useCallback } from 'react';
import pushApi from '../../app/pushApi';

export default function usePushNotifications(onNotificationClick) {
  const [pushStatus, setPushStatus] = useState('idle'); // idle | loading | granted | denied | unsupported | error

  useEffect(() => {
    if (!('serviceWorker' in navigator)) {
      setPushStatus('unsupported');
      return;
    }

    navigator.serviceWorker
      .register('/sw.js')
      .then(async () => {
        const already = await pushApi.isPushSubscribed();
        if (already) {
          setPushStatus('granted');
          return;
        }
        if (Notification.permission === 'denied') {
          setPushStatus('denied');
          return;
        }
        if (!('PushManager' in window)) {
          setPushStatus('unsupported');
          return;
        }
        setPushStatus('idle');
      })
      .catch((err) => {
        console.error('[SW] Registration failed:', err);
        setPushStatus('unsupported');
      });
  }, []);

  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;

    const handler = (event) => {
      if (event.data?.type === 'ALARM_NOTIFICATION_CLICKED') {
        onNotificationClick?.(event.data.taskId, { source: 'sw-message' });
      }
    };

    navigator.serviceWorker.addEventListener('message', handler);
    return () => navigator.serviceWorker.removeEventListener('message', handler);
  }, [onNotificationClick]);

  const enablePush = useCallback(async () => {
    setPushStatus('loading');
    try {
      const result = await pushApi.subscribeToPush();
      setPushStatus(result);
    } catch (err) {
      console.error('[Push] Subscribe error:', err);
      setPushStatus(Notification.permission === 'denied' ? 'denied' : 'error');
    }
  }, []);

  const disablePush = useCallback(async () => {
    try {
      await pushApi.unsubscribeFromPush();
      setPushStatus('idle');
    } catch (err) {
      console.error('[Push] Unsubscribe error:', err);
      setPushStatus('error');
    }
  }, []);

  return { pushStatus, enablePush, disablePush };
}

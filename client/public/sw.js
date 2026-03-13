const CACHE_NAME = 'dramado-v2';

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      cache.addAll(['/alarms/alarm.mp3'])
     )
   );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('push', (event) => {
  if (!event.data) return;

  let payload;
  try {
    payload = event.data.json();
  } catch {
    return;
  }

  const { title, body, taskId, priority, tag } = payload;

  const options = {
    body: body || 'A task needs your attention!',
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    tag: tag || `alarm-${taskId}`,
    renotify: true,
    requireInteraction: true,
    vibrate: [200, 100, 200],
    data: { taskId, priority, url: `/dashboard?alarmTaskId=${encodeURIComponent(taskId || '')}&fromPush=1` },
    actions: [
      { action: 'open', title: '👁 Open App' },
      { action: 'dismiss', title: '✕ Dismiss' }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(title || '🎭 DramaDo Alarm', options)
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'dismiss') return;

  const taskId = event.notification.data?.taskId;
  const targetUrl = event.notification.data?.url || '/dashboard';

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clients) => {
      const existing = clients.find((c) => c.url.includes('/dashboard'));
      if (existing) {
        existing.focus();
        existing.postMessage({
          type: 'ALARM_NOTIFICATION_CLICKED',
          taskId
        });
        return;
      }
      return self.clients.openWindow(targetUrl);
    })
  );
});

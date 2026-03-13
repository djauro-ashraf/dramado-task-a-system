import axios from '../app/axios';

/**
 * Fetches the VAPID public key from the server.
 */
const getVapidPublicKey = async () => {
  const res = await axios.get('/push/vapid-public-key');
  return res.data.publicKey;
};

/**
 * Converts a base64 VAPID public key string to a Uint8Array
 * as required by the PushManager.subscribe() call.
 */
const urlBase64ToUint8Array = (base64String) => {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = atob(base64);
  return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)));
};

/**
 * Registers the service worker, requests notification permission,
 * subscribes to Web Push, and saves the subscription to the server.
 *
 * Returns: 'granted' | 'denied' | 'unsupported'
 */
const subscribeToPush = async () => {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
    return 'unsupported';
  }

  const permission = await Notification.requestPermission();
  if (permission !== 'granted') return 'denied';

  const registration = await navigator.serviceWorker.ready;
  const vapidPublicKey = await getVapidPublicKey();

  let subscription = await registration.pushManager.getSubscription();

  if (!subscription) {
    subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(vapidPublicKey)
    });
  }

  const { endpoint, keys } = subscription.toJSON();
  await axios.post('/push/subscribe', { endpoint, keys });

  return 'granted';
 };

const unsubscribeFromPush = async () => {
  if (!('serviceWorker' in navigator)) return;

  const registration = await navigator.serviceWorker.ready;
  const subscription = await registration.pushManager.getSubscription();

  if (subscription) {
    const { endpoint } = subscription.toJSON();
    await subscription.unsubscribe();
    await axios.post('/push/unsubscribe', { endpoint }).catch(() => {});
  }
};

const isPushSubscribed = async () => {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) return false;
  const registration = await navigator.serviceWorker.ready;
  const subscription = await registration.pushManager.getSubscription();
  return !!subscription;
};

export default { subscribeToPush, unsubscribeFromPush, isPushSubscribed };

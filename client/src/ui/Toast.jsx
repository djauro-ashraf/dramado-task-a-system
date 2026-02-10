import { useState, useEffect } from 'react';

let showToastFn = null;

export const toast = {
  success: (message) => showToastFn?.(message, 'success'),
  error: (message) => showToastFn?.(message, 'error')
};

export default function Toast() {
  const [toastData, setToastData] = useState(null);

  useEffect(() => {
    showToastFn = (message, type) => {
      setToastData({ message, type });
      setTimeout(() => setToastData(null), 3000);
    };
  }, []);

  if (!toastData) return null;

  return (
    <div className={`toast ${toastData.type}`}>
      {toastData.message}
    </div>
  );
}
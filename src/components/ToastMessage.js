// src/components/ToastMessage.js
import { useCallback, useState } from "react";
import { TOAST_MESSAGE } from "./Atoms/Message";
import Toast from "./Atoms/Toast"; 

let toastId = 0;

export default function useToastMessage() {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = "info", duration = 3000, className = "") => {
    const id = toastId++;
    const newToast = { id, message, type, duration, className };

    setToasts((prev) => [...prev, newToast]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, duration);
  }, []);

  const showToastByKey = useCallback(
    (key, payload) => {
      const config = TOAST_MESSAGE[key];
      if (!config) {
        console.warn(`존재하지 않는 키입니다: ${key}`);
        return;
      }

      const message = config.getMessage
        ? config.getMessage(payload || {})
        : config.message;

      showToast(message, config.type, 3000, config.className);
    },
    [showToast]
  );

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  function ToastContainer() {
    return (
      <div className="toast-container">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            type={toast.type}
            message={toast.message}
            className={toast.className}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>
    );
  }

  return { showToast, showToastByKey, ToastContainer };
}
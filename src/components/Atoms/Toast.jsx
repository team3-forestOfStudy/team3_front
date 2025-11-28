import "./Message.css";

export default function Toast({ type = "info", message, className = "" }) {
  const icons = {
    error: "🚨",
    warning: "🚨",
    success: "🎉",
  };

  return (
    <div className={`toast ${type} ${className}`}>
      <span className="toast-icon">{icons[type]}</span>
      <span className="toast-message">{message}</span>
    </div>
  );
}

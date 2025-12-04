import { showPasswordSuccesToast } from "../../utils/toastmessage";
import "./textbutton.css";

export default function TextButton({ children, className }) {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      showPasswordSuccesToast("😀 클립보드에 복사되었습니다.");
    } catch (err) {
      console.error("URL 복사 실패", err);
    }
  };

  return (
    <button onClick={handleCopy} className={className}>
      {children}
    </button>
  );
}

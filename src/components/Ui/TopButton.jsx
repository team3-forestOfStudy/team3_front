// src/components/header/TopButton.jsx
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import arrowIcon from "../../assets/icons/arrow.svg";
import "../../styles/home.css";

/**
 * 공통 TOP 버튼
 * - window 와 .container 둘 다 스크롤을 감지해서
 *   어느 쪽이든 threshold 이상 내려가면 노출
 */
export default function TopButton({
  scrollTargetSelector = ".container",
  threshold = 50,
}) {
  const [visible, setVisible] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const container = document.querySelector(scrollTargetSelector) || null;

    const getScrollTop = () => {
      const winTop = window.scrollY || window.pageYOffset || 0;
      const containerTop = container?.scrollTop || 0;
      return Math.max(winTop, containerTop);
    };

    const handleScroll = () => {
      const top = getScrollTop();
      setVisible(top > threshold);
    };

    // window + container 둘 다 감지
    window.addEventListener("scroll", handleScroll);
    if (container) {
      container.addEventListener("scroll", handleScroll);
    }

    // 처음 진입 시 한 번 상태 반영
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (container) {
        container.removeEventListener("scroll", handleScroll);
      }
    };
  }, [scrollTargetSelector, threshold, location.pathname]);

  const handleScrollTop = () => {
    const container = document.querySelector(scrollTargetSelector);

    if (container && container.scrollHeight > container.clientHeight) {
      // container가 실제로 스크롤되는 경우
      container.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      // 그게 아니면 window 기준
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  if (!visible) return null;

  return (
    <button
      type="button"
      className="home-top-button"
      onClick={handleScrollTop}
      aria-label="맨 위로 이동"
    >
      <img src={arrowIcon} alt="" className="home-top-button__icon" />
    </button>
  );
}

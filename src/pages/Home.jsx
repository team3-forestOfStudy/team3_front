// src/pages/Home.jsx
import { useEffect, useState } from "react";
import RecentViewedList from "../components/RecentViewedList.jsx";
import StudyBrowse from "../components/StudyBrowse.jsx";
import arrowIcon from "../assets/icons/arrow.svg";
import "../styles/home.css";

export default function Home() {
  const [showTopButton, setShowTopButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // 스크롤이 어느 정도 내려갔을 때만 버튼 보이게
      setShowTopButton(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // 첫 렌더링 시 상태 한번 초기화
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="container" id="container">
      <div className="contents">
        {/* 최근 조회한 스터디 섹션 */}
        <RecentViewedList />

        {/* 스터디 둘러보기 섹션 */}
        <StudyBrowse />
      </div>

      {showTopButton && (
        <button
          type="button"
          className="home-top-button"
          onClick={handleScrollTop}
          aria-label="맨 위로 이동"
        >
          <img src={arrowIcon} alt="" className="home-top-button__icon" />
        </button>
      )}
    </div>
  );
}

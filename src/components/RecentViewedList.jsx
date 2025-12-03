import { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import StudyCard from "../components/StudyCard";
import StudyCardSkeleton from "../components/StudyCardSkeleton";
import {
  getRecentViewedStudies,
  removeRecentViewedStudy,
} from "../utils/recentViewed";
import arrowIcon from "../assets/icons/arrow.svg";

const RECENT_SKELETON_COUNT = 3;

export default function RecentViewedList() {
  const [studies, setStudies] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  const containerRef = useRef(null);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);
  const dragMovedRef = useRef(false);

  // 🔥 최근 조회 쿠키 → 최신 데이터로 동기화하는 함수
  async function syncRecentViewed() {
    const recent = getRecentViewedStudies();

    if (!recent || recent.length === 0) {
      setStudies([]);
      return;
    }

    const results = await Promise.all(
      recent.map(async item => {
        try {
          const res = await fetch(
            `https://team3-forest-study-backend.onrender.com/api/studies/${item.studyId}`,
          );

          if (!res.ok) {
            throw new Error("deleted or not found");
          }

          const json = await res.json();
          // ✅ 최신 데이터로 교체해서 렌더에 사용
          return json.data;
        } catch (error) {
          // ❌ 삭제되었거나 오류 → 쿠키에서도 제거
          removeRecentViewedStudy(item.studyId);
          return null;
        }
      }),
    );

    const alive = results.filter(Boolean);
    setStudies(alive);
  }

  // 첫 로딩 + 경로 변경 시 동기화 실행
  useEffect(() => {
    setLoading(true);
    syncRecentViewed().finally(() => setLoading(false));
  }, [location.pathname]);

  // -------------------------------
  // 스크롤 / 화살표 / 드래그 관련
  // -------------------------------

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollButtons = () => {
    const el = containerRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    const epsilon = 1; // 오차 허용치

    setCanScrollLeft(scrollLeft > epsilon);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - epsilon);
  };

  useEffect(() => {
    updateScrollButtons();
  }, [studies.length]);

  const scrollByPage = direction => {
    const scroller = containerRef.current;
    if (!scroller) return;

    const firstCard = scroller.querySelector(".study-card");
    if (!firstCard) return;

    const cardWidth = firstCard.getBoundingClientRect().width;
    const gap = 24; // CSS gap 값과 맞추기

    const width = window.innerWidth;
    const cardsPerPage = width <= 600 ? 1 : width <= 1200 ? 2 : 3;

    // 카드 n개 + 사이 gap (n-1개) 만큼 이동
    const step = cardWidth * cardsPerPage + gap * (cardsPerPage - 1);

    const current = scroller.scrollLeft;
    const maxScroll = scroller.scrollWidth - scroller.clientWidth;

    const rawTarget = direction === "left" ? current - step : current + step;

    const clamped = Math.max(0, Math.min(rawTarget, maxScroll));

    scroller.scrollTo({ left: clamped, behavior: "smooth" });
    setTimeout(updateScrollButtons, 300);
  };

  // 드래그 스크롤
  const handleMouseDown = e => {
    if (!containerRef.current) return;
    isDraggingRef.current = true;
    dragMovedRef.current = false;
    startXRef.current = e.pageX - containerRef.current.offsetLeft;
    scrollLeftRef.current = containerRef.current.scrollLeft;

    const handleMouseUp = () => {
      isDraggingRef.current = false;
      window.removeEventListener("mouseup", handleMouseUp);
    };

    window.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = e => {
    if (!isDraggingRef.current || !containerRef.current) return;
    e.preventDefault();
    const x = e.pageX - containerRef.current.offsetLeft;
    const walk = x - startXRef.current;
    if (Math.abs(walk) > 10) dragMovedRef.current = true;
    containerRef.current.scrollLeft = scrollLeftRef.current - walk;
  };

  const handleClickCapture = e => {
    if (dragMovedRef.current) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  const handleScroll = () => {
    updateScrollButtons();
  };

  const hasCards = studies.length > 0;

  return (
    <section className="home-section home-section--recent">
      <h2 className="g_tit">최근 조회한 스터디</h2>

      {loading ? (
        <div className="recent-scroller-wrapper">
          <div className="recent-viewport">
            <div className="recent-scroller">
              <div className="study-card-list study-card-list--recent">
                {Array.from({ length: RECENT_SKELETON_COUNT }).map((_, i) => (
                  <StudyCardSkeleton key={i} />
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : hasCards ? (
        <div className="recent-scroller-wrapper">
          <button
            type="button"
            className="recent-arrow recent-arrow--left"
            disabled={!canScrollLeft}
            onClick={() => scrollByPage("left")}
          >
            <img src={arrowIcon} alt="prev" />
          </button>

          {/* 🔹 새로 추가된 뷰포트: 정확히 이 안에서만 카드가 보이도록 마스크 역할 */}
          <div className="recent-viewport">
            <div
              className="recent-scroller"
              ref={containerRef}
              onScroll={handleScroll}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onClickCapture={handleClickCapture}
            >
              <div className="study-card-list study-card-list--recent">
                {studies.map(study => (
                  <StudyCard key={study.studyId} study={study} />
                ))}
              </div>
            </div>
          </div>

          <button
            type="button"
            className="recent-arrow recent-arrow--right"
            disabled={!canScrollRight}
            onClick={() => scrollByPage("right")}
          >
            <img src={arrowIcon} alt="next" />
          </button>
        </div>
      ) : (
        <p>아직 조회한 스터디가 없어요</p>
      )}
    </section>
  );
}

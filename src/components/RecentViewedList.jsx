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

  // 🔥🔥 최근 조회 쿠키 → 최신 데이터로 동기화하는 함수
  async function syncRecentViewed() {
    // 1. 쿠키에 저장된 최근 조회 리스트
    const recent = getRecentViewedStudies();

    if (!recent || recent.length === 0) {
      setStudies([]);
      return;
    }

    // 2. 각 studyId에 대해 최신 데이터 조회
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

          // ✅ 최신 데이터로 교체해서 렌더에는 사용
          return json.data;
        } catch (error) {
          // ❌ 삭제되었거나 오류 → 쿠키에서도 제거
          removeRecentViewedStudy(item.studyId);
          return null;
        }
      }),
    );

    // 3. 살아있는 스터디만 상태에 반영
    const alive = results.filter(Boolean);
    setStudies(alive);

    // ❗ 여기서 더 이상 쿠키를 덮어쓰지 않는다
    //    (새로 클릭해서 추가된 항목은 recentViewed.js가 관리)
  }

  // 첫 로딩 시 동기화 실행
  useEffect(() => {
    setLoading(true);
    syncRecentViewed().finally(() => setLoading(false));
  }, [location.pathname]);

  // -------------------------------
  // (아래는 기존 드래그, 화살표 로직 그대로)
  // -------------------------------

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  useEffect(() => {
    updateScrollButtons();
  }, [studies.length]);

  const updateScrollButtons = () => {
    const el = containerRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    const epsilon = 1; // 오차 허용치

    setCanScrollLeft(scrollLeft > epsilon);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - epsilon);
  };

  const scrollByPage = direction => {
    const scroller = containerRef.current;
    if (!scroller) return;

    // 현재 보이는 영역(뷰포트)의 너비
    const viewportWidth = scroller.clientWidth;
    if (!viewportWidth) return;

    const current = scroller.scrollLeft;
    const maxScroll = scroller.scrollWidth - viewportWidth;

    // 왼쪽 / 오른쪽으로 한 페이지씩 이동
    const delta = direction === "left" ? -viewportWidth : viewportWidth;
    const rawTarget = current + delta;

    // 페이지 단위로 스냅
    const snapped = Math.round(rawTarget / viewportWidth) * viewportWidth;

    // 0 ~ maxScroll 사이로 고정
    const clamped = Math.max(0, Math.min(snapped, maxScroll));

    scroller.scrollTo({ left: clamped, behavior: "smooth" });
    setTimeout(updateScrollButtons, 300);
  };

  // 드래그 스크롤
  const handleMouseDown = e => {
    isDraggingRef.current = true;
    dragMovedRef.current = false;
    startXRef.current = e.pageX - containerRef.current.offsetLeft;
    scrollLeftRef.current = containerRef.current.scrollLeft;
    window.addEventListener("mouseup", () => {
      isDraggingRef.current = false;
    });
  };

  const handleMouseMove = e => {
    if (!isDraggingRef.current) return;
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
          <div className="recent-scroller">
            <div className="study-card-list study-card-list--recent">
              {Array.from({ length: RECENT_SKELETON_COUNT }).map((_, i) => (
                <StudyCardSkeleton key={i} />
              ))}
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

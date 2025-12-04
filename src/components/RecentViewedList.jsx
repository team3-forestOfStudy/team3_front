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

  // 현재 몇 번째 페이지(0,1,2...)인지 추적
  const [pageIndex, setPageIndex] = useState(0);

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
          return json.data; // ✅ 최신 데이터
        } catch (error) {
          removeRecentViewedStudy(item.studyId); // ❌ 삭제/오류 시 쿠키에서도 제거
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
    setPageIndex(0); // 페이지 인덱스도 초기화
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
    const epsilon = 1;

    setCanScrollLeft(scrollLeft > epsilon);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - epsilon);
  };

  useEffect(() => {
    updateScrollButtons();
    setPageIndex(0); // 카드 개수가 바뀌면 첫 페이지로
  }, [studies.length]);

  // 캐러셀 새로 제작
  const GAP = 24; // CSS gap 값과 반드시 동일해야 함

  const scrollByPage = direction => {
    const scroller = containerRef.current;
    if (!scroller) return;

    const firstCard = scroller.querySelector(".study-card");
    if (!firstCard) return;

    const cardWidth = firstCard.getBoundingClientRect().width;

    const width = window.innerWidth;
    const cardsPerPage = width <= 600 ? 1 : width <= 1200 ? 2 : 3;

    // 카드 하나 + gap 하나의 거리
    const stepPerCard = cardWidth + GAP;

    // 한 페이지(묶음) 이동 거리 = (카드 + gap) * 카드 수
    const step = stepPerCard * cardsPerPage;

    // 전체 페이지 수 (0 ~ maxPage)
    const maxPage = Math.max(0, Math.ceil(studies.length / cardsPerPage) - 1);

    const nextIndex =
      direction === "left"
        ? Math.max(0, pageIndex - 1)
        : Math.min(maxPage, pageIndex + 1);

    // 🔥 항상 "페이지의 시작 카드" 위치로만 이동
    const target = nextIndex * step;

    const maxScroll = scroller.scrollWidth - scroller.clientWidth;
    const clamped = Math.max(0, Math.min(target, maxScroll));

    scroller.scrollTo({ left: clamped, behavior: "smooth" });
    setPageIndex(nextIndex);
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

          {/* 🔹 정확히 이 영역만 보이도록 마스크 */}
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
                  <StudyCard
                    key={study.studyId}
                    study={study}
                    hoverVariant="lift"
                  />
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

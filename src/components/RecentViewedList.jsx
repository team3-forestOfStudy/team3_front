import { useEffect, useState, useRef } from "react";
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

  const containerRef = useRef(null);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);
  const dragMovedRef = useRef(false);

  // 🔥🔥 최근 조회 쿠키 → 최신 데이터로 동기화하는 함수
  async function syncRecentViewed() {
    const recent = getRecentViewedStudies();

    const results = await Promise.all(
      recent.map(async item => {
        try {
          const res = await fetch(
            `http://localhost:4000/api/studies/${item.studyId}`,
          );
          if (!res.ok) throw new Error("deleted or not found");

          const json = await res.json();
          return json.data; // 최신 스터디 데이터 반환
        } catch (e) {
          // 삭제된 스터디 → 쿠키에서도 제거
          removeRecentViewedStudy(item.studyId);
          return null;
        }
      }),
    );

    const filtered = results.filter(Boolean);
    setStudies(filtered);

    // 쿠키도 최신 상태로 갱신
    document.cookie = `recentStudies=${encodeURIComponent(
      JSON.stringify(filtered),
    )}; path=/; max-age=${7 * 86400}`;
  }

  // 첫 로딩 시 동기화 실행
  useEffect(() => {
    syncRecentViewed().finally(() => setLoading(false));
  }, []);

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
    setCanScrollLeft(scrollLeft > 5);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 5);
  };

  const scrollByPage = direction => {
    const scroller = containerRef.current;
    if (!scroller) return;

    const firstCard = scroller.querySelector(".study-card");
    if (!firstCard) return;

    const cardWidth = firstCard.getBoundingClientRect().width;
    const gap = 16;

    const width = window.innerWidth;
    let cardsPerPage = width <= 600 ? 1 : width <= 1200 ? 2 : 3;

    const step = (cardWidth + gap) * cardsPerPage;
    const current = scroller.scrollLeft;
    const target = direction === "left" ? current - step : current + step;

    scroller.scrollTo({ left: target, behavior: "smooth" });
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

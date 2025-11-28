import { useEffect, useState, useRef } from 'react';
import StudyCard from '../components/StudyCard';
import { getRecentViewedStudies } from '../utils/recentViewed';
import arrowIcon from '../assets/icons/arrow.svg';

export default function RecentViewedList() {
  const [studies, setStudies] = useState([]);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const containerRef = useRef(null);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);
  const dragMovedRef = useRef(false);

  useEffect(() => {
    const data = getRecentViewedStudies();
    setStudies(data);
  }, []);

  useEffect(() => {
    // 카드가 로드된 뒤 버튼 상태 업데이트
    updateScrollButtons();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [studies.length]);

  const hasCards = studies.length > 0;

  const updateScrollButtons = () => {
    const el = containerRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;

    setCanScrollLeft(scrollLeft > 5);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 5);
  };

  // 한 화면(현재 박스 너비)만큼 스크롤
  const scrollByPage = direction => {
    const el = containerRef.current;
    if (!el) return;

    const amount = el.clientWidth; // recent_box 안에서 한 화면 너비
    const left = direction === 'left' ? -amount : amount;

    el.scrollBy({
      left,
      behavior: 'smooth',
    });
  };

  // 마우스로 드래그 스크롤
  const handleMouseDown = e => {
    if (!containerRef.current) return;
    isDraggingRef.current = true;
    dragMovedRef.current = false;
    startXRef.current = e.pageX - containerRef.current.offsetLeft;
    scrollLeftRef.current = containerRef.current.scrollLeft;
  };

  const handleMouseMove = e => {
    if (!isDraggingRef.current || !containerRef.current) return;
    e.preventDefault();
    const x = e.pageX - containerRef.current.offsetLeft;
    const walk = x - startXRef.current;

    if (Math.abs(walk) > 5) {
      dragMovedRef.current = true;
    }

    containerRef.current.scrollLeft = scrollLeftRef.current - walk;
    updateScrollButtons();
  };

  const handleMouseUpOrLeave = () => {
    isDraggingRef.current = false;
  };

  // 터치로 드래그 스크롤
  const handleTouchStart = e => {
    if (!containerRef.current || e.touches.length === 0) return;
    const touch = e.touches[0];
    isDraggingRef.current = true;
    dragMovedRef.current = false;
    startXRef.current = touch.pageX - containerRef.current.offsetLeft;
    scrollLeftRef.current = containerRef.current.scrollLeft;
  };

  const handleTouchMove = e => {
    if (
      !isDraggingRef.current ||
      !containerRef.current ||
      e.touches.length === 0
    )
      return;
    const touch = e.touches[0];
    const x = touch.pageX - containerRef.current.offsetLeft;
    const walk = x - startXRef.current;

    if (Math.abs(walk) > 5) {
      dragMovedRef.current = true;
    }

    containerRef.current.scrollLeft = scrollLeftRef.current - walk;
    updateScrollButtons();
  };

  const handleTouchEnd = () => {
    isDraggingRef.current = false;
  };

  // 드래그 후 발생하는 클릭 막기
  const handleClickCapture = e => {
    if (dragMovedRef.current) {
      e.preventDefault();
      e.stopPropagation();
      dragMovedRef.current = false;
    }
  };

  const handleScroll = () => {
    updateScrollButtons();
  };

  return (
    <section className="home-section home-section--recent">
      <h2 className="g_tit">최근 조회한 스터디</h2>

      {hasCards ? (
        <div className="recent-scroller-wrapper">
          {/* 왼쪽 화살표 (PC/태블릿 전용, 모바일에서는 CSS로 숨김) */}
          <button
            type="button"
            className="recent-arrow recent-arrow--left"
            onClick={() => scrollByPage('left')}
            disabled={!canScrollLeft}
          >
            <img src={arrowIcon} alt="이전 스터디" />
          </button>

          <div
            className="recent-scroller"
            ref={containerRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUpOrLeave}
            onMouseLeave={handleMouseUpOrLeave}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onClickCapture={handleClickCapture}
            onScroll={handleScroll}
          >
            <div className="study-card-list study-card-list--recent">
              {studies.map(study => (
                <StudyCard key={study.studyId} study={study} />
              ))}
            </div>
          </div>

          {/* 오른쪽 화살표 */}
          <button
            type="button"
            className="recent-arrow recent-arrow--right"
            onClick={() => scrollByPage('right')}
            disabled={!canScrollRight}
          >
            <img src={arrowIcon} alt="다음 스터디" />
          </button>
        </div>
      ) : (
        <div className="home-section-empty home-section-empty--recent">
          <p>아직 조회한 스터디가 없어요</p>
        </div>
      )}
    </section>
  );
}

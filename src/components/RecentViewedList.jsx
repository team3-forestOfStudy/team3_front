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

  // 🔥 전역(mouseup / touchend)에서 드래그 강제 종료
  const handleWindowMouseUp = () => {
    isDraggingRef.current = false;
    window.removeEventListener('mouseup', handleWindowMouseUp);
  };

  const handleWindowTouchEnd = () => {
    isDraggingRef.current = false;
    window.removeEventListener('touchend', handleWindowTouchEnd);
    window.removeEventListener('touchcancel', handleWindowTouchEnd);
  };

  // 한 화면(현재 박스 너비)만큼 스크롤
  // 한 화면(카드 개수 기준)만큼 스크롤
  const scrollByPage = direction => {
    const scroller = containerRef.current;
    if (!scroller) return;

    const listEl = scroller.querySelector('.study-card-list');
    const firstCard = listEl?.querySelector('.study-card');
    if (!firstCard) return;

    const cardRect = firstCard.getBoundingClientRect();
    const cardWidth = cardRect.width;

    // CSS에서 gap: 16px 로 맞춰둔 값
    const gap = 16;

    // 화면 크기에 따라 한 페이지에 보여줄 카드 개수
    let cardsPerPage = 3; // 기본: 데스크탑
    const width = window.innerWidth;

    if (width <= 1200 && width > 600) {
      cardsPerPage = 2; // 태블릿
    } else if (width <= 600) {
      cardsPerPage = 1; // 모바일 (사실 화살표 안 보이지만 일단 맞춰둠)
    }

    const step = (cardWidth + gap) * cardsPerPage;

    const current = scroller.scrollLeft;
    const target = direction === 'left' ? current - step : current + step;

    const maxScroll = scroller.scrollWidth - scroller.clientWidth;
    const clamped = Math.max(0, Math.min(target, maxScroll));

    scroller.scrollTo({
      left: clamped,
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

    // ✅ 화면 어디서 마우스를 떼든 드래그 종료
    window.addEventListener('mouseup', handleWindowMouseUp);
  };

  const handleMouseMove = e => {
    if (!isDraggingRef.current || !containerRef.current) return;
    e.preventDefault();
    const x = e.pageX - containerRef.current.offsetLeft;
    const walk = x - startXRef.current;

    if (Math.abs(walk) > 10) {
      dragMovedRef.current = true;
    }

    containerRef.current.scrollLeft = scrollLeftRef.current - walk;
    updateScrollButtons();
  };

  const handleMouseUpOrLeave = () => {
    // 영역 안에서 떼면 여기서도 종료
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

    // ✅ 터치도 화면 어디서 떼든 종료
    window.addEventListener('touchend', handleWindowTouchEnd);
    window.addEventListener('touchcancel', handleWindowTouchEnd);
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
    // 영역 안에서 떼면 여기서도 종료 (window 쪽에서도 한 번 더 정리)
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

  // 컴포넌트 언마운트 시 혹시 남아있을 리스너 정리
  useEffect(() => {
    return () => {
      window.removeEventListener('mouseup', handleWindowMouseUp);
      window.removeEventListener('touchend', handleWindowTouchEnd);
      window.removeEventListener('touchcancel', handleWindowTouchEnd);
    };
  }, []);

  return (
    <section className="home-section home-section--recent">
      <h2 className="g_tit">최근 조회한 스터디</h2>

      {hasCards ? (
        <div className="recent-scroller-wrapper">
          {/* 왼쪽 화살표 (PC/태블릿, 모바일은 CSS에서 display:none) */}
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

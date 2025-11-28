// src/components/RecentViewedList.jsx (또는 현재 경로)
import { useEffect, useState, useRef } from 'react';
import StudyCard from '../components/StudyCard';
import { getRecentViewedStudies } from '../utils/recentViewed';

export default function RecentViewedList() {
  const [studies, setStudies] = useState([]);

  const containerRef = useRef(null);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);
  const dragMovedRef = useRef(false); // 드래그할때 클릭되는거 방지 목적

  useEffect(() => {
    const data = getRecentViewedStudies();
    setStudies(data);
  }, []);

  const hasCards = studies.length > 0;

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
      // 5px 이상 움직였으면 드래그로 간주
      dragMovedRef.current = true;
    }

    containerRef.current.scrollLeft = scrollLeftRef.current - walk;
  };

  const handleMouseUpOrLeave = () => {
    isDraggingRef.current = false;
  };

  // 터치로 드래그 스크롤
  const handleTouchStart = e => {
    if (!containerRef.current || e.touches.length === 0) return;
    const touch = e.touches[0];
    isDraggingRef.current = true;
    dragMovedRef.current = false; // 클릭 방지 관련 초기화
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
      dragMovedRef.current = true; // 드래그 시 클릭 방지 스와이프 판정
    }

    containerRef.current.scrollLeft = scrollLeftRef.current - walk;
  };

  const handleTouchEnd = () => {
    isDraggingRef.current = false;
  };

  // 방금 움직인 게 드래그였다면, 카드 클릭 막기
  const handleClickCapture = e => {
    if (dragMovedRef.current) {
      e.preventDefault();
      e.stopPropagation();
      dragMovedRef.current = false;
    }
  };

  return (
    <section className="home-section home-section--recent">
      <h2 className="g_tit">최근 조회한 스터디</h2>

      {hasCards ? (
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
          onClickCapture={handleClickCapture} // 드래드할 때 클릭 방지
        >
          <div className="study-card-list study-card-list--recent">
            {studies.map(study => (
              <StudyCard key={study.studyId} study={study} />
            ))}
          </div>
        </div>
      ) : (
        <div className="home-section-empty home-section-empty--recent">
          <p>아직 조회한 스터디가 없어요</p>
        </div>
      )}
    </section>
  );
}

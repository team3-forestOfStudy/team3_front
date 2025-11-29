// StudyCardSkeleton.jsx
export default function StudyCardSkeleton() {
  return (
    <article className="study-card study-card--skeleton">
      <header className="study-card__header">
        <div className="study-card__top-row">
          {/* 제목 자리 */}
          <div className="skeleton skeleton-title" />
          {/* 포인트 배지 자리 */}
          <div className="skeleton skeleton-badge" />
        </div>
        {/* 00일째 진행 중 자리 */}
        <div className="skeleton skeleton-days" />
      </header>

      {/* 설명 텍스트 자리 */}
      <div className="skeleton skeleton-description-line" />
      <div className="skeleton skeleton-description-line short" />

      <footer className="study-card__footer">
        <div className="skeleton skeleton-emoji" />
        <div className="skeleton skeleton-emoji" />
        <div className="skeleton skeleton-emoji" />
      </footer>
    </article>
  );
}

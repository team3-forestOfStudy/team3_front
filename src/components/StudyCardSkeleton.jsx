// StudyCardSkeleton.jsx
import "../styles/studycard.css";

export default function StudyCardSkeleton() {
  return (
    <article className="study-card study-card--skeleton">
      {/* 상단 헤더 – StudyCard와 구조 동일 */}
      <header className="study-card__header">
        <div className="study-card__top-row">
          {/* 제목 자리 */}
          <div className="skeleton skeleton-title" />
          {/* 포인트 배지 자리 */}
          <div className="skeleton skeleton-badge" />
        </div>

        {/* 10일째 진행 중 자리 */}
        <div className="skeleton skeleton-days" />
      </header>

      {/* 소개 텍스트 – StudyCard의 p 구조 그대로 */}
      <p className="study-card__description">
        <span className="skeleton skeleton-description-line" />
        <span className="skeleton skeleton-description-line short" />
      </p>

      {/* 하단 이모지 영역 – StudyCard와 동일한 구조 */}
      <footer className="study-card__footer">
        <div className="study-card__emojis">
          <div className="skeleton skeleton-emoji" />
          <div className="skeleton skeleton-emoji" />
          <div className="skeleton skeleton-emoji" />
        </div>
      </footer>
    </article>
  );
}

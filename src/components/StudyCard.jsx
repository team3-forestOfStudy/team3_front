import '../styles/studycard.css';

export default function StudyCard({ study }) {
  const {
    studyId,
    nickname,
    title,
    description,
    backgroundImage,
    totalPoints,
  } = study;

  return (
    <div className={`study-card bg-${backgroundImage}`}>
      {/* 상단 포인트 뱃지 */}
      <div className="study-card__point-badge">{totalPoints} P 획득</div>

      {/* 제목 */}
      <h3 className="study-card__title">{title}</h3>

      {/* 진행기간 (예: 10일째 진행 중) */}
      <p className="study-card__days">{nickname}</p>

      {/* 소개 */}
      <p className="study-card__description">{description}</p>

      {/* 하단 아이콘 버튼들 */}
      <div className="study-card__icons">
        <span>🔥 37</span>
        <span>💬 26</span>
        <span>❤️ 14</span>
      </div>
    </div>
  );
}

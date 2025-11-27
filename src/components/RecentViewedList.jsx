import StudyCard from '../components/StudyCard';

// 예시 구조
export default function RecentViewedList({ studies = [] }) {
  const hasCards = studies.length > 0;

  return (
    <section className="home-section home-section--recent">
      <h2 className="g_tit">최근 조회한 스터디</h2>

      {hasCards ? (
        <div className="study-card-list">
          {studies.map(study => (
            <StudyCard key={study.studyId} study={study} />
          ))}
        </div>
      ) : (
        <div className="home-section-empty home-section-empty--recent">
          <p>아직 조회한 스터디가 없어요</p>
        </div>
      )}
    </section>
  );
}

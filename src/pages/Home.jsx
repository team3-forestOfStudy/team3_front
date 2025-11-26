// src/pages/Home.jsx
import '../styles/home.css';
import RecentViewedList from '../components/RecentViewedList.jsx';
import StudyBrowse from '../components/StudyBrowse.jsx';

export default function Home() {
  return (
    <div className="container" id="container">
      <div className="contents">
        {/* 최근 조회한 스터디 섹션 */}
        <RecentViewedList />

        {/* 스터디 둘러보기 섹션 */}
        <StudyBrowse />
      </div>
    </div>
  );
}

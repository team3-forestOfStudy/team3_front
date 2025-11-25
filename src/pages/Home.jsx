import "../styles/home.css";
import RecentViewdList from "../components/RecentViewedList.jsx";
import StudyBrowse from "../components/StudyBrowse.jsx";

export default function Home() {
  return (
    <>
      <div className="container" id="container">
        <div className="content">
          <RecentViewdList />
          <StudyBrowse />
        </div>
      </div>
    </>
  );
}

import "../src/styles/Global.css";
// import Ex from "./components/PasswordModal.jsx";
// import Me from "./components/ToastMessagePrint.jsx";
// import ExitModal from "./components/ExitModal.jsx";
// import ListModal from "./components/ListModal.jsx";
import { Route, Routes } from "react-router-dom";
import Header from "./components/UI/Header.jsx";
import Home from "./pages/Home.jsx";
import StudyMake from "./pages/StudyMake.jsx";
import Guide from "./pages/Guide.jsx";
import HobbiesPage from "./pages/HobbiesPage.jsx";
import FocusPage from "./pages/FocusPage.jsx";
import StudyDetailsPage from "./pages/StudyDetailsPage.jsx";

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="study/make" element={<StudyMake />} />
        <Route path="/guide" element={<Guide />} />
        <Route path="/Hobbies" element={<HobbiesPage />} />
        <Route path="/Focus" element={<FocusPage />} />
        <Route path="/Studydetails" element={<StudyDetailsPage />} />
      </Routes>
    </>
  );
}

export default App;

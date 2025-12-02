import "../src/styles/global.css";
import "react-toastify/dist/ReactToastify.css";
import "../src/styles/toast.css";
import { Route, Routes } from "react-router-dom";
import { Bounce, ToastContainer } from "react-toastify";
import Header from "./components/Ui/Header.jsx";

import Home from "./pages/Home.jsx";
import CreateStudyPage from "./pages/CreateStudyPage.jsx";
import EditStudyPage from "./pages/EditStudyPage.jsx";
import Guide from "./pages/Guide.jsx";
import HobbiesPage from "./pages/HobbiesPage.jsx";
import FocusPage from "./pages/FocusPage.jsx";
import StudyDetailsPage from "./pages/StudyDetailsPage.jsx";

function App() {
  return (
    <>
      <ToastContainer
        position="bottom-center"
        autoClose={1000}
        hideProgressBar={true}
        closeButton={false}
        icon={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss={false}
        draggable={false}
        pauseOnHover
        transition={Bounce}
      />
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="study/make" element={<CreateStudyPage />} />
        <Route path="study/edit/:id" element={<EditStudyPage />} />
        <Route path="/guide" element={<Guide />} />
        <Route path="/Studydetails" element={<StudyDetailsPage />} />
        <Route path="/hobbies" element={<HobbiesPage />} />
        <Route path="/Focus" element={<FocusPage />} />
      </Routes>

      {/* <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/study/make" element={<CreateStudyPage />} />
        <Route path="/study/edit/:id" element={<EditStudyPage />} />
        <Route path="/study/:id" element={<StudyDetailsPage />} />
        <Route path="/study/:id/hobbies" element={<HobbiesPage />} />
        <Route path="/study/:id/Focus" element={<FocusPage />} />
        <Route path="/guide" element={<Guide />} />
      </Routes> */}
    </>
  );
}

export default App;

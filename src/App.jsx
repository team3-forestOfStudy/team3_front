import '../src/styles/global.css';
import 'react-toastify/dist/ReactToastify.css';
import '../src/styles/toast.css';
import { Route, Routes } from 'react-router-dom';
import Header from './components/Ui/Header.jsx';
import Home from './pages/Home.jsx';
import Guide from './pages/Guide.jsx';
import HobbiesPage from './pages/HobbiesPage.jsx';
import FocusPage from './pages/FocusPage.jsx';
import StudyDetailsPage from './pages/StudyDetailsPage.jsx';
import { Bounce, ToastContainer } from 'react-toastify';

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
        <Route path="study/edit/:ide" element={<EditStudyPage />} />
        <Route path="/guide" element={<Guide />} />
        <Route path="/Hobbies" element={<HobbiesPage />} />
        <Route path="/Focus" element={<FocusPage />} />
        <Route path="/Studydetails" element={<StudyDetailsPage />} />
      </Routes>
    </>
  );
}

export default App;

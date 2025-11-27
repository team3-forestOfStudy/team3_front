import '../src/styles/global.css';
import 'react-toastify/dist/ReactToastify.css';
import '../src/styles/toast.css';
import { Route, Routes } from 'react-router-dom';
import Header from './components/Ui/Header.jsx';
import Home from './pages/Home.jsx';
import StudyMake from './pages/StudyMake.jsx';
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
        <Route path="study/make" element={<StudyMake />} />
        <Route path="/guide" element={<Guide />} />
        <Route path="/Studydetails" element={<StudyDetailsPage />} />
        <Route path="/Hobbies" element={<HobbiesPage />} />
        <Route path="/Focus" element={<FocusPage />} />
      </Routes>
    </>
  );
}

export default App;

import Guide from "./pages/Guide";
import "../src/styles/Global.css";
import Ex from "./components/PasswordModal"
import Me from "./components/ToastMessagePrint.jsx"
import ExitModal from "./components/ExitModal.jsx";
import ListModal from "./components/ListModal.jsx"
import Hobbies from "./pages/HobbiesPage.jsx"

function App() {
  return (
    <div>
      {/* <Guide />
      <Ex />
      <Me />
      <ExitModal />
      <ListModal /> */}
      <Hobbies />
    </div>
  );
}

export default App;

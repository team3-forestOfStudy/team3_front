import Guide from "./pages/Guide";
import "../src/styles/global.css";
import Ex from "./components/PasswordModal.jsx";
import Me from "./components/ToastMessagePrint.jsx";
import ExitModal from "./components/ExitModal.jsx";
import ListModal from "./components/ListModal.jsx";

function App() {
  return (
    <div>
      <Guide />
      <Ex />
      <Me />
      <ExitModal />
      <ListModal />
    </div>
  );
}

export default App;

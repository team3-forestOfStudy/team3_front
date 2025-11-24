import Guide from "./pages/Guide";
import "../src/styles/global.css";
import Ex from "./components/PasswordModal"
import Me from "./components/ToastMessagePrint"
import ExitModal from "./components/ExitModal";
import ListModal from "./components/ListModal"

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

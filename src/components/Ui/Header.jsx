// src/components/header/Header.jsx
import logo from "../../assets/logo.svg";
import { useLocation, useNavigate } from "react-router-dom";
import "../../styles/header.css";
import HeaderButton from "./HeaderButton.jsx";

// 버튼을 "보여줄" 페이지 목록 (그 외는 모두 숨김 처리)
const SHOW_CREATE_BUTTON_PATHS = ["/"];

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const { pathname } = location;

  // 현재 pathname이 SHOW 목록에 포함되면 보이고, 아니면 숨김
  const showCreateButton = SHOW_CREATE_BUTTON_PATHS.includes(pathname);

  const goToStudyMake = () => navigate("/study/make");
  const goToGuide = () => navigate("/guide");
  const goToStudydetails = () => navigate("/Studydetails");
  const goToFocus = () => navigate("/Focus");
  const goToHobbies = () => navigate("/Hobbies");

  return (
    <header className="header bg_gray_50">
      <div className="header-inner">
        {/* 왼쪽: 로고 */}
        <a href="/" className="header-left">
          <img
            src={logo}
            alt="공부의 숲"
            className="header-logo u-hover-logo u-active-logo"
          />
        </a>

        {/* 오른쪽: 스터디 만들기 버튼 */}
        <div className="header-right">
          {showCreateButton && (
            <HeaderButton buttonClass="make_study_btn" onClick={goToStudyMake}>
              스터디 만들기
            </HeaderButton>
          )}
        </div>
      </div>
    </header>
  );
}

import logo from "../../assets/logo.svg";
import { useLocation, useNavigate } from "react-router-dom";
import "../../styles/header.css";
import HeaderButton from "./HeaderButton.jsx";

// 버튼이 숨겨질 페이지 관리용. 주소를 추가/삭제하세요
const HIDE_CREATE_BUTTON_PATHS = [
  "/study/make",
  "/Studydetails",
  "/Hobbies",
  "/Focus",
];

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const { pathname } = location;

  // 헤더 버튼 숨김처리
  const shouldHideCreateButton = HIDE_CREATE_BUTTON_PATHS.includes(pathname);
  const showCreateButton = !shouldHideCreateButton;

  const goToStudyMake = () => {
    navigate("/study/make");
  };

  // 임시 가이드 연결 (삭제 예정)
  const goToGuide = () => {
    navigate("/guide");
  };

  // 임시 스터디 상세 페이지 (삭제 예정)
  const goToStudydetails = () => {
    navigate("/Studydetails");
  };

  // 임시 스터디 집중 페이지 연결 (삭제 예정)
  const goToFocus = () => {
    navigate("/Focus");
  };

  // 임시 스터디 습관 페이지 연결 (삭제 예정)
  const goToHobbies = () => {
    navigate("/Hobbies");
  };

  return (
    <header className="header">
      <a href="/">
        <img src={logo} alt="공부의 숲" className="header-logo" />
      </a>
      <div className="g_button_group">
        <div>
          <HeaderButton buttonClass="temp_button" onClick={goToGuide}>
            가이드 보기(임시)
          </HeaderButton>
          <HeaderButton buttonClass="temp_button" onClick={goToStudydetails}>
            상세 페이지(임시)
          </HeaderButton>
          <HeaderButton buttonClass="temp_button" onClick={goToHobbies}>
            오늘의 습관(임시)
          </HeaderButton>
          <HeaderButton buttonClass="temp_button" onClick={goToFocus}>
            집중 페이지(임시)
          </HeaderButton>
        </div>
        {showCreateButton && (
          <HeaderButton onClick={goToStudyMake}>스터디 만들기</HeaderButton>
        )}
      </div>
    </header>
  );
}

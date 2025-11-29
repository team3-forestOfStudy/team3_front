import logo from '../../assets/logo.svg';
import { useLocation, useNavigate } from 'react-router-dom';
import '../../styles/header.css';
import HeaderButton from './HeaderButton.jsx';

// 버튼이 숨겨질 페이지 관리용. 주소를 추가/삭제하세요
const HIDE_CREATE_BUTTON_PATHS = [
  '/study/make',
  '/Studydetails',
  '/Hobbies',
  '/Focus',
];

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const { pathname } = location;

  const shouldHideCreateButton = HIDE_CREATE_BUTTON_PATHS.includes(pathname);
  const showCreateButton = !shouldHideCreateButton;

  const goToStudyMake = () => navigate('/study/make');
  const goToGuide = () => navigate('/guide');
  const goToStudydetails = () => navigate('/Studydetails');
  const goToFocus = () => navigate('/Focus');
  const goToHobbies = () => navigate('/Hobbies');

  return (
    <header className="header bg_gray_50">
      {/* 왼쪽: 로고 */}
      <a href="/" className="header-left">
        <img src={logo} alt="공부의 숲" className="header-logo" />
      </a>

      {/* 오른쪽: 임시 버튼들 + 스터디 만들기 */}
      <div className="header-right">
        <div className="temp_button_div">
          <button className="temp_button" onClick={goToGuide}>
            가이드
          </button>
          <button className="temp_button" onClick={goToStudydetails}>
            상세 페이지
          </button>
          <button className="temp_button" onClick={goToHobbies}>
            오늘의 습관
          </button>
          <button className="temp_button" onClick={goToFocus}>
            집중 페이지
          </button>
        </div>

        {showCreateButton && (
          <HeaderButton buttonClass="make_study_btn" onClick={goToStudyMake}>
            스터디 만들기
          </HeaderButton>
        )}
      </div>
    </header>
  );
}

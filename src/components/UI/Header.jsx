import logo from "../assets/Logo.svg";
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/header.css";
import HeaderButton from "./HeaderButton";

const HIDE_CREATE_BUTTON_PATHS = ["/study/make"];

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const { pathname } = location;

  const shouldHideCreateButton = HIDE_CREATE_BUTTON_PATHS.includes(pathname);
  const showCreateButton = !shouldHideCreateButton;

  const goToStudyMake = () => {
    console.log("스터디 만들기 클릭"); // 🔹 클릭 확인용
    navigate("/study/make");
  };

  return (
    <header className="header">
      <a href="/">
        <img src={logo} alt="공부의 숲" className="header-logo" />
      </a>

      {showCreateButton && (
        <HeaderButton onClick={goToStudyMake}>스터디 만들기</HeaderButton>
      )}
    </header>
  );
}

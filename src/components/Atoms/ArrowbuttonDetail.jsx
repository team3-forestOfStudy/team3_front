import "../../styles/passwordmodal.css";
import React, { Children, useState } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "./Modal.jsx";
import eyeInvisible from "../../assets/icons/eyes.svg";
import eyeVisible from "../../assets/icons/visible.svg";
import { deleteStudyList, postVerifyStudyList } from "../../utils/testapi.js";
import {
  showErrorToast,
  showPasswordSuccesToast,
} from "../../utils/toastmessage";
import "./arrowbutton.css";
import ArrowRight from "../../assets/icons/arrow.svg";

const PASSWORD_MIN_LENGTH = 6;

export default function PasswordModal({
  children,
  onClose,
  title,
  nickname,
  actionType,
  studyId,
}) {
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleClose = () => {
    setOpen(false);
    if (onClose) onClose();
  };

  const handlemobbies = async e => {
    e.preventDefault();

    if (!password) {
      showErrorToast("🚨 비밀번호를 입력해주세요");
      return;
    }

    if (password.length < PASSWORD_MIN_LENGTH) {
      showErrorToast("🚨 비밀번호6자 이상 입력해주세요");
      return;
    }
    try {
      const result = await postVerifyStudyList(studyId, password);

      if (result.result === "success") {
        showPasswordSuccesToast("😀 오늘의 습관");
        navigate(`/hobbies?studyId=${studyId}`);
      } else {
        showErrorToast(result.message);
      }
    } catch (err) {
      console.error(err);
    }
    //API호출 함수 첨가 가능
  };
  const handlefocus = async e => {
    e.preventDefault();

    if (!password) {
      showErrorToast("🚨 비밀번호를 입력해주세요");
      return;
    }

    if (password.length < PASSWORD_MIN_LENGTH) {
      showErrorToast("🚨 비밀번호6자 이상 입력해주세요");
      return;
    }
    try {
      console.log("수정하기 실행");
      const result = await postVerifyStudyList(studyId, password);

      if (result.result === "success") {
        showPasswordSuccesToast("😀 오늘의 집중");
        navigate(`/focus?studyId=${studyId}`);
      } else {
        showErrorToast(result.message);
      }
    } catch (err) {
      console.error(err);
    }
    //API호출 함수 첨가 가능
  };

  return (
    <>
      {/* 모달열기 버튼 */}
      <button
        onClick={() => setOpen(true)}
        className="g_sub_text09 gray_600 detail_arrow_button"
      >
        {children}
        <span>
          <img src={ArrowRight} alt="" />
        </span>
      </button>

      <Modal isOpen={open} onClose={() => setOpen(false)}>
        <h1 className="g_sub_text01 title modal_title ellips">
          {nickname}의{title}
        </h1>
        <h3 className="g_sub_text07 gray_600 fw_l h3"> 권한이 필요해요!</h3>

        <div>
          <label htmlFor="password" className="g_sub_text07 fw_sb">
            비밀번호
          </label>
          <div className="input-wrapper-study mt15">
            <input
              id="password"
              className="password"
              type={showPassword ? "text" : "password"}
              placeholder="비밀번호를 입력해 주세요"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => {
                if (e.key === "Enter") {
                  actionType === "hobbies" ? handlemobbies(e) : handlefocus(e);
                }
              }}
            />
            <button
              type="button"
              className="password-toggle-button"
              aria-label={showPassword ? "비밀번호 숨기기" : "비밀번호 보기"}
              onClick={() => setShowPassword(prev => !prev)}
            >
              <img
                className="password-toggle-icon"
                src={showPassword ? eyeVisible : eyeInvisible}
                alt={
                  showPassword
                    ? "비밀번호 표시 상태 아이콘"
                    : "비밀번호 숨김 상태 아이콘"
                }
              />
            </button>
          </div>
        </div>

        {actionType === "hobbies" && (
          <button
            className="Button01 w100 mt40"
            type="button"
            onClick={handlemobbies}
          >
            <p className="bg_green_300 fw_l g_sub_text06 p">오늘의습관 가기</p>
          </button>
        )}
        {/* 삭제 버튼 */}
        {actionType === "focus" && (
          <button
            className="Button01 w100 mt40"
            type="button"
            onClick={handlefocus}
          >
            <p className="bg_red_500 fw_l g_sub_text07 p">오늘의집중 가기</p>
          </button>
        )}
        <button className="green_700 exit" onClick={handleClose}>
          나가기
        </button>
      </Modal>
    </>
  );
}

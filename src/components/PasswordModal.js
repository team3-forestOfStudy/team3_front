import "../styles/PasswordModal.css";
import React, { useState } from "react";
import Modal from "./Atoms/Modal.js";
import { Title } from "../mock/Title.js";
import eyeInvisible from "../assets/icons/eyes.svg";
import eyeVisible from "../assets/icons/visible.svg";

const PASSWORD_MIN_LENGTH = 8;

const message = {
  passwordEmpty: "비밀번호를 입력해주세요",
  passwordShort: `비밀번호를 ${PASSWORD_MIN_LENGTH}자 이상을 입력해 주세요.`,
};

export default function PasswordModal({ onClose }) {
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  const handleClose = () => {
    setOpen(false);
    if (onClose) onClose();
  };

  const handleSubmit = () => {
    if (!password) {
      setPasswordError(message.passwordEmpty);
      return;
    }

    if (password.length < PASSWORD_MIN_LENGTH) {
      setPasswordError(message.passwordShort);
      return;
    }

    setPasswordError("");
    //API호출 함수 첨가 가능

    handleClose();
  };

  return (
    <>
      {/* 모달열기 버튼 */}
      <button type="button" onClick={() => setOpen(true)}>
        모달 열기
      </button>

      <Modal isOpen={open} onClose={() => setOpen(false)}>
        <h1 className="g_sub_text01 title">{Title}</h1>
        <button className="green_700 exit" onClick={handleClose}>
          나가기
        </button>
        <h3 className="g_sub_text03 gray_600 fw_l h3"> 권한이 필요해요!</h3>

        <div>
          <label htmlFor="password" className="g_sub_text05 fw_l">
            비밀번호
          </label>
          <div className="input-wrapper">
            <input
              id="password"
              className="password"
              type={showPassword ? "text" : "password"}
              placeholder="비밀번호를 입력해 주세요"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              className="password-toggle-button"
              aria-label={showPassword ? "비밀번호 숨기기" : "비밀번호 보기"}
              onClick={() => setShowPassword((prev) => !prev)}
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

        <button className="Button01 w100" type="button" onClick={handleSubmit}>
          <p className="bg_green_300 g_sub_text03 p">수정하러가기</p>
        </button>
      </Modal>
    </>
  );
}

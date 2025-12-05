// src/components/LabelInput.jsx
import { useState, useEffect, useRef } from "react";
import icSearch from "../assets/icons/search.svg";
import icVisibleOn from "../assets/icons/visible.svg";
import icVisibleOff from "../assets/icons/eyes.svg";
import "../styles/labelinput.css";

// 글자수 제한 상수들
import {
  NICKNAME_MIN,
  NICKNAME_MAX,
  STUDY_NAME_MIN,
  STUDY_NAME_MAX,
  INTRO_MIN,
  INTRO_MAX,
  PASSWORD_MIN,
  PASSWORD_MAX,
} from "../utils/validation.js";

export default function LabelInput({
  label,
  placeholder,
  type = "text", // "text" | "password" ...
  as = "input", // "input" | "textarea"
  value,
  onChange,
  errorType, // "", "empty", "nicknameTooShort" ...
  icon, // "search" | undefined
  showCount = false,
  autoResize = false,
  ...rest
}) {
  const [visible, setVisible] = useState(false);
  const textareaRef = useRef(null);

  useEffect(() => {
    if (as === "textarea" && autoResize && textareaRef.current) {
      const el = textareaRef.current;
      el.style.height = "auto"; // 높이 초기화
      el.style.height = `${el.scrollHeight}px`; // 내용만큼 다시 설정
    }
  }, [value, as, autoResize]);

  const errorMessage = {
    // 공통
    empty: "* 필수 입력사항입니다.",

    // 닉네임
    nicknameTooShort: `닉네임은 최소 ${NICKNAME_MIN}글자 이상 입력해야 합니다.`,
    nicknameTooLong: `닉네임은 최대 ${NICKNAME_MAX}글자 이하로 입력해야 합니다.`,

    // 스터디 이름
    studyNameTooShort: `스터디 이름은 최소 ${STUDY_NAME_MIN}글자 이상 입력해야 합니다.`,
    studyNameTooLong: `스터디 이름은 최대 ${STUDY_NAME_MAX}글자 이하로 입력해야 합니다.`,

    // 소개
    introTooShort: `소개는 최소 ${INTRO_MIN}글자 이상 입력해야 합니다.`,
    introTooLong: `소개는 최대 ${INTRO_MAX}글자 이하로 입력해야 합니다.`,

    // 비밀번호
    passwordTooShort: `비밀번호는 최소 ${PASSWORD_MIN}글자 이상 입력해야 합니다.`,
    passwordTooLong: `비밀번호는 최대 ${PASSWORD_MAX}글자 이하로 입력해야 합니다.`,
    noNumber: "최소 1개의 숫자가 포함되어야 합니다.",
    noSpecial: "최소 1개의 특수 문자가 포함되어야 합니다.",
    notMatch: "비밀번호가 일치하지 않습니다.",

    // 혹시 남아있을 수 있는 기존 invalid에 대한 안전장치
    invalid: "잘못된 입력입니다.",
  }[errorType];

  const isPassword = type === "password";
  const showSearchIcon = icon === "search" && !isPassword;

  // 🔹 wrapper 클래스 한 번에 구성
  const wrapperClassName = [
    "input-wrapper-study",
    showSearchIcon ? "input-wrapper--search" : "",
    isPassword ? "input-wrapper--password" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="input-group">
      <div className="label-row">
        {label && <h3 className="g_sub_tit">{label}</h3>}

        {/* 글자 수 카운트 ( ) 형식 */}
        {showCount && typeof rest.maxLength === "number" && (
          <span className="label-char-count g_sub_text13 gray_500">
            ( {(value ?? "").length} / {rest.maxLength} )
          </span>
        )}
      </div>

      <div className={wrapperClassName}>
        {/* 검색 아이콘 (왼쪽) */}
        {showSearchIcon && (
          <img
            src={icSearch}
            alt="검색"
            className="input-icon input-icon--left"
          />
        )}

        {/* 소개 input / textarea */}
        {as === "textarea" ? (
          <textarea
            ref={autoResize ? textareaRef : null}
            className={`textarea-basic ${errorType ? "input-basic--error" : ""}`}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            style={
              autoResize ? { minHeight: "120px", resize: "none" } : undefined
            }
            {...rest}
          />
        ) : (
          <input
            {...rest}
            type={isPassword && !visible ? "password" : "text"}
            className={`input-basic ${errorType ? "input-basic--error" : ""}`}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
          />
        )}

        {/* 비밀번호 아이콘 (오른쪽) */}
        {isPassword && (
          <button
            type="button"
            className="eye-btn"
            onClick={() => setVisible(v => !v)}
          >
            <img
              src={visible ? icVisibleOn : icVisibleOff}
              alt={visible ? "비밀번호 숨기기" : "비밀번호 보이기"}
            />
          </button>
        )}
      </div>

      {errorMessage && (
        <p className="red_800 g_sub_text13 mt5">{errorMessage}</p>
      )}
    </div>
  );
}

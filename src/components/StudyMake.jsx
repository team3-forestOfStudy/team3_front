// StudyMake.jsx
import "../styles/studymake.css";
import { useState } from "react";
import ButtonType from "../components/ButtonType.jsx";
import StudyBackgroundSelector from "../components/StudyBackgroundSelector.jsx";
import LabelInput from "../components/LabelInput.jsx";
import {
  validateNickname,
  validateStudyName,
  validateIntro,
  validatePassword,
  validatePasswordCheck,
  NICKNAME_MAX,
  STUDY_NAME_MAX,
  INTRO_MAX,
  PASSWORD_MAX,
} from "../utils/validation.js";

export default function StudyMake({
  mode = "create",
  initialData = null,
  onSubmit,
}) {
  const isEditMode = mode === "edit";

  const [form, setForm] = useState({
    nickname: initialData?.nickname ?? "",
    studyName: initialData?.studyName ?? "",
    intro: initialData?.intro ?? "",
    // 생성 모드에서만 의미 있는 값, 수정 모드에서는 UI에 안 보임
    password: "",
    passwordCheck: "",
    selectedBg: initialData?.selectedBg ?? null,
  });

  const [errors, setErrors] = useState({
    nickname: "",
    studyName: "",
    intro: "",
    password: "",
    passwordCheck: "",
  });

  const handleChange = field => e => {
    const value = e.target.value;

    setForm(prev => ({
      ...prev,
      [field]: value,
    }));

    let errorMsg = "";
    switch (field) {
      case "nickname":
        errorMsg = validateNickname(value);
        break;
      case "studyName":
        errorMsg = validateStudyName(value);
        break;
      case "intro":
        errorMsg = validateIntro(value);
        break;
      case "password":
        errorMsg = validatePassword(value);
        break;
      case "passwordCheck":
        errorMsg = validatePasswordCheck(value, form.password);
        break;
      default:
        break;
    }

    setErrors(prev => ({
      ...prev,
      [field]: errorMsg,
    }));

    if (field === "password") {
      setErrors(prev => ({
        ...prev,
        passwordCheck: validatePasswordCheck(form.passwordCheck, value),
      }));
    }
  };

  const handleBgSelect = bgValue => {
    setForm(prev => ({
      ...prev,
      selectedBg: bgValue,
    }));
  };

  // 공통 필드 유효성
  const baseValid =
    form.nickname &&
    form.studyName &&
    form.intro &&
    form.selectedBg !== null &&
    !errors.nickname &&
    !errors.studyName &&
    !errors.intro;

  let isFormValid = false;

  if (isEditMode) {
    // 수정 모드: 비밀번호는 필요 없음
    isFormValid = baseValid;
  } else {
    // 생성 모드: 비밀번호 필수
    const passwordValid =
      form.password &&
      form.passwordCheck &&
      !errors.password &&
      !errors.passwordCheck;

    isFormValid = baseValid && passwordValid;
  }

  const handleSubmit = e => {
    e.preventDefault();
    if (!isFormValid) return;

    const payload = {
      nickname: form.nickname,
      studyName: form.studyName,
      intro: form.intro,
      selectedBg: form.selectedBg,
      ...(isEditMode
        ? {} // 수정 모드에서는 비밀번호 안 보냄
        : {
            password: form.password,
            passwordCheck: form.passwordCheck,
          }),
    };

    if (onSubmit) onSubmit(payload);
  };

  const titleText = isEditMode ? "스터디 수정하기" : "스터디 만들기";
  const buttonText = isEditMode ? "수정 완료" : "스터디 생성";

  return (
    <div className="container" id="container">
      <div className="contents">
        <form className="studymake-box" onSubmit={handleSubmit}>
          <h2 className="g_tit">{titleText}</h2>

          <LabelInput
            label="닉네임"
            placeholder="닉네임을 입력해주세요"
            value={form.nickname}
            onChange={handleChange("nickname")}
            errorType={errors.nickname}
            maxLength={NICKNAME_MAX}
          />

          <LabelInput
            label="스터디 이름"
            placeholder="스터디 이름을 입력해주세요"
            value={form.studyName}
            onChange={handleChange("studyName")}
            errorType={errors.studyName}
            maxLength={STUDY_NAME_MAX}
          />

          <LabelInput
            label="소개"
            placeholder="소개 멘트를 작성해 주세요"
            value={form.intro}
            onChange={handleChange("intro")}
            errorType={errors.intro}
            maxLength={INTRO_MAX}
          />

          <h3 className="g_sub_tit mt20">배경을 선택해주세요</h3>
          <StudyBackgroundSelector
            selectedBg={form.selectedBg}
            onSelect={handleBgSelect}
          />

          {/* 생성 모드에서만 비밀번호 입력칸 보이게 */}
          {!isEditMode && (
            <>
              <LabelInput
                label="비밀번호"
                type="password"
                placeholder="비밀번호를 입력해 주세요"
                value={form.password}
                onChange={handleChange("password")}
                errorType={errors.password}
                maxLength={PASSWORD_MAX}
              />

              <LabelInput
                label="비밀번호 확인"
                type="password"
                placeholder="비밀번호를 다시 입력해 주세요"
                value={form.passwordCheck}
                onChange={handleChange("passwordCheck")}
                errorType={errors.passwordCheck}
                maxLength={PASSWORD_MAX}
              />
            </>
          )}

          <ButtonType
            buttonText={buttonText}
            buttonClass={
              isFormValid
                ? "w100 mt40 u-hover-style-01 u-active-press"
                : "w100 mt40 bg_gray_300 shadowGray"
            }
            disabled={!isFormValid}
          >
            {buttonText}
          </ButtonType>
        </form>
      </div>
    </div>
  );
}

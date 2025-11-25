import "../styles/studymake.css";
import ButtonType from "../components/ButtonType";
import { useState } from "react";
import StudyBackgroundSelector from "../components/StudyBackgroundSelector";
import LabelInput from "../components/LabelInput";
import {
  validateNickname,
  validateStudyName,
  validateIntro,
  validatePassword,
  validatePasswordCheck,
} from "../utils/Validation";

export default function StudyMake() {
  // === 1. 상태 선언 (컴포넌트 함수 안쪽!) ===
  const [nickname, setNickname] = useState("");
  const [studyName, setStudyName] = useState("");
  const [intro, setIntro] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");

  const [nicknameError, setNicknameError] = useState("");
  const [studyNameError, setStudyNameError] = useState("");
  const [introError, setIntroError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordCheckError, setPasswordCheckError] = useState("");

  const [selectedBg, setSelectedBg] = useState(null);

  // === 2. onChange 핸들러 ===
  const handleNicknameChange = (e) => {
    const value = e.target.value;
    setNickname(value);
    setNicknameError(validateNickname(value));
  };

  const handleStudyNameChange = (e) => {
    const value = e.target.value;
    setStudyName(value);
    setStudyNameError(validateStudyName(value));
  };

  const handleIntroChange = (e) => {
    const value = e.target.value;
    setIntro(value);
    setIntroError(validateIntro(value));
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    setPasswordError(validatePassword(value));
    setPasswordCheckError(validatePasswordCheck(passwordCheck, value));
  };

  const handlePasswordCheckChange = (e) => {
    const value = e.target.value;
    setPasswordCheck(value);
    setPasswordCheckError(validatePasswordCheck(value, password));
  };

  // === 3. 폼 전체가 유효한지 ===
  const isFormValid =
    nickname &&
    studyName &&
    intro &&
    password &&
    passwordCheck &&
    selectedBg !== null &&
    !nicknameError &&
    !studyNameError &&
    !introError &&
    !passwordError &&
    !passwordCheckError;

  // (필요하면 제출 핸들러에서 한 번 더 검사)
  const handleSubmit = (e) => {
    e.preventDefault();

    // 여기서 서버로 전송 로직 넣으면 됨
    if (!isFormValid) return;

    console.log("폼 전송", {
      nickname,
      studyName,
      intro,
      password,
      selectedBg,
    });
  };

  return (
    <div className="container" id="container">
      <div className="contents">
        <form className="studymake-box" onSubmit={handleSubmit}>
          <h2 className="g_tit">스터디 만들기</h2>

          {/* 닉네임 */}
          <LabelInput
            label="닉네임"
            placeholder="닉네임을 입력해주세요"
            value={nickname}
            onChange={handleNicknameChange}
            errorType={nicknameError}
          />

          {/* 스터디 이름 */}
          <LabelInput
            label="스터디 이름"
            placeholder="스터디 이름을 입력해주세요"
            value={studyName}
            onChange={handleStudyNameChange}
            errorType={studyNameError}
          />

          {/* 소개 */}
          <LabelInput
            label="소개"
            as="textarea"
            placeholder="소개 멘트를 작성해 주세요"
            value={intro}
            onChange={handleIntroChange}
            errorType={introError}
          />

          {/* 배경 선택 */}
          <h3 className="g_sub_tit mt20">배경을 선택해주세요</h3>
          <StudyBackgroundSelector
            selectedBg={selectedBg}
            onSelect={setSelectedBg}
          />

          {/* 비밀번호 */}
          <LabelInput
            label="비밀번호"
            type="password"
            placeholder="비밀번호를 입력해주세요"
            value={password}
            onChange={handlePasswordChange}
            errorType={passwordError}
          />

          {/* 비밀번호 확인 */}
          <LabelInput
            label="비밀번호 확인"
            type="password"
            placeholder="비밀번호를 다시 입력해주세요"
            value={passwordCheck}
            onChange={handlePasswordCheckChange}
            errorType={passwordCheckError}
          />

          {/* 버튼 : 비활성화일 때 회색 클래스 추가 */}
          <ButtonType
            buttonText="스터디 생성"
            buttonClass={isFormValid ? "w100 mt40" : "w100 mt40 bg_gray_300"}
            disabled={!isFormValid}
          >
            스터디 생성
          </ButtonType>
        </form>
      </div>
    </div>
  );
}

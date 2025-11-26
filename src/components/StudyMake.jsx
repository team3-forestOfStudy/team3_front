import '../styles/studymake.css';
import { useState } from 'react';
import ButtonType from '../components/ButtonType.jsx';
import StudyBackgroundSelector from '../components/StudyBackgroundSelector.jsx';
import LabelInput from '../components/LabelInput.jsx';
import {
  validateNickname,
  validateStudyName,
  validateIntro,
  validatePassword,
  validatePasswordCheck,
} from '../utils/validation.js';

export default function StudyMake({
  mode = 'create',
  initialData = null, // 수정 모드일때 초기값
  onSubmit,
}) {
  const isEditMode = mode === 'edit';

  // 1. 상태
  const [nickname, setNickname] = useState(initialData?.nickname ?? '');
  const [studyName, setStudyName] = useState(initialData?.studyName ?? '');
  const [intro, setIntro] = useState(initialData?.intro ?? '');
  const [password, setPassword] = useState('');
  const [passwordCheck, setPasswordCheck] = useState('');
  const [selectedBg, setSelectedBg] = useState(initialData?.selectedBg ?? null);

  const [nicknameError, setNicknameError] = useState('');
  const [studyNameError, setStudyNameError] = useState('');
  const [introError, setIntroError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordCheckError, setPasswordCheckError] = useState('');

  // 2. 핸들러
  const hadleNicknameChange = e => {
    const v = e.target.value;
    setNickname(v);
    setNicknameError(validateNickname(v));
  };

  const handleStudyNameChange = e => {
    const v = e.target.value;
    setStudyName(v);
    setStudyNameError(validateStudyName(v));
  };

  const handleIntroChange = e => {
    const v = e.target.value;
    setIntro(v);
    setIntroError(validateIntro(v));
  };

  const handlePasswordChange = e => {
    const v = e.target.value;
    setPassword(v);
    setPasswordError(validatePassword(v));
    setPasswordCheckError(validatePasswordCheck(passwordCheck, v));
  };

  const handlePasswordCheckChange = e => {
    const v = e.target.value;
    setPasswordCheck(v);
    setPasswordCheckError(validatePasswordCheck(v, password));
  };

  // 3. 폼 유효성
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

  // 4. 제출
  const handleSubmit = e => {
    e.preventDefault();
    if (!isFormValid) return;

    const payload = {
      nickname,
      studyName,
      intro,
      password,
      passwordCheck, // ← passwordConfirm으로 매핑될 값
      selectedBg, // ← backgroundImage로 매핑될 값
    };

    if (onSubmit) onSubmit(payload);
  };

  const titleText = isEditMode ? '스터디 수정하기' : '스터디 만들기';
  const buttonText = isEditMode ? '수정 완료' : '스터디 생성';

  return (
    <div className="container" id="container">
      <div className="contents">
        <form className="studymake-box" onSubmit={handleSubmit}>
          <h2 className="g_tit">{titleText}</h2>

          <LabelInput
            label="닉네임"
            placeholder="닉네임을 입력해주세요"
            value={nickname}
            onChange={handleNicknameChange}
            errorType={nicknameError}
          />

          <LabelInput
            label="스터디 이름"
            placeholder="스터디 이름을 입력해주세요"
            value={studyName}
            onChange={handleStudyNameChange}
            errorType={studyNameError}
          />

          <LabelInput
            label="소개"
            placeholder="소개 멘트를 작성해 주세요"
            value={intro}
            onChange={handleIntroChange}
            errorType={introError}
          />

          <h3 className="g_sub_tit mt20">배경을 선택해주세요</h3>
          <StudyBackgroundSelector
            selectedBg={selectedBg}
            onSelect={setSelectedBg}
          />

          <LabelInput
            label="비밀번호"
            type="password"
            placeholder="비밀번호를 입력해 주세요"
            value={password}
            onChange={handlePasswordChange}
            errorType={passwordError}
          />

          <LabelInput
            label="비밀번호 확인"
            type="password"
            placeholder="비밀번호를 다시 입력해 주세요"
            value={passwordCheck}
            onChange={handlePasswordCheckChange}
            errorType={passwordCheckError}
          />

          <ButtonType
            buttonText={buttonText}
            buttonClass={isFormValid ? 'w100 mt40' : 'w100 mt40 bg_gray_300'}
            disabled={!isFormValid}
          >
            {buttonText}
          </ButtonType>
        </form>
      </div>
    </div>
  );
}

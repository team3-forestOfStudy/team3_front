// StudyMake.jsx (리팩토링 버전)
// 객체 기반 form + errors 구조로 정리된 버전
// 주석으로 왜 이렇게 되는지 상세히 설명해둠

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
  initialData = null,
  onSubmit,
}) {
  const isEditMode = mode === 'edit';

  /* ----------------------------------------------
    ✔ 1. form과 errors를 객체 하나로 관리하는 방식
    - 기존에는 nickname, studyName 등 각 값을 useState로 관리했다면
      이제는 form 객체 하나에 다 넣어서 관리
    - 에러도 errors 객체 하나로 묶어서 관리
    - 장점: 필드 추가/삭제가 쉬워지고, handler도 단일화됨
  ---------------------------------------------- */

  const [form, setForm] = useState({
    nickname: initialData?.nickname ?? '',
    studyName: initialData?.studyName ?? '',
    intro: initialData?.intro ?? '',
    password: '',
    passwordCheck: '',
    selectedBg: initialData?.selectedBg ?? null,
  });

  const [errors, setErrors] = useState({
    nickname: '',
    studyName: '',
    intro: '',
    password: '',
    passwordCheck: '',
  });

  /* ----------------------------------------------
    ✔ 2. 공통 handleChange(field)
    - 반복되던 handleNicknameChange, handleStudyNameChange 등을
      "필드 이름 하나"로 묶어서 공통 함수로 만듦
    - 게임으로 비유하면: "공격 스킬 슬롯마다 코드 만들던 것을
      스킬 슬롯 공통 로직 하나로 통일"한 느낌
  ---------------------------------------------- */

  const handleChange = field => e => {
    const value = e.target.value;

    // form 업데이트
    setForm(prev => ({
      ...prev,
      [field]: value,
    }));

    // 필드별 에러 검증
    let errorMsg = '';
    switch (field) {
      case 'nickname':
        errorMsg = validateNickname(value);
        break;
      case 'studyName':
        errorMsg = validateStudyName(value);
        break;
      case 'intro':
        errorMsg = validateIntro(value);
        break;
      case 'password':
        errorMsg = validatePassword(value);
        break;
      case 'passwordCheck':
        errorMsg = validatePasswordCheck(value, form.password);
        break;
      default:
        break;
    }

    // errors 업데이트
    setErrors(prev => ({
      ...prev,
      [field]: errorMsg,
    }));

    // 비밀번호 확인일 때 비밀번호-비밀번호확인 싱크 맞추기
    if (field === 'password') {
      setErrors(prev => ({
        ...prev,
        passwordCheck: validatePasswordCheck(form.passwordCheck, value),
      }));
    }
  };

  /* ----------------------------------------------
    ✔ 3. 배경 선택 핸들러 (selectedBg)
    - 이것도 같은 form 객체 안에 있으므로 setForm으로 갱신
  ---------------------------------------------- */

  const handleBgSelect = bgValue => {
    setForm(prev => ({
      ...prev,
      selectedBg: bgValue,
    }));
  };

  /* ----------------------------------------------
    ✔ 4. 폼 전체 유효성 검사
    - errors 객체에 하나라도 값이 있으면 실패
    - form의 필수 필드가 비어있어도 실패
  ---------------------------------------------- */

  const isFormValid =
    form.nickname &&
    form.studyName &&
    form.intro &&
    form.password &&
    form.passwordCheck &&
    form.selectedBg !== null &&
    !errors.nickname &&
    !errors.studyName &&
    !errors.intro &&
    !errors.password &&
    !errors.passwordCheck;

  /* ----------------------------------------------
    ✔ 5. 제출 핸들러
    - form 객체를 그대로 payload로 전달할 수 있음
    - 기존처럼 각 변수 선언할 필요 X
  ---------------------------------------------- */

  const handleSubmit = e => {
    e.preventDefault();
    if (!isFormValid) return;

    const payload = {
      nickname: form.nickname,
      studyName: form.studyName,
      intro: form.intro,
      password: form.password,
      passwordCheck: form.passwordCheck, // passwordConfirm으로 매핑될 값
      selectedBg: form.selectedBg, // backgroundImage로 매핑될 값
    };

    if (onSubmit) onSubmit(payload);
  };

  const titleText = isEditMode ? '스터디 수정하기' : '스터디 만들기';
  const buttonText = isEditMode ? '수정 완료' : '스터디 생성';

  /* ----------------------------------------------
    ✔ 6. UI 구조는 기존과 동일
    - 값(value)과 onChange만 form/handleChange로 변경됨
  ---------------------------------------------- */

  return (
    <div className="container" id="container">
      <div className="contents">
        <form className="studymake-box" onSubmit={handleSubmit}>
          <h2 className="g_tit">{titleText}</h2>

          <LabelInput
            label="닉네임"
            placeholder="닉네임을 입력해주세요"
            value={form.nickname}
            onChange={handleChange('nickname')}
            errorType={errors.nickname}
          />

          <LabelInput
            label="스터디 이름"
            placeholder="스터디 이름을 입력해주세요"
            value={form.studyName}
            onChange={handleChange('studyName')}
            errorType={errors.studyName}
          />

          <LabelInput
            label="소개"
            placeholder="소개 멘트를 작성해 주세요"
            value={form.intro}
            onChange={handleChange('intro')}
            errorType={errors.intro}
          />

          <h3 className="g_sub_tit mt20">배경을 선택해주세요</h3>
          <StudyBackgroundSelector
            selectedBg={form.selectedBg}
            onSelect={handleBgSelect}
          />

          <LabelInput
            label="비밀번호"
            type="password"
            placeholder="비밀번호를 입력해 주세요"
            value={form.password}
            onChange={handleChange('password')}
            errorType={errors.password}
          />

          <LabelInput
            label="비밀번호 확인"
            type="password"
            placeholder="비밀번호를 다시 입력해 주세요"
            value={form.passwordCheck}
            onChange={handleChange('passwordCheck')}
            errorType={errors.passwordCheck}
          />

          <ButtonType
            buttonText={buttonText}
            buttonClass={
              isFormValid ? 'w100 mt40' : 'w100 mt40 bg_gray_300 shadowGray'
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

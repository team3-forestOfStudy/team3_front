// src/utils/validation.js

// 닉네임 최소, 최대 글자수
export const NICKNAME_MIN = 2;
export const NICKNAME_MAX = 8;

// 스터디 이름(title) 최소, 최대 글자수
export const STUDY_NAME_MIN = 2;
export const STUDY_NAME_MAX = 16;

// 소개(description) 최소, 최대 글자수
export const INTRO_MIN = 2;
export const INTRO_MAX = 200;

// 비밀번호 최소/최대 글자 수 + 특수문자 최소 1개 포함
export const PASSWORD_MIN = 6;
export const PASSWORD_MAX = 20;

// 백엔드가 허용하는 backgroundImage 목록
export const ALLOWED_BACKGROUND_IMAGES = [
  "green",
  "yellow",
  "blue",
  "pink",
  "workspace_1",
  "workspace_2",
  "pattern",
  "leaf",
];

// 공통 길이 체크 (다른 곳에서 쓸 수 있는 기본 함수)
// 닉네임/스터디명/소개는 아래 개별 함수에서 따로 처리함
export function validateLength(value, min, max) {
  if (!value || value.trim().length === 0) return "empty";
  const len = value.trim().length;
  if (len < min || len > max) return "invalid";
  return "";
}

// 닉네임
// 에러 코드: "empty" | "nicknameTooShort" | "nicknameTooLong"
export function validateNickname(value) {
  if (!value || value.trim().length === 0) return "empty";

  const len = value.trim().length;
  if (len < NICKNAME_MIN) return "nicknameTooShort";
  if (len > NICKNAME_MAX) return "nicknameTooLong";

  return "";
}

// 스터디 이름(title)
// 에러 코드: "empty" | "studyNameTooShort" | "studyNameTooLong"
export function validateStudyName(value) {
  if (!value || value.trim().length === 0) return "empty";

  const len = value.trim().length;
  if (len < STUDY_NAME_MIN) return "studyNameTooShort";
  if (len > STUDY_NAME_MAX) return "studyNameTooLong";

  return "";
}

// 소개(description)
// 에러 코드: "empty" | "introTooShort" | "introTooLong"
export function validateIntro(value) {
  if (!value || value.trim().length === 0) return "empty";

  const len = value.trim().length;
  if (len < INTRO_MIN) return "introTooShort";
  if (len > INTRO_MAX) return "introTooLong";

  return "";
}

// 비밀번호: 길이 + 숫자 + 특수문자
// 에러 코드: "empty" | "passwordTooShort" | "noNumber" | "noSpecial"
export function validatePassword(value) {
  if (!value || value.trim().length === 0) return "empty";

  if (value.length < PASSWORD_MIN) return "passwordTooShort";
  if (value.length > PASSWORD_MAX) return "passwordTooLong";

  const hasNumber = /[0-9]/.test(value);
  const hasSpecial = /[!@#$%^&*()_\-+=\[\]{};':"\\|,.<>\/?]/.test(value);

  if (!hasNumber) return "noNumber";
  if (!hasSpecial) return "noSpecial";

  return "";
}

// 비밀번호 확인: 원본과 일치 여부
export function validatePasswordCheck(value, originalPassword) {
  if (!value || value.trim().length === 0) return "empty";
  if (value !== originalPassword) return "notMatch";
  return "";
}

// backgroundImage 값 검증 (선택)
// 셀렉터에서만 값이 들어오면 사실상 항상 통과지만, 방어용으로 하나 둠
export function validateBackgroundImage(value) {
  if (!value) return "empty";
  if (!ALLOWED_BACKGROUND_IMAGES.includes(value)) return "invalid";
  return "";
}

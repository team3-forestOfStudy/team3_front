// src/utils/Validation.js

// 닉네임 최소, 최대 글자수
export const NICKNAME_MIN = 2;
export const NICKNAME_MAX = 10;

// 스터디 이름 최소, 최대 글자수
export const STUDY_NAME_MIN = 2;
export const STUDY_NAME_MAX = 20;

// 소개 최소, 최대 글자수
export const INTRO_MIN = 2;
export const INTRO_MAX = 200;

// 비밀번호 최소 글자 수
export const PASSWORD_MIN = 6;

// 공통 길이 체크
export function validateLength(value, min, max) {
  if (!value || value.trim().length === 0) return "empty";
  const len = value.trim().length;
  if (len < min || len > max) return "invalid";
  return "";
}

// 닉네임
export function validateNickname(value) {
  return validateLength(value, NICKNAME_MIN, NICKNAME_MAX);
}

// 스터디 이름
export function validateStudyName(value) {
  return validateLength(value, STUDY_NAME_MIN, STUDY_NAME_MAX);
}

// 소개
export function validateIntro(value) {
  return validateLength(value, INTRO_MIN, INTRO_MAX);
}

// 비밀번호: 길이 + 숫자 + 특수문자
export function validatePassword(value) {
  if (!value || value.trim().length === 0) return "empty";
  if (value.length < PASSWORD_MIN) return "invalid";

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

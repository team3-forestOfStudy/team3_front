// src/utils/recentViewed.js

const RECENT_STUDY_COOKIE_KEY = 'recentStudies';
const MAX_RECENT_COUNT = 9; // 최대 수량 수정하고 싶으면 여기에서

// 쿠키 읽기
function getCookie(name) {
  if (typeof document === 'undefined') return '';

  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop().split(';').shift();
  }
  return '';
}

// 쿠키 쓰기 (7일 유지)
function setCookie(name, value, days = 7) {
  if (typeof document === 'undefined') return;

  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  const expires = `expires=${date.toUTCString()}`;
  document.cookie = `${name}=${value}; ${expires}; path=/`;
}

// 쿠키에서 최근 조회한 스터디 목록 가져오기
export function getRecentViewedStudies() {
  try {
    const raw = getCookie(RECENT_STUDY_COOKIE_KEY);
    if (!raw) return [];

    const decoded = decodeURIComponent(raw);
    const parsed = JSON.parse(decoded);

    // 혹시 배열이 아니면 방어
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch (e) {
    console.error('getRecentViewedStudies error:', e);
    return [];
  }
}

// 스터디 하나를 최근 조회 목록에 추가
export function addRecentViewedStudy(study) {
  try {
    if (!study || !study.studyId) return;

    const prev = getRecentViewedStudies();

    // 최소 필드만 추려서 저장 (용량 대비)
    const trimmed = {
      studyId: study.studyId,
      nickname: study.nickname,
      title: study.title,
      description: study.description,
      backgroundImage: study.backgroundImage,
      totalPoints: study.totalPoints,
      status: study.status,
      createdAt: study.createdAt,
      updatedAt: study.updatedAt,
      topEmojis: study.topEmojis || [],
      habitRecords: study.habitRecords || [],
    };

    // 같은 studyId는 제거 후 맨 앞에 추가
    const filtered = prev.filter(item => item.studyId !== trimmed.studyId);
    const next = [trimmed, ...filtered].slice(0, MAX_RECENT_COUNT);

    const encoded = encodeURIComponent(JSON.stringify(next));
    setCookie(RECENT_STUDY_COOKIE_KEY, encoded);
  } catch (e) {
    console.error('addRecentViewedStudy error:', e);
  }
}

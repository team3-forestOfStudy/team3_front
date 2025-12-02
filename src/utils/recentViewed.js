// src/utils/recentViewed.js

const RECENT_STORAGE_KEY = "recentStudies";
const MAX_RECENT_COUNT = 9; // 기존과 똑같이 9개 유지

// 브라우저 환경 체크 (SSR 방어용)
function isBrowser() {
  return (
    typeof window !== "undefined" && typeof window.localStorage !== "undefined"
  );
}

function safeParse(json) {
  try {
    const parsed = JSON.parse(json);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.error("recentViewed safeParse error:", e);
    return [];
  }
}

// 🔹 로컬 스토리지에서 최근 조회 목록 가져오기
export function getRecentViewedStudies() {
  if (!isBrowser()) return [];

  try {
    const raw = window.localStorage.getItem(RECENT_STORAGE_KEY);
    if (!raw) return [];
    return safeParse(raw);
  } catch (e) {
    console.error("getRecentViewedStudies error:", e);
    return [];
  }
}

// 🔹 로컬 스토리지에 목록 저장
function saveRecentViewedStudies(list) {
  if (!isBrowser()) return;

  try {
    window.localStorage.setItem(RECENT_STORAGE_KEY, JSON.stringify(list));
  } catch (e) {
    console.error("saveRecentViewedStudies error:", e);
  }
}

// 🔹 스터디 하나를 최근 조회 목록에 추가
export function addRecentViewedStudy(study) {
  try {
    if (!study || !study.studyId) return;

    const prev = getRecentViewedStudies();

    // ✅ 기존 쿠키 버전과 동일하게 "trimmed" 구조 유지 + viewedAt만 추가
    const trimmed = {
      studyId: study.studyId,
      nickname: study.nickname,
      title: study.title,
      description: (study.description || "").slice(0, 50),
      backgroundImage: study.backgroundImage,
      totalPoints: study.totalPoints,
      status: study.status,
      createdAt: study.createdAt,
      updatedAt: study.updatedAt,
    };

    // 같은 studyId 제거 후 맨 앞에 추가
    const filtered = prev.filter(item => item.studyId !== trimmed.studyId);

    const next = [
      {
        ...trimmed,
        viewedAt: Date.now(), // 언제 봤는지 기록 (필요 없으면 나중에 지워도 됨)
      },
      ...filtered,
    ].slice(0, MAX_RECENT_COUNT);

    saveRecentViewedStudies(next);
  } catch (e) {
    console.error("addRecentViewedStudy error:", e);
  }
}

// 🔹 특정 스터디 제거
export function removeRecentViewedStudy(studyId) {
  try {
    if (!studyId) return;

    const list = getRecentViewedStudies();
    const next = list.filter(item => item.studyId !== studyId);
    saveRecentViewedStudies(next);
  } catch (e) {
    console.error("removeRecentViewedStudy error:", e);
  }
}

// 🔹 전부 초기화 (필요하면 사용)
export function clearRecentViewedStudies() {
  if (!isBrowser()) return;
  try {
    window.localStorage.removeItem(RECENT_STORAGE_KEY);
  } catch (e) {
    console.error("clearRecentViewedStudies error:", e);
  }
}

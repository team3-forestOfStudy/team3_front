// src/utils/date.js

// "OO일째 진행 중"에서 쓸 일수 계산
export function getDaysInProgress(createdAt) {
  if (!createdAt) return null;

  const start = new Date(createdAt);
  if (Number.isNaN(start.getTime())) return null;

  const now = new Date();

  // 밀리초 차이
  const diffMs = now.getTime() - start.getTime();
  if (diffMs < 0) return 0; // 혹시 미래 날짜가 들어오면 0일로

  const ONE_DAY_MS = 1000 * 60 * 60 * 24;

  // 첫 날이 1일째가 되도록 +1
  const days = Math.floor(diffMs / ONE_DAY_MS) + 1;

  return days;
}

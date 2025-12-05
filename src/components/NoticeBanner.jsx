// src/components/NoticeBanner.jsx
import { useEffect, useMemo, useState } from "react";

// 닉네임 색상 4종 (스터디 카드 팔레트와 맞춤)
const NICKNAME_COLOR_CLASSES = [
  "notice-nickname--green",
  "notice-nickname--yellow",
  "notice-nickname--blue",
  "notice-nickname--pink",
];

function pickRandomColorClass() {
  const idx = Math.floor(Math.random() * NICKNAME_COLOR_CLASSES.length);
  return NICKNAME_COLOR_CLASSES[idx];
}

// createdAt > updatedAt > 배열 마지막 순으로 "가장 최근" 스터디 찾기
function getLatestStudy(studies) {
  if (!studies || studies.length === 0) return null;
  const withDate = studies.filter(s => s.createdAt || s.updatedAt);
  if (withDate.length === 0) {
    return studies[studies.length - 1];
  }

  return [...withDate].sort((a, b) => {
    const aDate = new Date(a.createdAt || a.updatedAt).getTime();
    const bDate = new Date(b.createdAt || b.updatedAt).getTime();
    return bDate - aDate;
  })[0];
}

// totalPoints 기준 포인트 1위 스터디
function getTopPointStudy(studies) {
  if (!studies || studies.length === 0) return null;

  return [...studies].sort((a, b) => {
    const aPoints = typeof a.totalPoints === "number" ? a.totalPoints : 0;
    const bPoints = typeof b.totalPoints === "number" ? b.totalPoints : 0;
    return bPoints - aPoints;
  })[0];
}

export default function NoticeBanner({
  studies,
  loading,
  // 🔽 애니메이션 타입: 나중에 "slide-up"으로 바꾸기만 하면 됨
  animation = "slide-left",
}) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // 스터디 리스트로부터 공지 메시지 후보 만들기
  const messages = useMemo(() => {
    if (!studies || studies.length === 0) return [];

    const latestStudy = getLatestStudy(studies);
    const topPointStudy = getTopPointStudy(studies);

    const result = [];

    if (latestStudy && latestStudy.nickname) {
      result.push({
        id: "created",
        content: (
          <>
            최근에&nbsp;{" "}
            <span className={pickRandomColorClass()}>
              {latestStudy.nickname}
            </span>
            님이 스터디를 만들었습니다!
          </>
        ),
      });
    }

    if (topPointStudy && topPointStudy.nickname) {
      result.push({
        id: "topPointGained",
        content: (
          <>
            최근에&nbsp;{" "}
            <span className={pickRandomColorClass()}>
              {topPointStudy.nickname}
            </span>
            님이 포인트를 획득했습니다. 대단해요!
          </>
        ),
      });

      result.push({
        id: "topRanking",
        content: (
          <>
            현재 포인트 랭킹 1위는&nbsp;{" "}
            <span className={pickRandomColorClass()}>
              {topPointStudy.nickname}
            </span>
            님입니다.
          </>
        ),
      });
    }

    return result;
  }, [studies]);

  // 새 메시지 세트가 들어오면 인덱스 초기화
  useEffect(() => {
    setCurrentIndex(0);
  }, [messages.length]);

  // 10초마다 다음 메시지로 순환
  useEffect(() => {
    if (messages.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % messages.length);
    }, 10000); // 10초

    return () => clearInterval(timer);
  }, [messages.length]);

  // 로딩 중이거나 메시지가 없으면 표시 안 함
  if (loading || messages.length === 0) {
    return null;
  }

  const current = messages[currentIndex];

  const animationClass =
    animation === "slide-up"
      ? "notice-banner--slide-up"
      : "notice-banner--slide-left";

  return (
    <div className={`notice-banner ${animationClass}`}>
      {/* key를 넣어서 메시지 바뀔 때마다 애니메이션 다시 실행 */}
      <div
        key={current.id}
        className="notice-banner__pill notice-banner__message"
      >
        {current.content}
      </div>
    </div>
  );
}

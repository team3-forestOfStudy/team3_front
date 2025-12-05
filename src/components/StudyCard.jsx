import { useNavigate } from "react-router-dom";
import "../styles/studycard.css";
import pointIcon from "../assets/icons/ic_point.svg";
import { addRecentViewedStudy } from "../utils/recentViewed"; // 최근 조회
import { getDaysInProgress } from "../utils/date";
import { Emoji } from "emoji-picker-react";

// 단색 배경 키 값 (backgroundImage 값과 맞춰서 사용)
const SOLID_BG_KEYS = ["green", "yellow", "blue", "pink"];

export default function StudyCard({
  study,
  hoverVariant = "scale",
  isPreview = false, // ⬅ 프리뷰 모드 여부 추가
}) {
  // 백엔드 / 부모 컴포넌트에서 내려주는 스터디 데이터 형태 예시
  const {
    studyId, // 숫자 ID (상세 페이지로 이동할 때 사용)
    nickname, // 닉네임
    title, // 스터디 이름
    description, // 스터디 소개
    status,
    createdAt,
    updatedAt,
    backgroundImage, // 'green' | 'yellow' | 'blue' | 'pink' | 'workspace_1' ...
    totalPoints, // 현재까지 획득한 포인트 (예: 310)
    topEmojis = [], // 나중에 API에서 내려줄 상위 3개 이모지 [{ emojiId, emojiCode, count }, ...]
  } = study;

  const navigate = useNavigate();
  // 날짜 계산
  const daysInProgress = getDaysInProgress(createdAt);

  /* 사진 배경 스터디 카드 */
  const isPhotoBg = backgroundImage && !SOLID_BG_KEYS.includes(backgroundImage);
  const photoClass = isPhotoBg ? "bg-photo" : "";

  // 단색 / 사진 배경 구분
  const isSolidBg = SOLID_BG_KEYS.includes(backgroundImage);
  const variantClass = isSolidBg ? "study-card--solid" : "study-card--photo";

  // backgroundImage 값에 맞춰 CSS 클래스 결정 (bg-green, bg-yellow ...)
  const bgClass = backgroundImage ? `bg-${backgroundImage}` : "";

  const handleCardClick = () => {
    // ⬇ 프리뷰 모드이거나 studyId 없으면 아무 동작 안 함
    if (isPreview || !studyId) return;

    // 최근 조회 쿠키에 저장
    addRecentViewedStudy(study);
    // 클릭하면 상세 페이지로 이동
    navigate(`/Studydetails?studyId=${studyId}`);
  };

  // 이모지는 최대 3개까지만 표시 (지금은 topEmojis가 없으니 안 나옴)
  const visibleEmojis =
    Array.isArray(topEmojis) && topEmojis.length > 0
      ? topEmojis.slice(0, 3)
      : [];

  const hoverClass =
    hoverVariant === "lift" ? "u-hover-style-02" : "u-hover-style-01";

  return (
    <article
      className={`study-card ${variantClass} ${photoClass} ${bgClass} ${hoverClass} u-active-press`}
      onClick={handleCardClick}
    >
      {/* 상단 텍스트 영역 */}
      <header className="study-card__header">
        {/* 제목 + 포인트 배지 한 줄 */}
        <div className="study-card__top-row">
          <h3 className="study-card__title">
            <span className="study-card__nickname">{nickname}</span>
            {"의 "}
            {title}
          </h3>

          {/* 포인트 배지 (하나만 사용) */}
          <button
            type="button"
            className="study-card__point-badge"
            // onClick={e => e.stopPropagation()} 포인트 버튼으로 이동되는걸 막는 코드
          >
            <img
              src={pointIcon}
              alt=""
              className="study-card__point-badge-icon"
            />
            <span className="study-card__point-badge-text">
              {totalPoints}P 획득
            </span>
          </button>
        </div>

        {/* 진행 일수 */}
        <p className="study-card__days">
          {daysInProgress != null ? `${daysInProgress}일째 진행 중` : ""}
        </p>
      </header>

      {/* 소개 텍스트 */}
      <p className="study-card__description">{description}</p>

      {/* 하단 이모지 영역 */}
      {visibleEmojis.length > 0 && (
        <footer className="study-card__footer">
          <div className="study-card__emojis">
            {visibleEmojis.map(emoji => (
              <button
                key={emoji.emojiId}
                type="button"
                className="study-card__emoji"
              >
                <span className="study-card__emoji-icon">
                  <Emoji
                    unified={emoji.emojiCode}
                    emojiStyle="apple" // ✅ 상세 페이지와 동일 스타일
                    size={16} // 필요하면 18 등으로 조정 가능
                  />
                </span>
                <span className="study-card__emoji-count">{emoji.count}</span>
              </button>
            ))}
          </div>
        </footer>
      )}
    </article>
  );
}

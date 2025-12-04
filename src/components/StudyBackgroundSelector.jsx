// src/components/StudyBackgroundSelector.jsx
import { useEffect, useState } from "react";
import "../styles/studymake.css";
import icBgSelected from "../assets/icons/bgselected.svg";
import workspace1 from "../assets/studyCard/workspace_1.svg";
import workspace2 from "../assets/studyCard/workspace_2.svg";
import patternImg from "../assets/studyCard/pattern.svg";
import leafImg from "../assets/studyCard/leaf.svg";

// 배경 8개 정의
const BG_ITEMS = [
  // 단색 BG
  {
    id: "green",
    type: "color",
    className:
      "bg_green_300 gray_50 bg-item__image u-hover-style-01 u-active-press",
  },
  {
    id: "yellow",
    type: "color",
    className: "bg_yellow_100 bg-item__image u-hover-style-01 u-active-press",
  },
  {
    id: "blue",
    type: "color",
    className: "bg_blue_100 bg-item__image u-hover-style-01 u-active-press",
  },
  {
    id: "pink",
    type: "color",
    className: "bg_pink_100 bg-item__image u-hover-style-01 u-active-press",
  },

  // 이미지 BG
  { id: "workspace_1", type: "image", src: workspace1 },
  { id: "workspace_2", type: "image", src: workspace2 },
  { id: "pattern", type: "image", src: patternImg },
  { id: "leaf", type: "image", src: leafImg },
];

export default function StudyBackgroundSelector({ selectedBg, onSelect }) {
  // 각 배경별 로딩 여부
  const [loadedMap, setLoadedMap] = useState({});

  // 단색 4개는 처음부터 로딩 완료(true)로 처리
  useEffect(() => {
    const initial = {};
    BG_ITEMS.forEach(bg => {
      if (bg.type === "color") {
        initial[bg.id] = true;
      }
    });
    setLoadedMap(initial);
  }, []);

  const handleImageLoad = id => {
    setLoadedMap(prev => ({ ...prev, [id]: true }));
  };

  return (
    <div className="bg-grid">
      {BG_ITEMS.map(bg => {
        const isSelected = selectedBg === bg.id;
        const isLoaded = !!loadedMap[bg.id];

        return (
          <button
            key={bg.id}
            type="button"
            className={`bg-item ${
              isSelected ? "bg-item--selected" : ""
            } ${isLoaded ? "bg-item--loaded" : "bg-item--loading"}`}
            onClick={() => onSelect(bg.id)}
          >
            {/* 이미지 로딩 중일 때만 스켈레톤 표시 */}
            {!isLoaded && <div className="bg-skeleton" />}

            {bg.type === "color" ? (
              // 단색 배경 (기존 클래스 그대로 사용)
              <div className={bg.className} />
            ) : (
              // 이미지 배경
              <img
                src={bg.src}
                alt={bg.id}
                className="bg-item__image u-hover-style-01 u-active-press"
                onLoad={() => handleImageLoad(bg.id)}
              />
            )}

            {isSelected && (
              <img
                src={icBgSelected}
                alt="선택된 배경"
                className="bg-item__selected-icon"
              />
            )}
          </button>
        );
      })}
    </div>
  );
}

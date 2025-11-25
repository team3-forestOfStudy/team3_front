import "../styles/studymake.css";
import icBgSelected from "../assets/icons/bgselected.svg";
import workspace1 from "../assets/studyCard/workspace_1.svg";
import workspace2 from "../assets/studyCard/workspace_2.svg";
import patternImg from "../assets/studyCard/pattern.svg";
import leafImg from "../assets/studyCard/leaf.svg";

const BG_ITEMS = [
  { id: "green", type: "color", className: "bg_green_300 gray_50 g_boxs" },
  { id: "yellow", type: "color", className: "bg_yellow_100 g_boxs" },
  { id: "blue", type: "color", className: "bg_blue_100 g_boxs" },
  { id: "pink", type: "color", className: "bg_pink_100 g_boxs" },
  { id: "workspace_1", type: "color", src: workspace1 },
  { id: "workspace_2", type: "color", src: workspace2 },
  { id: "pattern", type: "color", src: patternImg },
  { id: "leaf", type: "color", src: leafImg },
];

export default function StudyBackgroundSelector({ selectedBg, onSelect }) {
  return (
    <div className="bg-grid">
      {BG_ITEMS.map((bg) => {
        const isSelected = selectedBg === bg.id;

        return (
          <button
            key={bg.id}
            type="button"
            className={`bg-item ${isSelected ? "bg-item--selected" : ""}`}
            onClick={() => onSelect(bg.id)}
          >
            {bg.type === "color" ? (
              <div className={bg.clasaName} />
            ) : (
              <img src={bg.src} alt={bg.id} className="bg-item_image" />
            )}

            {isSelected && (
              <img
                src={icBgSelected}
                alt="선택됨"
                className="bg-item_selected-icon"
              />
            )}
          </button>
        );
      })}
    </div>
  );
}

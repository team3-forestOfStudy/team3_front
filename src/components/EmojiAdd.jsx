import React, { useState, useRef, useEffect } from "react";
import EmojiPicker, { Emoji } from "emoji-picker-react";
import SmileButton from "../components/SmileButton.jsx";
import EmojiTag from "../components/EmojiTag.jsx";
import "../styles/emoji.css";

export default function EmojiCounterWithImage() {
  const [emojiCounts, setEmojiCounts] = useState({});
  const [isOpen, setIsOpen] = useState(false);
  const [EojiOpen, setEojiOpen] = useState(false);

  const warpRef = useRef(null); // ⭐ warp를 잡을 ref
  const emojiwarpRef = useRef(null); // ⭐ warp를 잡을 ref

  const onEmojiClick = (emojiData) => {
    const key = emojiData.unified;
    setEmojiCounts((prev) => ({
      ...prev,
      [key]: {
        data: emojiData,
        count: prev[key] ? prev[key].count + 1 : 1,
      },
    }));
  };

  const emojiList = Object.values(emojiCounts);
  const maxVisible = 3;
  const visibleItems = emojiList.slice(0, maxVisible);
  const moreCount =
    emojiList.length > maxVisible ? emojiList.length - maxVisible : 0;

  // ⭐ 외부 클릭 감지 (warpRef 밖 클릭 시 setIsOpen(false))
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e) => {
      if (warpRef.current && !warpRef.current.contains(e.target)) {
        setIsOpen(false); // warp 외부 클릭 시 닫기
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // ⭐ 외부 클릭 감지 (emojiwarpRef 밖 클릭 시 setEojiOpen(false))
  useEffect(() => {
    if (!EojiOpen) return;

    const emojihandleClickOutside = (e) => {
      if (emojiwarpRef.current && !emojiwarpRef.current.contains(e.target)) {
        setEojiOpen(false); // warp 외부 클릭 시 닫기
      }
    };

    document.addEventListener("mousedown", emojihandleClickOutside);

    return () => {
      document.removeEventListener("mousedown", emojihandleClickOutside);
    };
  }, [EojiOpen]);

  return (
    <>
      <div className="emoji_wrap">
        <ul className="emoji_list">
          {visibleItems.map((item, idx) => (
            <EmojiTag
              unified={item.data.unified}
              idx={idx}
              count={item.count}
            />
          ))}

          {moreCount > 0 && (
            <li className="emoji_more white" onClick={() => setIsOpen(true)}>
              + {moreCount}..
            </li>
          )}
          {/* ⭐ warp만 남기고 외부 클릭 감지 */}
          {isOpen && (
            <div className="emoji_more_warp" ref={warpRef}>
              <ul className="emoji_more_list">
                {emojiList.map((item, idx) => (
                  <EmojiTag
                    unified={item.data.unified}
                    idx={idx}
                    count={item.count}
                  />
                ))}
              </ul>
            </div>
          )}
        </ul>
        <div className="emoji_add_wrap">
          <SmileButton onClick={() => setEojiOpen(true)} />
          {/* 이모지 피커 */}
          {EojiOpen && (
            <div
              className="emoji_modal_warp"
              onClick={(e) => e.stopPropagation()}
              ref={emojiwarpRef}
            >
              <div className="emoji_modal_add">
                <EmojiPicker onEmojiClick={onEmojiClick} emojiStyle="apple" />
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

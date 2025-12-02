import React, { useState, useRef, useEffect } from "react";
import EmojiPicker from "emoji-picker-react";
import SmileButton from "../components/SmileButton.jsx";
import EmojiTag from "../components/EmojiTag.jsx";
import { postStudyListEmoji, getStudyListEmoji } from "../utils/testapi.js";
import "../styles/emoji.css";

export default function EmojiCounterWithImage({ studyId }) {
  const [emojis, setEmojis] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [EojiOpen, setEojiOpen] = useState(false);

  const warpRef = useRef(null); // ⭐ warp를 잡을 ref
  const emojiwarpRef = useRef(null); // ⭐ warp를 잡을 ref

  // 이모지 api 받아오기
  const fetchEmojis = async () => {
    try {
      const { data } = await getStudyListEmoji(studyId);
      setEmojis(data);

      // now you have the actual data
    } catch (error) {
      console.error(error);
    }
  };

  // 이모지 서버에 추가하고 서버에잇는 이모지 받아오기
  const onEmojiClick = async emojiData => {
    const key = emojiData.unified;
    // 스터디 번호
    const studyid = studyId;
    // 이모지 서버에 추가
    await postStudyListEmoji(studyid, key);
    await fetchEmojis();
  };

  // 서버에서 받아온 이모지 코드를 정렬해서 보여주기
  const maxVisible = 3;
  const emojiCodeItems = emojis.slice(0, maxVisible);
  const moreCount = emojis.length > maxVisible ? emojis.length - maxVisible : 0;

  // ⭐ 더보기 팝업 외부 클릭 감지 (warpRef 밖 클릭 시 setIsOpen(false))
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = e => {
      if (warpRef.current && !warpRef.current.contains(e.target)) {
        setIsOpen(false); // warp 외부 클릭 시 닫기
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // ⭐ 이모지 팝업 외부 클릭 감지 (emojiwarpRef 밖 클릭 시 setEojiOpen(false))
  useEffect(() => {
    if (!EojiOpen) return;

    const emojihandleClickOutside = e => {
      if (emojiwarpRef.current && !emojiwarpRef.current.contains(e.target)) {
        setEojiOpen(false); // warp 외부 클릭 시 닫기
      }
    };

    document.addEventListener("mousedown", emojihandleClickOutside);

    return () => {
      document.removeEventListener("mousedown", emojihandleClickOutside);
    };
  }, [EojiOpen]);

  useEffect(() => {
    // 서버에서 이모지목록 보여주지
    fetchEmojis(); // call the async function
  }, []);

  return (
    <>
      <div className="emoji_wrap">
        {emojis.length > 0 && (
          <ul className="emoji_list">
            {emojiCodeItems.map((emojis, idx) => (
              <EmojiTag
                unified={emojis.emojiCode}
                key={idx}
                count={emojis.count}
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
                  {emojis.map((emojis, idx) => (
                    <EmojiTag
                      unified={emojis.emojiCode}
                      key={idx}
                      count={emojis.count}
                    />
                  ))}
                </ul>
              </div>
            )}
          </ul>
        )}

        <div className="emoji_add_wrap">
          <SmileButton onClick={() => setEojiOpen(true)} />
          {/* 이모지 피커 */}
          {EojiOpen && (
            <div
              className="emoji_modal_warp"
              onClick={e => e.stopPropagation()}
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

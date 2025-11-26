import { Emoji } from "emoji-picker-react";
import "../styles/emojitag.css";
export default function EmojiTag({ idx, unified = "1f609", count = "1" }) {
  return (
    <li className="emoji_li" key={idx}>
      <Emoji unified={unified} size={16} emojiStyle="apple" />
      <span className="g_sub_text10 white">{count}</span>
    </li>
  );
}

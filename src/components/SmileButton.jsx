import icsmile from "../assets/icons/ic_smile.svg";
import "../styles/smilebtn.css";

export default function SmileButton({ onClick }) {
  return (
    <div className="smilebtn_wrap" onClick={onClick}>
      <img src={icsmile} alt="스마일아이콘" />
      <button className="smilebtn_btn g_sub_text10">추가</button>
    </div>
  );
}

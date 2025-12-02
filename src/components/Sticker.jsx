import fillImg from "../assets/stickers/img1_fill.svg";

export default function Sticker({ checked, randomEmpty }) {
  return (
    <img
      src={checked ? randomEmpty : fillImg}
      alt="sticker"
      className="sticker"
    />
  );
}

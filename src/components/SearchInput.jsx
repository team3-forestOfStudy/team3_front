// src/components/SearchInput.jsx
import searchIcon from "../assets/icons/search.svg";
import "../styles/searchinput.css";

export default function SearchInput({ value, onChange, onKeyDown }) {
  return (
    <div className="search-input">
      <img src={searchIcon} alt="검색" className="search-input_icon" />
      <input
        type="text"
        className="search-input_field"
        placeholder="스터디 이름을 검색해보세요"
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
      />
    </div>
  );
}

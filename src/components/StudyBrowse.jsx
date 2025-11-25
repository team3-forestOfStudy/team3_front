import { useState } from "react";
import "../styles/global.css";
import "../styles/home.css";
import LabelInput from "./LabelInput.jsx";
import SortDropdown from "./SortDropdown.jsx";
import "../styles/labelinput.css";

export default function StudyBrowse() {
  // 검색어 상태
  const [keyword, setKeyword] = useState("");
  // 정렬 상태
  const [sortType, setSortType] = useState("recent");

  return (
    <div className="g_box studybrowse_box">
      <h2 className="g_tit">스터디 둘러보기</h2>
      <div className="browse-header">
        <LabelInput
          placeholder="스터디 이름을 검색해보세요"
          icon="search"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        <SortDropdown selected={sortType} onChange={setSortType} />
      </div>
    </div>
  );
}

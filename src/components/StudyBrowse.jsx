import { useState } from 'react';
import SearchInput from './SearchInput.jsx';
import SortDropdown from './SortDropdown.jsx';

export default function StudyBrowse() {
  // 검색어 상태
  const [keyword, setKeyword] = useState('');

  return (
    <div className="containner" id="container">
      <div className="contents">
        <h2 className="g_tit">스터디 둘러보기</h2>

        {/* 검색+정렬 한줄로 */}
        <div className="study-filter-bar">
          <SearchInput
            value={keyword}
            onChange={e => setKeyword(e.target.value)}
          />

          <SortDropdown />
          {/* 아래 카드 리스트 */}
        </div>
      </div>
    </div>
  );
}

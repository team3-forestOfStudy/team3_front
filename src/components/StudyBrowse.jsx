// src/components/StudyBrowse.jsx
import { useEffect, useState } from "react";
import StudyCard from "../components/StudyCard";
import StudyCardSkeleton from "../components/StudyCardSkeleton"; // 🔥 추가
import SearchInput from "./SearchInput";
import SortDropdown from "./SortDropdown";
import MoreButton from "./MoreButton";
import "../styles/studycard.css";

// 🔄 Render 배포 후 API URL 변경 필요
// 변경: const API_BASE_URL = "https://team3-forest-study-backend.onrender.com";
const API_BASE_URL = "https://team3-forest-study-backend.onrender.com";
const PAGE_SIZE = 6;
const SKELETON_COUNT = PAGE_SIZE; // 🔥 스켈레톤 6개(2행 x 3열)

export default function StudyBrowse() {
  const [studies, setStudies] = useState([]);
  const [page, setPage] = useState(1);
  const [keyword, setKeyword] = useState("");
  const [sort, setSort] = useState("recent"); // recent | oldest | points_desc | points_asc
  const [hasNextPage, setHasNextPage] = useState(false);
  const [loading, setLoading] = useState(false);

  // 공통으로 쓰는 목록 호출 함수
  const loadStudies = async (pageToLoad, { append } = { append: false }) => {
    try {
      setLoading(true);

      const params = new URLSearchParams();
      params.set("page", pageToLoad);
      params.set("pageSize", PAGE_SIZE);
      if (keyword.trim()) params.set("keyword", keyword.trim());
      if (sort) params.set("sort", sort);

      const res = await fetch(
        `${API_BASE_URL}/api/studies?${params.toString()}`,
      );
      const json = await res.json();

      if (!res.ok || json.result !== "success") {
        alert(json.message || "스터디 목록을 불러오지 못했습니다.");
        return;
      }

      const { studies: newStudies, pagination } = json.data;

      setStudies(prev => (append ? [...prev, ...newStudies] : newStudies));
      setHasNextPage(Boolean(pagination?.hasNextPage));
      setPage(pageToLoad);
    } catch (error) {
      console.error(error);
      alert("서버 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 검색어 / 정렬 기준이 바뀔 때마다 1페이지부터 다시 로드
  useEffect(() => {
    loadStudies(1, { append: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keyword, sort]);

  const handleMore = () => {
    if (!hasNextPage || loading) return;
    loadStudies(page + 1, { append: true });
  };

  const isInitialLoading = loading && studies.length === 0; // 🔥 첫 로딩 + 데이터 없음

  return (
    <section className="home-section home-section--browse">
      <h2 className="g_tit">스터디 둘러보기</h2>

      {/* 검색 + 정렬 한 줄 */}
      <div className="study-filter-bar">
        <SearchInput
          value={keyword}
          onChange={e => setKeyword(e.target.value)}
        />

        <SortDropdown value={sort} onChange={setSort} />
      </div>

      {/* 카드 리스트 / 비어 있을 때 처리 / 스켈레톤 */}
      {isInitialLoading ? (
        // 🔹 첫 로딩: 스켈레톤 카드 6개
        <div className="study-card-list">
          {Array.from({ length: SKELETON_COUNT }).map((_, index) => (
            <StudyCardSkeleton key={index} />
          ))}
        </div>
      ) : !loading && studies.length === 0 ? (
        // 🔹 로딩 끝났는데 스터디 0개
        <div className="home-section-empty home-section-empty--browse">
          <p>아직 둘러 볼 스터디가 없어요</p>
        </div>
      ) : (
        // 🔹 실제 데이터
        <div className="study-card-list">
          {studies.map(study => (
            <StudyCard key={study.studyId} study={study} />
          ))}
        </div>
      )}

      {/* 더보기 버튼
          - 스터디가 하나도 없으면 숨김
          - hasNextPage === false 면 숨김 */}
      {hasNextPage && studies.length > 0 && (
        <div className="more-button-wrapper">
          <MoreButton onClick={handleMore}>더보기</MoreButton>
        </div>
      )}
    </section>
  );
}

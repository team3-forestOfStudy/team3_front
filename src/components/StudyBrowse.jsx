// src/components/StudyBrowse.jsx
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
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
    setLoading(true);

    try {
      const params = new URLSearchParams();
      params.set("page", pageToLoad);
      params.set("pageSize", PAGE_SIZE);
      if (keyword.trim()) params.set("keyword", keyword.trim());
      if (sort) params.set("sort", sort);

      const res = await fetch(
        `${API_BASE_URL}/api/studies?${params.toString()}`,
      );

      // HTTP 상태 코드가 200대가 아니면 에러 처리
      if (!res.ok) {
        toast.error(
          "스터디 목록을 불러오지 못했습니다. 잠시 후 다시 시도해주세요.",
        );
        return;
      }

      const json = await res.json();

      // 서버에서 result로 실패를 알려줄 때
      if (json.result !== "success") {
        toast.error(json.message || "스터디 목록을 불러오지 못했습니다.");
        return;
      }

      const { studies: newStudies, pagination } = json.data;

      setStudies(prev => (append ? [...prev, ...newStudies] : newStudies));
      setHasNextPage(Boolean(pagination?.hasNextPage));
      setPage(pageToLoad);
    } catch (error) {
      console.error("loadStudies error:", error);
      toast.error("서버에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  // 첫 로딩 시 1페이지 호출
  useEffect(() => {
    loadStudies(1, { append: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      ) : studies.length === 0 ? (
        // 🔹 데이터가 없을 때 표시할 내용
        <div className="study-empty">등록된 스터디가 없습니다.</div>
      ) : (
        // 🔹 실제 카드 렌더링
        <div className="study-card-list">
          {studies.map(study => (
            <StudyCard key={study._id} study={study} />
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

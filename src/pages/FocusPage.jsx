import { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import "../styles/focuspage.css";

import arrow from "../assets/icons/arrow.svg";
import Timer from "../components/Timer";
import PointButton from "../components/Atoms/PointButton.jsx";


const API_BASE_URL = "https://team3-forest-study-backend.onrender.com";
// const API_BASE_URL = "http://localhost:4000";
const FocusPage = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const studyIdFromQuery = searchParams.get("studyId");
  // URL 파라미터 또는 쿼리 파라미터에서 studyId 가져오기
  const studyId = id ? Number(id) : studyIdFromQuery ? Number(studyIdFromQuery) : null;
  const [study, setStudy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [totalPoints, setTotalPoints] = useState(0);

  // 스터디 상세 정보 API 호출
  useEffect(() => {
    if (!studyId || isNaN(studyId)) {
      console.warn("studyId가 유효하지 않습니다:", studyId);
      setLoading(false);
      return;
    }

    const fetchStudyData = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/studies/${studyId}`);
        const result = await res.json();

        if (res.ok && result.result === "success") {
          setStudy(result.data);
          setTotalPoints(result.data.totalPoints);
        } else {
          console.error("스터디 조회 실패:", result.message);
        }
      } catch (err) {
        console.error("스터디 API 호출 오류:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStudyData();
  }, [studyId]);

  return (
    <div className="container">
      <div className="contents">
        <div className="g_box">
          {/* 타이틀 영역 Skeleton */}
          <div className="focus-title">
            {loading ? (
              <div className="skeleton skeleton-title"></div>
            ) : study ? (
              <h3 className="title g_sub_text01 fw_eb">
                {study.nickname}  {study.title}
              </h3>
            ) : (
              <h3 className="title g_sub_text01 fw_eb">
                스터디를 불러올 수 없습니다
              </h3>
            )}

            <div className="focus-move-btns">
              {studyId && !isNaN(studyId) && (
                <Link to={`/hobbies?studyId=${studyId}`} className="move-btn-hobbies gray_600">
                  오늘의 습관
                  <img src={arrow} alt="arrow" className="arrow-icon" />
                </Link>
              )}
              <Link to="/" className="move-btn-home gray_600">
                홈
                <img src={arrow} alt="arrow" className="arrow-icon" />
              </Link>
            </div>
          </div>

          {/* 🔥 포인트 영역 Skeleton */}
          <div className="detail_mid_point_wrap">
            <h2 className="g_sub_text07 fw_l gray_600">
              현재까지 획득한 포인트
            </h2>

            {loading ? (
              <div className="skeleton skeleton-point-btn"></div>
            ) : (
              <PointButton>{totalPoints}P 획득</PointButton>
            )}
          </div>

          {/* 타이머 영역 Skeleton */}
          <div className="focus-watch">
            <h3 className="focus-header g_sub_text02 fw_eb">오늘의 집중</h3>

            {loading ? (
              <div className="skeleton skeleton-timer-box"></div>
            ) : study && studyId && !isNaN(studyId) ? (
              <div className="timer">
                <Timer
                  studyId={Number(studyId)}
                  onPointEarned={(point, totalAfter) => {
                    if (typeof totalAfter === "number") {
                      setTotalPoints(totalAfter); 
                    } else if (typeof point === "number") {
                      setTotalPoints(prev => prev + point); // 백업용
                    }
                  }}
                />
              </div>
            ) : (
              <div className="timer">
                <p>스터디 정보를 불러올 수 없습니다</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FocusPage;

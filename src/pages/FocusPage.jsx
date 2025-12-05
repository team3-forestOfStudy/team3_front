import { useEffect, useState, useRef } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import "../styles/focuspage.css";
import Plus from "../assets/icons/plus_gray.svg";
import arrow from "../assets/icons/arrow.svg";
import back from "../assets/icons/back.svg";
import Timer from "../components/Timer";
import PointButton from "../components/Atoms/PointButton.jsx";
import Modal from "../components/Atoms/Modal";

const API_BASE_URL = "https://team3-forest-study-backend.onrender.com";
const FocusPage = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const studyIdFromQuery = searchParams.get("studyId");
  // URL 파라미터 또는 쿼리 파라미터에서 studyId 가져오기
  const studyId = id
    ? Number(id)
    : studyIdFromQuery
      ? Number(studyIdFromQuery)
      : null;
  const [study, setStudy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [totalPoints, setTotalPoints] = useState(0);
  const [timerMinutes, setTimerMinutes] = useState(0);
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const [manualMinutesInput, setManualMinutesInput] = useState("0");
  const manualInputRef = useRef(null);

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

  // 시간 설정
  const handleTimeSet = minutes => {
    setTimerMinutes(minutes);
  };

  const handleQuickTimeClick = minutes => {
    setTimerMinutes(prev => Math.min(prev + minutes, 60));
  };

  const handleManualInputClick = () => {
    // 모달을 열 때 현재 설정된 시간을 input에 반영
    setManualMinutesInput(String(timerMinutes));
    setIsManualModalOpen(true);
  };

  const handleManualMinutesChange = e => {
    const raw = e.target.value;
    setManualMinutesInput(raw);

    if (raw === "") {
      return;
    }

    let value = parseInt(raw, 10);
    if (Number.isNaN(value) || value < 0) value = 0;
    if (value > 60) value = 60;

    setManualMinutesInput(String(value));
  };

  const handleManualModalConfirm = () => {
    const minutes = parseInt(manualMinutesInput, 10) || 0;
    if (minutes > 0) {
      setTimerMinutes(minutes);
      setIsManualModalOpen(false);
    }
  };

  const handleManualModalClose = () => {
    setIsManualModalOpen(false);
  };

  // 모달이 열릴 때 input에 자동 포커스
  useEffect(() => {
    if (isManualModalOpen && manualInputRef.current) {
      // 모달이 완전히 렌더링된 후 포커스
      setTimeout(() => {
        manualInputRef.current?.focus();
        manualInputRef.current?.select(); // 입력된 텍스트 선택
      }, 100);
    }
  }, [isManualModalOpen]);

  return (
    <div className="container">
      <div className="contents">
        <div className="g_box">
          {/* 타이틀 영역 Skeleton */}
          <div className="focus-title">
            <div className="focus-main">
              <Link
                to={`/Studydetails?studyId=${studyId}`}
                className="move-btn-home gray_600"
              >
                <img src={back} alt="back" className="back-icon gray_600" />
              </Link>
              {loading ? (
                <div className="skeleton skeleton-titles"></div>
              ) : study ? (
                <h3 className="title g_sub_text01 fw_eb">
                  {study.nickname}의 {study.title}
                </h3>
              ) : (
                <h3 className="title g_sub_text01 fw_eb">
                  스터디를 불러올 수 없습니다
                </h3>
              )}
            </div>

            <div className="move-buttons">
              <div className="focus-move-btns">
                {studyId && !isNaN(studyId) && (
                  <Link
                    to={`/hobbies?studyId=${studyId}`}
                    className="move-btn-hobbies gray_600"
                  >
                    오늘의 습관
                    <img src={arrow} alt="arrow" className="arrow-icon" />
                  </Link>
                )}
              </div>
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

          {/* 타이머 설정  */}
          <div className="choice-time">
            <div className="recommend-time ">
              <button
                className="one gray_600 g_sub_text07 fw_l"
                onClick={() => handleQuickTimeClick(1)}
              >
                <img src={Plus} alt="plus" className="plus" />
                1분
              </button>
              <button
                className="five gray_600 g_sub_text07 fw_l"
                onClick={() => handleQuickTimeClick(5)}
              >
                <img src={Plus} alt="plus" className="plus" />
                5분
              </button>
              <button
                className="ten gray_600 g_sub_text07 fw_l"
                onClick={() => handleQuickTimeClick(10)}
              >
                <img src={Plus} alt="plus" className="plus" />
                10분
              </button>
              <button
                className="maual-mins bg_green_300 g_sub_text07 fw_l white"
                onClick={handleManualInputClick}
              >
                수동 입력
              </button>
            </div>
          </div>

          {/* 수동 입력 모달 */}
          <Modal isOpen={isManualModalOpen} onClose={handleManualModalClose}>
            <div className="timer-modal">
              <h3 className="timer-modal-title g_sub_text02 fw_eb">
                집중 시간 설정
              </h3>

              <div className="timer-modal-inputs">
                <div className="timer-modal-field g_sub_text03 fw_eb">
                  <input
                    ref={manualInputRef}
                    type="number"
                    min="0"
                    max="60"
                    value={manualMinutesInput}
                    onChange={handleManualMinutesChange}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleManualModalConfirm();
                      }
                    }}
                    className="timer-modal-input"
                  />
                  <span className="timer-modal-input">분</span>
                </div>
              </div>

              <div className="timer-modal-buttons">
                <button
                  type="button"
                  className="timer-modal-btn confirm bg_green_300 g_sub_text03 fw_eb white"
                  onClick={handleManualModalConfirm}
                >
                  확인
                </button>
                <button
                  type="button"
                  className="timer-modal-btn cancel bg_red_200 g_sub_text03 fw_eb white"
                  onClick={handleManualModalClose}
                >
                  취소
                </button>
              </div>
            </div>
          </Modal>

          {/* 타이머 영역 Skeleton */}
          <div className="focus-watch">
            <h3 className="focus-header g_sub_text02 fw_eb">오늘의 집중</h3>

            {loading ? (
              <div className="skeleton skeleton-timer-box"></div>
            ) : study && studyId && !isNaN(studyId) ? (
              <div className="timer">
                <Timer
                  studyId={Number(studyId)}
                  initialMinutes={timerMinutes}
                  onTimeSet={handleTimeSet}
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

import { Title } from "../mock/Title";
import Date from "../utils/TodayDate";
import { Chip } from "../components/Atoms/Chip";
import { Link, useParams, useSearchParams } from "react-router-dom";
import arrow from "../assets/icons/arrow.svg";
import "../styles/hobbiespage.css";
import { useEffect, useState } from "react";
import ListModal from "../components/ListModal";

const API_BASE_URL = "https://team3-forest-study-backend.onrender.com";

const HobbiesPage = () => {
  // 👉 URL에서 /study/:id/hobbies 의 id를 가져옴
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  // URL 파라미터에서 studyId 가져오기 (쿼리 파라미터 또는 라우트 파라미터)
  const studyIdFromQuery = searchParams.get("studyId");
  const studyId = id
    ? Number(id)
    : studyIdFromQuery
      ? Number(studyIdFromQuery)
      : null;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [habits, setHabits] = useState([]);
  const [study, setStudy] = useState(null);
  const [loading, setLoading] = useState(true);

  // 오늘 체크된 habit의 id 저장 (API에서 받아온 체크 상태)
  const [checkedHabitIds, setCheckedHabitIds] = useState([]);

  // 스터디 상세 정보 API 호출
  useEffect(() => {
    if (!studyId) {
      setLoading(false);
      return;
    }

    const fetchStudyData = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/studies/${studyId}`);
        const result = await res.json();

        if (res.ok && result.result === "success") {
          setStudy(result.data);
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

  // 스터디별 습관 목록 조회 및 오늘의 습관 체크 상태 조회
  useEffect(() => {
    if (!studyId || isNaN(studyId)) {
      setHabits([]);
      setCheckedHabitIds([]);
      return;
    }

    const fetchHabits = async () => {
      try {
        const res = await fetch(
          `${API_BASE_URL}/api/studies/${studyId}/habits`
        );
        const result = await res.json();

        if (res.ok && result.result === "success") {
          // API 응답 구조에 따라 배열 추출
          let habitsArray = null;
          
          if (Array.isArray(result.data)) {
            habitsArray = result.data;
          } else if (Array.isArray(result.data?.habits)) {
            habitsArray = result.data.habits;
          } else if (Array.isArray(result.habits)) {
            habitsArray = result.habits;
          }

          if (Array.isArray(habitsArray)) {
            setHabits(habitsArray);
            
            // 오늘 체크된 습관 ID 추출 (checkedToday 또는 isCheckedToday 필드 확인)
            const checkedIds = habitsArray
              .filter(habit => habit.checkedToday || habit.isCheckedToday)
              .map(habit => habit.id || habit.habitId);
            setCheckedHabitIds(checkedIds);
          }
        }
      } catch (error) {
        console.error("습관 목록 불러오기 실패", error);
        setHabits([]);
        setCheckedHabitIds([]);
      }
    };

    fetchHabits();
  }, [studyId]);

  // 습관 체크 토글 (클릭 시 체크/언체크)
  const handleClickHabit = async habit => {
    if (!studyId || isNaN(studyId)) return;

    const habitId = habit.id || habit.habitId;
    const isCurrentlyChecked = checkedHabitIds.includes(habitId);

    // UI 즉시 업데이트 (낙관적 업데이트)
    setCheckedHabitIds(prev =>
      isCurrentlyChecked
        ? prev.filter(id => id !== habitId)
        : [...prev, habitId]
    );

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/studies/${studyId}/habits/${habitId}/check-today`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        // 실패 시 원래 상태로 복구
        setCheckedHabitIds(prev =>
          isCurrentlyChecked
            ? [...prev, habitId]
            : prev.filter(id => id !== habitId)
        );
        console.error("습관 체크 업데이트 실패");
      }
    } catch (error) {
      // 실패 시 원래 상태로 복구
      setCheckedHabitIds(prev =>
        isCurrentlyChecked
          ? [...prev, habitId]
          : prev.filter(id => id !== habitId)
      );
      console.error("네트워크 오류", error);
    }
  };

  /* 모달 열기 */
  const handleOpen = () => setIsModalOpen(true);
  /* 모달 닫기 */
  const handleClose = () => setIsModalOpen(false);

  // 습관 목록이 업데이트되면 다시 조회
  const handleHabitsUpdated = () => {
    if (!studyId || isNaN(studyId)) return;

    const fetchHabits = async () => {
      try {
        const res = await fetch(
          `${API_BASE_URL}/api/studies/${studyId}/habits`
        );
        const result = await res.json();

        if (res.ok && result.result === "success") {
          let habitsArray = null;
          
          if (Array.isArray(result.data)) {
            habitsArray = result.data;
          } else if (Array.isArray(result.data?.habits)) {
            habitsArray = result.data.habits;
          } else if (Array.isArray(result.habits)) {
            habitsArray = result.habits;
          }

          if (Array.isArray(habitsArray)) {
            setHabits(habitsArray);
            
            const checkedIds = habitsArray
              .filter(habit => habit.checkedToday || habit.isCheckedToday)
              .map(habit => habit.id || habit.habitId);
            setCheckedHabitIds(checkedIds);
          }
        }
      } catch (error) {
        console.error("습관 목록 다시 불러오기 실패", error);
      }
    };

    fetchHabits();
  };

  return (
    <>
      <div className="container hobbies-container">
        <div className="contents hobbies-box">
          {/* 헤더 */}
          <div className="g_box hobbies-main">
            <div className="hobbies-header">
              {loading ? (
                <div className="skeleton skeleton-title"></div>
              ) : study ? (
                <h3 className="title g_sub_text01 fw_eb">
                  {study.nickname}의 {study.title}
                </h3>
              ) : (
                <h3 className="title g_sub_text01 fw_eb">{Title}</h3>
              )}
              <div className="hobbies-moveButtons g_sub_text10 fw_m">
                {studyId && (
                  <Link
                    to={`/Focus?studyId=${studyId}`}
                    className="move-btn-focus gray_600"
                  >
                    오늘의 집중
                    <img src={arrow} alt="arrow" className="arrow-icon" />
                  </Link>
                )}

                <Link to="/" className="move-btn-home gray_600">
                  홈
                  <img src={arrow} alt="arrow" className="arrow-icon" />
                </Link>
              </div>
            </div>

            {/* 현재시간 */}
            <div className="TodayTime">
              <h3 className="g_sub_text06 fw_l">현재시간</h3>
              <Date className="date-box g_sub_text10 fw_m" />
            </div>

            {/* 오늘의 습관 */}
            <div className="hobbies-list-box">
              <div className="list-header">
                <h3 className="list-title g_sub_text02 fw_eb">오늘의 습관</h3>
                <button className="edit-btn gray_600" onClick={handleOpen}>
                  목록 수정
                </button>
              </div>
              <div className="chip-list">
                {!Array.isArray(habits) || habits.length === 0 ? (
                  <p className="no-habit-message g_sub_text04 fw_m gray_600">
                    아직 습관이 없어요. <br />
                    <span>목록 수정을 눌러 습관을 생성해보세요!</span>
                  </p>
                ) : (
                  habits.map(habit => {
                    const habitId = habit.id || habit.habitId;
                    const isChecked = checkedHabitIds.includes(habitId);
                    
                    return (
                      <Chip
                        key={habitId}
                        onClick={() => handleClickHabit(habit)}
                        className={`fw_b gray_600 habbit-chip ${
                          isChecked ? "habbit-chip--selected" : ""
                        }`}
                      >
                        {habit.title || habit.name}
                      </Chip>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <ListModal
        isOpen={isModalOpen}
        onClose={handleClose}
        habits={habits}
        studyId={studyId}
        onHabitsUpdated={handleHabitsUpdated}
      />
    </>
  );
};

export default HobbiesPage;

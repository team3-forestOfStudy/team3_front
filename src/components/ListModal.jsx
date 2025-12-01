import Modal from "./Atoms/Modal";
import { useEffect, useState } from "react";
import "../styles/listmodal.css";
import Trash from "../assets/icons/trash.svg";

const API_BASE_URL = "https://team3-forest-study-backend.onrender.com";

const ListModal = ({ isOpen, onClose, habits, studyId, onHabitsUpdated }) => {
  const [localHabits, setLocalHabits] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // 기존 habits를 localHabits로 복사
      setLocalHabits(Array.isArray(habits) ? [...habits] : []);
    }
  }, [isOpen, habits]);

  // 습관 삭제 (즉시 API 호출)
  const handleDelete = async (id) => {
    if (!studyId || isNaN(studyId)) {
      // studyId가 없으면 로컬에서만 삭제
      setLocalHabits(prev => prev.filter(habit => {
        const habitId = habit.id || habit.habitId;
        return habitId !== id;
      }));
      return;
    }

    const habitId = id;
    
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/studies/${studyId}/habits/${habitId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        // 삭제 성공 시 로컬 상태에서도 제거
        setLocalHabits(prev => prev.filter(habit => {
          const hId = habit.id || habit.habitId;
          return hId !== habitId;
        }));
      } else {
        console.error("습관 삭제 실패");
      }
    } catch (error) {
      console.error("습관 삭제 중 네트워크 오류", error);
    }
  };

  // 습관 추가 (로컬 상태에만 추가, 저장 시 API 호출)
  const handleAddHabit = () => {
    setLocalHabits(prev => [...prev, { id: `temp-${Date.now()}`, title: "" }]);
  };

  const handleChangeTitle = (id, value) => {
    setLocalHabits(prev =>
      prev.map(habit => {
        const habitId = habit.id || habit.habitId;
        return habitId === id ? { ...habit, title: value } : habit;
      }),
    );
  };

  const handleCancel = () => {
    onClose();
  };

  // 습관 생성 및 수정 저장
  const handleSubmit = async () => {
    if (!studyId || isNaN(studyId)) {
      console.error("studyId가 유효하지 않습니다");
      return;
    }

    setIsSaving(true);

    try {
      // 제목이 있는 습관만 필터링
      const habitsToSave = localHabits.filter(habit => {
        const title = habit.title || habit.name;
        return title && title.trim() !== "";
      });

      // 새로 추가된 습관들 (temp-로 시작하는 ID) - POST로 생성
      const newHabits = habitsToSave.filter(habit => {
        const habitId = habit.id || habit.habitId;
        return String(habitId).startsWith("temp-");
      });

      // 기존 습관들 (temp-가 아닌 ID) - PATCH로 수정
      const existingHabits = habitsToSave.filter(habit => {
        const habitId = habit.id || habit.habitId;
        return !String(habitId).startsWith("temp-");
      });

      // 1. 새 습관 생성 (POST)
      for (const habit of newHabits) {
        try {
          const response = await fetch(
            `${API_BASE_URL}/api/studies/${studyId}/habits`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                title: habit.title || habit.name,
              }),
            }
          );

          if (response.ok) {
            const result = await response.json();
            // 생성된 습관의 habitId를 받아서 즉시 수정 (PATCH)
            const createdHabitId = result.data?.habitId || result.data?.id || result.habitId || result.id;
            if (createdHabitId) {
              // 생성 후 바로 수정 (PATCH)
              await fetch(
                `${API_BASE_URL}/api/studies/${studyId}/habits/${createdHabitId}`,
                {
                  method: "PATCH",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    title: habit.title || habit.name,
                  }),
                }
              );
            }
          } else {
            console.error(`습관 생성 실패: ${habit.title}`);
          }
        } catch (error) {
          console.error(`습관 생성 중 오류: ${habit.title}`, error);
        }
      }

      // 2. 기존 습관 수정 (PATCH)
      for (const habit of existingHabits) {
        try {
          const habitId = habit.id || habit.habitId;
          const response = await fetch(
            `${API_BASE_URL}/api/studies/${studyId}/habits/${habitId}`,
            {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                title: habit.title || habit.name,
              }),
            }
          );

          if (!response.ok) {
            console.error(`습관 수정 실패: ${habit.title}`);
          }
        } catch (error) {
          console.error(`습관 수정 중 오류: ${habit.title}`, error);
        }
      }

      // 습관 목록 업데이트 후 모달 닫기
      if (onHabitsUpdated) {
        onHabitsUpdated();
      }
      onClose();
    } catch (error) {
      console.error("습관 저장 중 오류", error);
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Modal className="listModal" isOpen={isOpen} onClose={handleCancel}>
      <h1 className="listModal-title g_sub_text02 fw_eb">습관 목록</h1>

      <ul className="listModal-list">
        {localHabits.map(habit => {
          const habitId = habit.id || habit.habitId;
          const title = habit.title || habit.name || "";
          
          return (
            <li key={habitId} className="listModal-item gray_600">
              <input
                className="habitInput"
                value={title}
                placeholder="습관을 입력하세요"
                onChange={e => handleChangeTitle(habitId, e.target.value)}
              />

              <button
                type="button"
                className="deleteButton"
                aria-label={`${title} 삭제`}
                onClick={() => handleDelete(habitId)}
              >
                <img src={Trash} alt="삭제" className="deleteIcon" />
              </button>
            </li>
          );
        })}
      </ul>

      <button
        type="button"
        className="addHabitButton fw_l"
        onClick={handleAddHabit}
      >
        +
      </button>

      <div className="buttonBox">
        <button
          type="button"
          className="Button01 w50 bg_gray_300"
          onClick={handleCancel}
        >
          취소
        </button>
        <button
          type="button"
          className="Button01 w50 bg_green_300"
          onClick={handleSubmit}
          disabled={isSaving}
        >
          {isSaving ? "저장 중..." : "수정 완료"}
        </button>
      </div>
    </Modal>
  );
};

export default ListModal;

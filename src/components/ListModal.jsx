import Modal from "./Atoms/Modal";
import { useEffect, useState } from "react";
import "../styles/listmodal.css";
import Trash from "../assets/icons/trash.svg";
import { showHabitsUpdateToast } from "../utils/toastmessage";

const API_BASE_URL = "https://team3-forest-study-backend.onrender.com";

const ListModal = ({ isOpen, onClose, habits, studyId, onHabitsUpdated }) => {
  const [localHabits, setLocalHabits] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [editingHabitIds, setEditingHabitIds] = useState(new Set());
  const [deletedHabitIds, setDeletedHabitIds] = useState(new Set()); // 삭제된 습관 ID 추적
  const [deletedHabitNames, setDeletedHabitNames] = useState([]); // 삭제된 습관 이름 추적

  useEffect(() => {
    if (isOpen) {
      setLocalHabits(Array.isArray(habits) ? [...habits] : []);
      setEditingHabitIds(new Set());
      setDeletedHabitIds(new Set()); // 모달 열릴 때 삭제 목록 초기화
      setDeletedHabitNames([]); // 삭제된 습관 이름 초기화
    }
  }, [isOpen, habits]);

  const handleDelete = (id) => {
    const habitId = id;
    
    // temp-로 시작하는 임시 습관은 바로 삭제 (서버에 없음)
    if (String(habitId).startsWith("temp-")) {
      setLocalHabits(prev => prev.filter(habit => {
        const hId = habit.id || habit.habitId;
        return hId !== habitId;
      }));
      setEditingHabitIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(habitId);
        return newSet;
      });
      return;
    }

    // 삭제할 습관의 이름 찾기
    const habitToDelete = localHabits.find(habit => {
      const hId = habit.id || habit.habitId;
      return hId === habitId;
    });
    const habitName = habitToDelete?.title || habitToDelete?.name || "";

    // 서버에 저장된 습관은 삭제 목록에 추가하고 로컬에서만 제거
    // 실제 API 삭제는 "수정 완료" 버튼을 눌렀을 때 수행
    setDeletedHabitIds(prev => new Set([...prev, habitId]));
    if (habitName) {
      setDeletedHabitNames(prev => [...prev, habitName]);
    }
    setLocalHabits(prev => prev.filter(habit => {
      const hId = habit.id || habit.habitId;
      return hId !== habitId;
    }));
    setEditingHabitIds(prev => {
      const newSet = new Set(prev);
      newSet.delete(habitId);
      return newSet;
    });
  };

  const handleAddHabit = () => {
    const tempId = `temp-${Date.now()}`;
    setLocalHabits(prev => [...prev, { 
      id: tempId,
      habitId: tempId,
      title: "" 
    }]);
    setEditingHabitIds(prev => new Set([...prev, tempId]));
  };

  const handleChangeTitle = (id, value) => {
    setLocalHabits(prev =>
      prev.map(habit => {
        const habitId = habit.id || habit.habitId;
        return habitId === id ? { ...habit, title: value } : habit;
      }),
    );
  };

  const handleHabitClick = (habitId) => {
    setEditingHabitIds(prev => new Set([...prev, habitId]));
  };

  const handleCancel = () => {
    // 취소 시 모든 변경사항 초기화
    setLocalHabits(Array.isArray(habits) ? [...habits] : []);
    setEditingHabitIds(new Set());
    setDeletedHabitIds(new Set());
    setDeletedHabitNames([]);
    onClose();
  };

  const handleSubmit = async () => {
    if (!studyId || isNaN(studyId)) {
      console.error("studyId가 유효하지 않습니다");
      return;
    }

    setIsSaving(true);

    try {
      // 1. 먼저 삭제된 습관들을 API로 삭제
      const deletePromises = Array.from(deletedHabitIds).map(async (habitId) => {
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

          if (!response.ok) {
            console.error(`습관 삭제 실패: ${habitId}`);
            return false;
          }
          return true;
        } catch (error) {
          console.error(`습관 삭제 중 오류: ${habitId}`, error);
          return false;
        }
      });

      await Promise.all(deletePromises);

      // 2. 수정/추가할 습관들 처리
      const habitsToSave = localHabits.filter(habit => {
        const habitId = habit.id || habit.habitId;
        return editingHabitIds.has(habitId);
      });

      const validHabits = habitsToSave.filter(habit => {
        const title = habit.title || habit.name || "";
        return title.trim() !== "";
      });

      const newHabits = validHabits.filter(habit => {
        const habitId = habit.id || habit.habitId;
        return String(habitId).startsWith("temp-");
      });

      const existingHabits = validHabits.filter(habit => {
        const habitId = habit.id || habit.habitId;
        return !String(habitId).startsWith("temp-");
      });

      // 3. 새 습관 생성
      const createPromises = newHabits.map(async (habit) => {
        try {
          const title = habit.title || habit.name || "";
          const response = await fetch(
            `${API_BASE_URL}/api/studies/${studyId}/habits`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                name: title,
              }),
            }
          );

          if (!response.ok) {
            console.error(`습관 생성 실패: ${title}`);
            return null;
          }
          return await response.json();
        } catch (error) {
          console.error(`습관 생성 중 오류: ${habit.title}`, error);
          return null;
        }
      });

      // 4. 기존 습관 수정
      const updatePromises = existingHabits.map(async (habit) => {
        try {
          const habitId = habit.id || habit.habitId;
          const title = habit.title || habit.name || "";
          
          const response = await fetch(
            `${API_BASE_URL}/api/studies/${studyId}/habits/${habitId}`,
            {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                name: title,
              }),
            }
          );

          if (!response.ok) {
            console.error(`습관 수정 실패: ${title}`);
            return null;
          }
          return await response.json();
        } catch (error) {
          console.error(`습관 수정 중 오류: ${habit.title}`, error);
          return null;
        }
      });

      await Promise.all([...createPromises, ...updatePromises]);

      // 5. 추가된 습관 이름 수집
      const addedHabitNames = newHabits
        .map(habit => habit.title || habit.name || "")
        .filter(name => name.trim() !== "");

      // 6. Toast로 변경사항 표시
      showHabitsUpdateToast(deletedHabitNames, addedHabitNames);

      // 7. 모든 작업 완료 후 습관 목록 재조회
      if (onHabitsUpdated) {
        await onHabitsUpdated();
      }
      
      // 8. 상태 초기화
      setEditingHabitIds(new Set());
      setDeletedHabitIds(new Set());
      setDeletedHabitNames([]);
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
          const isEditing = editingHabitIds.has(habitId);
          
          return (
            <li 
              key={habitId} 
              className="listModal-item gray_600"
              onClick={() => !isEditing && handleHabitClick(habitId)}
              style={{ cursor: isEditing ? "default" : "pointer" }}
            >
              <input
                className="habitInput"
                value={title}
                placeholder="습관을 입력하세요"
                readOnly={!isEditing}
                onClick={(e) => e.stopPropagation()}
                onChange={e => handleChangeTitle(habitId, e.target.value)}
                onFocus={() => !isEditing && handleHabitClick(habitId)}
              />

              <button
                type="button"
                className="deleteButton"
                aria-label={`${title} 삭제`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(habitId);
                }}
              >
                <img src={Trash} alt="삭제" className="deleteIcon" />
              </button>
            </li>
          );
        })}
      </ul>

      {localHabits.length < 13 && (
        <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
          <button
            type="button"
            className="addHabitButton fw_l"
            onClick={handleAddHabit}
          >
            +
          </button>
        </div>
      )}

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

import Modal from "./Atoms/Modal";
import { useEffect, useState } from "react";
import "../styles/listmodal.css";
import Trash from "../assets/icons/trash.svg";

const API_BASE_URL = "https://team3-forest-study-backend.onrender.com";

const ListModal = ({ isOpen, onClose, habits, studyId, onHabitsUpdated }) => {
  const [localHabits, setLocalHabits] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [editingHabitIds, setEditingHabitIds] = useState(new Set()); 

  useEffect(() => {
    if (isOpen) {
      setLocalHabits(Array.isArray(habits) ? [...habits] : []);
      setEditingHabitIds(new Set()); 
    }
  }, [isOpen, habits]);

  const handleDelete = async (id) => {
    if (!studyId || isNaN(studyId)) {
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
    onClose();
  };

  const handleSubmit = async () => {
    if (!studyId || isNaN(studyId)) {
      console.error("studyId가 유효하지 않습니다");
      return;
    }

    setIsSaving(true);

    try {
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

      if (onHabitsUpdated) {
        await onHabitsUpdated();
      }
      setEditingHabitIds(new Set()); 
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

import Modal from "./Atoms/Modal";
import { Chip } from "./Atoms/Chip";
import { useEffect, useState } from "react";
import "../styles/listmodal.css";
import Trash from "../assets/icons/trash.svg";
import data from "../mock/inital-content.json";

const ListModal = ({ isOpen, onClose, habits, onSave }) => {
  const [localHabits, setLocalHabits] = useState(data);

  useEffect(() => {
    if (isOpen) {
      setLocalHabits(habits);
    }
  }, [isOpen, habits]);

  const handleDelete = id => {
    setLocalHabits(prev => prev.filter(habit => habit.id !== id));
  };

  const handleAddHabit = () => {
    setLocalHabits(prev => [...prev, { id: Date.now(), title: "" }]);
  };

  const handleChangeTitle = (id, value) => {
    setLocalHabits(prev =>
      prev.map(habit => (habit.id === id ? { ...habit, title: value } : habit)),
    );
  };
  const handleCancel = () => {
    onClose();
  };

  const handleSubmit = () => {
    const cleaned = localHabits.filter(habit => habit.title.trim() !== "");

    onSave(cleaned);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Modal className="listModal" isOpen={isOpen} onClose={handleCancel}>
      <h1 className="listModal-title g_sub_text02 fw_eb">습관 목록</h1>

      <ul className="listModal-list">
        {localHabits.map(habit => (
          <li key={habit.id} className="listModal-item gray_600">
            <input
              className="habitInput"
              value={habit.title}
              placeholder="습관을 입력하세요"
              onChange={e => handleChangeTitle(habit.id, e.target.value)}
            />

            <button
              type="button"
              className="deleteButton"
              aria-label={`${habit.title} 삭제`}
              onClick={() => handleDelete(habit.id)}
            >
              <img src={Trash} alt="삭제" className="deleteIcon" />
            </button>
          </li>
        ))}
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
        >
          수정 완료
        </button>
      </div>
    </Modal>
  );
};

export default ListModal;

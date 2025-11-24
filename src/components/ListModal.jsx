import Modal from "./Atoms/Modal";
import { Chip } from "./Atoms/Chip";
import { useState } from "react";
import "../styles/ListModal.css";
import Trash from "../assets/icons/trash.svg";

const INITIAL_CONTENT = [
  { id: 1, title: "미라클모닝 6시 기상" },
  { id: 2, title: "아침 챙겨 먹기" },
  { id: 3, title: "React 스터디 책 1챕터 읽기" },
  { id: 4, title: "스트레칭" },
  { id: 5, title: "영양제 챙겨먹기" },
  { id: 6, title: "사이드 프로젝트" },
  { id: 7, title: "물 2L 먹기" },
  { id: 8, title: "___________" }, 
];

const ListModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [habits, setHabits] = useState(INITIAL_CONTENT);

  const handleDelete = (id) => {
    setHabits((prev) => prev.filter((habit) => habit.id !== id));
  };

  const handleAddHabit = () => {
    setHabits((prev) => [
      ...prev,
      { id: Date.now(), title: "______" },
    ]);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      <button type="button" onClick={() => setIsOpen(true)}>
        리스트 모달 열기
      </button>

      <Modal className="listModal" isOpen={isOpen} onClose={handleClose}>
        <h1 className="listModal-title g_sub_text02 fw_eb">습관 목록</h1>

        <ul className="listModal-list">
          {habits.map((habit) => (
            <li key={habit.id} className="listModal-item gray_600">
              <Chip className="habitChip">
                {habit.title}
              </Chip>

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
            onClick={handleClose}
          >
            취소
          </button>
          <button
            type="button"
            className="Button01 w50 bg_green_300"
            onClick={handleClose}
          >
            수정 완료
          </button>
        </div>
      </Modal>
    </>
  );
};

export default ListModal;
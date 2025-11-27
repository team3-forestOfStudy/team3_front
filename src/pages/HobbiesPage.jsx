import { Title } from '../mock/Title';
import Date from '../utils/Date';
import { Chip } from '../components/Atoms/Chip';
import { Link } from 'react-router-dom';
import arrow from '../assets/icons/arrow.svg';
import '../styles/hobbiespage.css';
import { useEffect, useState } from 'react';
import ListModal from '../components/ListModal';
import MOCK_HABITS from '../mock/inital-content.json';

const HobbiesPage = () => {
  // const compledIds = new Set();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [habits, setHabits] = useState([])

  //선택된 habbit의 id 저장
  const [selectedHabitIds, setSelectedHabitIds] = useState([]);

  useEffect(() => {
    setHabits(MOCK_HABITS);

    // fetch("/api/habits")
    //   .then((res) => res.json())
    //   .then((data) => setHabits(data))
    //   .catch((error) => {
    //     console.error("습관 목록 불러오기 실패", error);
    //   });
  }, []);


  const handleClickHabit = async habit => {
    setSelectedHabitIds(prev => 
      prev.includes(habit.id)
        ? prev.filter(id => id !== habit.id)
        : [...prev, habit.id]
    );

    try {
      const response = await fetch(`/api/habits/${habit.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          done: true,
        }),
      });

      if (!response.ok) {
        console.error('습관 업데이트 실패');
      }
    } catch (error) {
      console.error('네트워크 오류', error);
    }
  };

  /*모달 열기 */
  const handleOpen = () => setIsModalOpen(true);
  /*모달 닫기 */
  const handleClose = () => setIsModalOpen(false);

  const handleSaveHabits = updatedHabits => {
    setHabits(updatedHabits)
  }

  return (
    <>
      <div className="container hobbies-container">
        <div className="contents hobbies-box">
          {/* 헤더 */}
          <div className="g_box hobbies-main">
            <div className="hobbies-header">
              <h3 className="title g_sub_text01 fw_eb">{Title}</h3>
              <div className="hobbies-moveButtons g_sub_text10 fw_m">
                <Link to="/Focus" className="move-btn-focus gray_600">
                  오늘의 집중
                  <img src={arrow} alt="arrow" className="arrow-icon" />
                </Link>

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
                {habits.length === 0 ? (
                  <p className="no-habit-message g_sub_text04 fw_m gray_600">
                    아직 습관이 없어요. <br />
                    <span>
                      목록 수정을 눌러 습관을 생성해보세요!
                    </span>
                  </p>
                ) : (
                  habits.map(habit => (
                    <Chip
                      key={habit.id}
                      onClick={() => handleClickHabit(habit)}
                      className={`fw_b gray_600 habbit-chip ${
                        selectedHabitIds.includes(habit.id)
                          ? 'habbit-chip--selected'
                          : ''
                      }`}
                    >
                      {habit.title}
                    </Chip>
                  ))
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
      onSave={handleSaveHabits}
      />
    </>
  );
};

export default HobbiesPage;

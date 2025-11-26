import { Title } from '../mock/Title';
import Date from '../utils/Date';
import { Chip } from '../components/Atoms/Chip';
import { Link } from 'react-router-dom';
import data from '../mock/inital-content.json';
import arrow from '../assets/icons/arrow.svg';
import '../styles/hobbiespage.css';
import { useState } from 'react';
import ListModal from '../components/ListModal';

const HobbiesPage = () => {
  const compledIds = new Set();
  const [isModalOpen, setIsModalOpen] = useState(false);

  /*모달 열기 */
  const handleOpen = () => setIsModalOpen(true);
  /*모달 닫기 */
  const handleClose = () => setIsModalOpen(false);

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

                <Link to="/" className="move-btn-home gray_600 home">
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
                <h3 className="g_sub_text02 fw_eb">오늘의 습관</h3>
                <button className="edit-btn" onClick={handleOpen}>
                  목록 수정
                </button>
              </div>
              <div className="chip-list">
                {data.map(item => {
                  const isComplted = compledIds.has(item.id);
                  return (
                    /*여기서 이제 여러개의 chip이 들어감 */
                    <Chip
                      key={item.id}
                      className={`habbit-chip ${
                        isComplted
                          ? 'habbit-chip--active'
                          : 'habbit-chip-inactive'
                      }`}
                    >
                      {item.title}
                    </Chip>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
      <ListModal isOpen={isModalOpen} onClose={handleClose} />
    </>
  );
};

export default HobbiesPage;

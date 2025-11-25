import { Title } from "../mock/Title";
import Date from "../utils/Date";
import { Chip } from "../components/Atoms/Chip";
import { Router, Link } from "react-router-dom";
import data from "../mock/inital-content.json";
import arrow from "../assets/icons/arrow.svg";
import "../styles/hobbiespage.css";
import { useState } from "react";
import Modal from "../components/ListModal"

const HobbiesPage = ( onClick ) => {
  const compledIds = new Set();
  const [showModal, setShowModal] = useState(false);

  /*모달 열기 */
  const openModal = () => setShowModal(true);
  /*모달 닫기 */
  const closeModal = () => setShowModal(false);

  return (
    <>
      <div className="container hobbies-container">
        <div className="contents hobbies-box">
          {/* 헤더 */}
          <div className="g_box hobbies-header">
            <div className="hobbies-header">
              <h3 className="title g_sub_text01 fw_eb">{Title}</h3>

              <div className="hobbies-moveButtons">
                <Link to="/Focus" className="move-btn">
                  오늘의 집중
                  <img src={arrow} alt="arrow"></img>
                </Link>

                <Link to="/" className="move-btn">
                  홈<img src={arrow} alt="arrow"></img>
                </Link>
              </div>
            </div>
            {/* 현재시간 */}
            <div className="TodayTime">
              <h3 className="g_sub_text06 fw_l">현재시간</h3>
              <Date />
            </div>
            {/* 오늘의 습관 */}
            <article className="hobbies-list-box">
              <div className="list-header">
                <h3>오늘의 습관</h3>
                <button className="edit-btn" onClick={openModal}>목록 수정</button>
              </div>
              <div className="chip-list">
                {data.map((item) => {
                  const isComplted = compledIds.has(item.id);
                  return (
                    /*여기서 이제 여러개의 chip이 들어감 */
                    <Chip
                      key={item.id}
                      className={`habbit-chip ${
                        isComplted
                          ? "habbit-chip--active"
                          : "habbit-chip-inactive"
                      }`}
                    >
                      {item.title}
                    </Chip>
                  );
                })}
              </div>
            </article>
          </div>
        </div>
      </div>
    </>
  );
};

export default HobbiesPage;

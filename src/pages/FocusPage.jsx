import { Link, Router } from 'react-router-dom';
import { Title } from '../mock/Title';
import arrow from '../assets/icons/arrow.svg';
import "../styles/focuspage.css"
import Start from "../assets/icons/starticon.svg"

const FocusPage = () => {
  return (
    <>
      <div className="container">
        <div className="contents">
          <div className="g_box">
            <div className="focus-title">
              <h3 className="title g_sub_text01 fw_eb">{Title}</h3>
              <div className="focus-move-btns">
                <Link to="/Hobbies" className="move-btn-hobbies gray_600">
                  오늘의 습관
                  <img src={arrow} alt="arrow" className="arrow-icon" />
                </Link>
                <Link to="/" className="move-btn-home gray_600">
                  홈
                  <img src={arrow} alt="arrow" className="arrow-icon" />
                </Link>
              </div>
            </div>

            <div className="point-find">
              <h3 className="g_sub_text06 fw_l">현재까지 획득한 포인트</h3>
              <h3 className="reward-point">310p 획득</h3>
              {/* <Point /> */}
            </div>

            <div className="focus-watch">
              <h3 className="focus-header g_sub_text02 fw_eb">오늘의 집중</h3>
              <div className="stopwatch g_sub_text20">25:00</div>
              <div className="button-wrap">
              <button className="start-button bg_green_300 fw_eb white g_sub_text01">
                <img src={Start} alt="start-button" className="start-button-icon "/>Start!</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FocusPage;

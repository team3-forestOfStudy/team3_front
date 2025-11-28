import { Link } from "react-router-dom";
import { Title } from "../mock/Title";
import arrow from "../assets/icons/arrow.svg";
import "../styles/focuspage.css";
import Timer from "../components/Timer";
import PointButton from '../components/Atoms/PointButton.jsx';

const FocusPage = () => {

  const point = '10' + 'P';

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

            {/* 포인트영역 */}
            <div className="detail_mid_point_wrap">
              <h2 className="g_sub_text07 fw_l gray_600">
                현재까지 획득한 포인트
              </h2>
              <PointButton>{point} 획득</PointButton>
            </div>

            <div className="focus-watch">
              <h3 className="focus-header g_sub_text02 fw_eb">오늘의 집중</h3>
              <div className="timer">
              <Timer />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FocusPage;

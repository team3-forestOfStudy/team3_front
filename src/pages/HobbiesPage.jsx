import { Title } from "../mock/Title";
import  Date  from "../utils/Date";
import { Chip } from "../components/Atoms/Chip";

const HobbiesPasge = () => {
  return (
    <>
      <div className="g_box">
        <h3>{Title}</h3>
        <button>오늘의 집중</button>
        <button>홈</button>
        <div className="TodayTime">
          <h3>현재시간</h3>
          <Date />
        </div>
        <article className="contatiner">
          <h3>오늘의 습관</h3>
          <button>목록 수정</button>
          <Chip /> {/*여기서 이제 여러개의 chip이 들어감 */}
        </article>
      </div>
    </>
  );
};

export default HobbiesPasge;

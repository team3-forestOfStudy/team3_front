import "../styles/weeklyhabittracker.css";
import weeklyTrackerImg from "../assets/icons/Subtract.svg";

export default function WeeklyHabitTracker() {
  return (
    <div className="weekly_habit_tracker">
      <h2 className="g_sub_text02">습관 기록표</h2>
      <table className="weekly_habit_tracker_table">
        <thead className="weekly_habit_tracker_table_head">
          <tr>
            <th></th>
            <th className="g_sub_text07 gray_600">월</th>
            <th className="g_sub_text07 gray_600">화</th>
            <th className="g_sub_text07 gray_600">수</th>
            <th className="g_sub_text07 gray_600">목</th>
            <th className="g_sub_text07 gray_600">금</th>
            <th className="g_sub_text07 gray_600">토</th>
            <th className="g_sub_text07 gray_600">일</th>
          </tr>
        </thead>
        <tbody className="weekly_habit_tracker_table_body">
          <tr>
            <th className=" g_sub_text06 fw_b ellips ">미라클모닝 6시 기상 </th>
            <td>
              <img className="sticker" src={weeklyTrackerImg} alt="" />
            </td>
            <td>
              {" "}
              <img className="sticker" src={weeklyTrackerImg} alt="" />
            </td>
            <td>
              {" "}
              <img className="sticker" src={weeklyTrackerImg} alt="" />
            </td>
            <td>
              {" "}
              <img className="sticker" src={weeklyTrackerImg} alt="" />
            </td>
            <td>
              {" "}
              <img className="sticker" src={weeklyTrackerImg} alt="" />
            </td>
            <td>
              {" "}
              <img className="sticker" src={weeklyTrackerImg} alt="" />
            </td>
            <td>
              {" "}
              <img className="sticker" src={weeklyTrackerImg} alt="" />
            </td>
          </tr>
          <tr>
            <th className=" g_sub_text06 fw_b ellips ">아침 챙겨 먹기 </th>
            <td>
              <img className="sticker" src={weeklyTrackerImg} alt="" />
            </td>
            <td>
              {" "}
              <img className="sticker" src={weeklyTrackerImg} alt="" />
            </td>
            <td>
              {" "}
              <img className="sticker" src={weeklyTrackerImg} alt="" />
            </td>
            <td>
              {" "}
              <img className="sticker" src={weeklyTrackerImg} alt="" />
            </td>
            <td>
              {" "}
              <img className="sticker" src={weeklyTrackerImg} alt="" />
            </td>
            <td>
              {" "}
              <img className="sticker" src={weeklyTrackerImg} alt="" />
            </td>
            <td>
              {" "}
              <img className="sticker" src={weeklyTrackerImg} alt="" />
            </td>
          </tr>
          <tr>
            <th className=" g_sub_text06 fw_b ellips ">
              react 스터디 책 1챕터 읽기{" "}
            </th>
            <td>
              <img className="sticker" src={weeklyTrackerImg} alt="" />
            </td>
            <td>
              {" "}
              <img className="sticker" src={weeklyTrackerImg} alt="" />
            </td>
            <td>
              {" "}
              <img className="sticker" src={weeklyTrackerImg} alt="" />
            </td>
            <td>
              {" "}
              <img className="sticker" src={weeklyTrackerImg} alt="" />
            </td>
            <td>
              {" "}
              <img className="sticker" src={weeklyTrackerImg} alt="" />
            </td>
            <td>
              {" "}
              <img className="sticker" src={weeklyTrackerImg} alt="" />
            </td>
            <td>
              {" "}
              <img className="sticker" src={weeklyTrackerImg} alt="" />
            </td>
          </tr>
          <tr>
            <th className=" g_sub_text06 fw_b ellips ">스트레칭 </th>
            <td>
              <img className="sticker" src={weeklyTrackerImg} alt="" />
            </td>
            <td>
              {" "}
              <img className="sticker" src={weeklyTrackerImg} alt="" />
            </td>
            <td>
              {" "}
              <img className="sticker" src={weeklyTrackerImg} alt="" />
            </td>
            <td>
              {" "}
              <img className="sticker" src={weeklyTrackerImg} alt="" />
            </td>
            <td>
              {" "}
              <img className="sticker" src={weeklyTrackerImg} alt="" />
            </td>
            <td>
              {" "}
              <img className="sticker" src={weeklyTrackerImg} alt="" />
            </td>
            <td>
              {" "}
              <img className="sticker" src={weeklyTrackerImg} alt="" />
            </td>
          </tr>
          <tr>
            <th className=" g_sub_text06 fw_b ellips ">사이드 프로젝트 </th>
            <td>
              <img className="sticker" src={weeklyTrackerImg} alt="" />
            </td>
            <td>
              {" "}
              <img className="sticker" src={weeklyTrackerImg} alt="" />
            </td>
            <td>
              {" "}
              <img className="sticker" src={weeklyTrackerImg} alt="" />
            </td>
            <td>
              {" "}
              <img className="sticker" src={weeklyTrackerImg} alt="" />
            </td>
            <td>
              {" "}
              <img className="sticker" src={weeklyTrackerImg} alt="" />
            </td>
            <td>
              {" "}
              <img className="sticker" src={weeklyTrackerImg} alt="" />
            </td>
            <td>
              {" "}
              <img className="sticker" src={weeklyTrackerImg} alt="" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

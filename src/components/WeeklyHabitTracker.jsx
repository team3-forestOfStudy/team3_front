import React, { useState, useEffect } from "react";
import { getStudyList } from "../utils/testapi";
import StickerImg from "./Sticker.jsx";

import empty01 from "../assets/stickers/img1_empty01.svg";
import empty02 from "../assets/stickers/img1_empty02.svg";
import empty03 from "../assets/stickers/img1_empty03.svg";
import empty04 from "../assets/stickers/img1_empty04.svg";
import empty05 from "../assets/stickers/img1_empty05.svg";
import empty06 from "../assets/stickers/img1_empty06.svg";
import empty07 from "../assets/stickers/img1_empty07.svg";
import empty08 from "../assets/stickers/img1_empty08.svg";
import empty09 from "../assets/stickers/img1_empty09.svg";
import empty10 from "../assets/stickers/img1_empty10.svg";
import empty11 from "../assets/stickers/img1_empty11.svg";
import empty12 from "../assets/stickers/img1_empty12.svg";
import empty13 from "../assets/stickers/img1_empty13.svg";
// fill 1개

import "../styles/weeklyhabittracker.css";

export default function WeeklyHabitTracker({ studyId }) {
  const [tbody, setTbody] = useState([]);
  const days = ["mon", "tue", "wed", "thur", "fri", "sat", "sun"];
  const habitsList = async () => {
    const habits = await getStudyList(studyId);
    const { data } = habits;
    setTbody(data.habitRecords);
  };

  useEffect(() => {
    habitsList();
  }, []);

  return (
    <div className="weekly_habit_tracker">
      <h2 className="g_sub_text02">습관 기록표 </h2>

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
          {tbody.map((item, index) => {
            // tr 인덱스를 사용해 순서대로 이미지 선택
            const emptyImages = [
              empty01,
              empty02,
              empty03,
              empty04,
              empty05,
              empty06,
              empty07,
              empty08,
              empty09,
              empty10,
              empty11,
              empty12,
              empty13,
            ];
            // tr 인덱스를 이미지 배열 길이로 나눈 나머지로 순환
            const emptyImage = emptyImages[index % emptyImages.length];

            return (
              <tr key={item.habitId}>
                <th className="g_sub_text06 fw_b ellips">{item.name}</th>
                {days.map(day => (
                  <td key={day}>
                    <StickerImg checked={item[day]} randomEmpty={emptyImage} />
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

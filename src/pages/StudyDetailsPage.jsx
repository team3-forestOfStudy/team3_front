import React, { useState, useEffect } from 'react';
import EmojiCounterWithImage from '../components/EmojiAdd';
import TextButton from '../components/Atoms/TextButton.jsx';
import PointButton from '../components/Atoms/PointButton.jsx';
import ArrowButton from '../components/Atoms/ArrowbuttonDetail.jsx';
import WeeklyHabitTracker from '../components/WeeklyHabitTracker.jsx';
import { getStudyListEmoji, getStudyList } from '../utils/testapi.js';
import PasswordModal from '../components/PasswordModal.jsx';
import '../styles/studydetail.css';
let studyId = 3;
export default function StudyDetailsPage() {
  // 스터디
  const [data, setData] = useState('');
  const [emojiData, setEmojiData] = useState('');

  // 스터디 상세페이지 가져오기
  const studyDetailLoad = async () => {
    const { data } = await getStudyList(studyId);
    setData(data);
  };

  // 이모지 api
  const emojiLoad = async () => {
    const { data } = await getStudyListEmoji(studyId);
    setEmojiData(data);
  };
  useEffect(() => {
    emojiLoad();
    studyDetailLoad();
  }, []);

  return (
    <>
      <div className="container" id="container">
        <div className="contents">
          <div className="g_box">
            {/* 캡션 이모지 영역 */}
            <div className="detail_top">
              <EmojiCounterWithImage studyId={studyId} />
              <div className="detail_top_right">
                <TextButton className="g_sub_text09 green_700">
                  공유 하기
                </TextButton>
                <p>|</p>
                <PasswordModal
                  title={data.title}
                  studyId={studyId}
                  actionType="edit"
                >
                  수정하기
                </PasswordModal>
                <p>|</p>
                <PasswordModal
                  title={data.title}
                  studyId={studyId}
                  actionType="delete"
                >
                  스터디 삭제하기
                </PasswordModal>
              </div>
            </div>
            {/* 스터디 제목 */}
            <div className="detail_mid">
              <div className="detail_mid_title">
                <h2 className="g_sub_text01">{data.title}</h2>
                <div className="detail_mid_title_right">
                  <ArrowButton>오늘의 집중</ArrowButton>
                  <ArrowButton>오늘의 습관</ArrowButton>
                </div>
              </div>
              {/* 스터디 상세내용  */}
              <div className="detail_mid_content">
                <h3 className="g_sub_text07 fw_l gray_600">소개</h3>
                <p className="detail_mid_content_text g_sub_text06">
                  {data.description}
                </p>
              </div>
              {/* 포인트영역 */}
              <div className="detail_mid_point_wrap">
                <h2 className="g_sub_text07 fw_l gray_600">
                  현재까지 획득한 포인트
                </h2>
                <PointButton>{data.totalPoints} P 획득</PointButton>
              </div>
              {/*  스케줄 영역 */}
              <div className="detail_bottom">
                <WeeklyHabitTracker />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

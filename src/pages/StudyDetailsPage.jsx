import EmojiCounterWithImage from '../components/EmojiAdd';
import TextButton from '../components/Atoms/TextButton.jsx';
import PointButton from '../components/Atoms/PointButton.jsx';
import ArrowButton from '../components/Atoms/ArrowbuttonDetail.jsx';
import WeeklyHabitTracker from '../components/WeeklyHabitTracker.jsx';
import '../styles/studydetail.css';
const point = '10' + 'P';

export default function StudyDetailsPage() {
  return (
    <>
      <div className="container" id="container">
        <div className="contents">
          <div className="g_box">
            {/* 캡션 이모지 영역 */}
            <div className="detail_top">
              <EmojiCounterWithImage />
              <div className="detail_top_right">
                <TextButton className="g_sub_text09 green_700">
                  공유하기
                </TextButton>
                <p>|</p>
                <TextButton className="g_sub_text09 green_700">
                  수정하기
                </TextButton>
                <p>|</p>
                <TextButton className="g_sub_text09 gray_600">
                  스터디 삭제하기
                </TextButton>
              </div>
            </div>
            {/* 스터디 제목 */}
            <div className="detail_mid">
              <div className="detail_mid_title">
                <h2 className="g_sub_text01">인창씨의 개발공장</h2>
                <div className="detail_mid_title_right">
                  <ArrowButton>오늘의 집중</ArrowButton>
                  <ArrowButton>오늘의 습관</ArrowButton>
                </div>
              </div>
              {/* 스터디 상세내용  */}
              <div className="detail_mid_content">
                <h3 className="g_sub_text07 fw_l gray_600">소개</h3>
                <p className="detail_mid_content_text g_sub_text06">
                  Slow And Steady Wins The Race! 다들 오늘 하루도 화이팅 :)
                </p>
              </div>
              {/* 포인트영역 */}
              <div className="detail_mid_point_wrap">
                <h2 className="g_sub_text07 fw_l gray_600">
                  현재까지 획득한 포인트
                </h2>
                <PointButton>{point} 획득</PointButton>
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

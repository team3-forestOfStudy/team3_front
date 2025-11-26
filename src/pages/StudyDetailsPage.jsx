import EmojiCounterWithImage from "../components/EmojiAdd";
import TextButton from "../components/Atoms/TextButton.jsx";
import "../styles/studydetail.css";

export default function StudyDetailsPage() {
  return (
    <>
      <div className="container" id="container">
        <div className="contents">
          <div className="g_box">
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
          </div>
        </div>
      </div>
    </>
  );
}

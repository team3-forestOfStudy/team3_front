import "../styles/studymake.css";
import ButtonType01 from "../components/ButtonType";

export default function StudyMake() {
  return (
    <>
      <div className="container" id="container">
        <div className="contents">
          <div className="studymake-box">
            <h2 className="g_tit">스터디 만들기</h2>
            <h3 className="g_sub_tit">닉네임</h3>
            <input type="text" title="" placeholder="닉네임을 입력해주세요" />
            <p className="red_800 g_sub_text13 mt5">* 필수 입력사항입니다.</p>
            <h3 className="g_sub_tit">스터디 이름</h3>
            <input
              type="text"
              title=""
              placeholder="스터디 이름을 입력해주세요"
            />

            <h3 className="g_sub_tit">소개</h3>
            <textarea placeholder="소개 멘트를 작성해 주세요"></textarea>
            <p className="red_800 g_sub_text13 mt5">* 필수 입력사항입니다.</p>

            <h3 className="g_sub_tit">배경을 선택해주세요</h3>
            <div>
              <div className="bg_green_300 gray_50 g_boxs">
                [bg_green_300] #99c08e
              </div>
              <div className="bg_yellow_100  g_boxs">[yellow_100] #fff1cc</div>
              <div className="bg_blue_100 g_boxs">[bg_blue_100] #e0f1f5</div>
              <div className="bg_pink_100 g_boxs">[bg_pink_100] #fde0e9</div>
            </div>

            <h3 className="g_sub_tit">비밀번호</h3>
            <input
              type="password"
              title=""
              placeholder="비밀번호를 입력해주세요"
            />

            <h3 className="g_sub_tit">비밀번호 확인</h3>
            <input
              type="password"
              title=""
              placeholder="비밀번호를 입력해주세요"
            />

            <ButtonType01 buttonText="스터디 생성" buttonClass="w100 mt40" />
          </div>
        </div>
      </div>
    </>
  );
}

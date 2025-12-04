import { toast } from "react-toastify";

export const toastmessage = {
  // 집중 중단 포인트 지급 X
  // LOGIN_ERROR: "🚨 비밀번호가 일치하지 않습니다. 다시 입력해주세요.",
  SUCCES_FOCUS: point => `🎉 ${point}포인트를 획득했습니다!`,
  FOCUS_STOP: "🚨 집중이 중단되었습니다.",
  TIME_NOT_SET: "🚨 시간을 입력해주세요!",
};

// 집중 성공
export const showSuccesToast = point => {
  toast.success(toastmessage.SUCCES_FOCUS(point), {
    className: "toast-base g_sub_text10 fw_m green_700 bg_mint_100",
  });
};

// 집중 중단
export const showStopToast = () => {
  toast.info(toastmessage.FOCUS_STOP, {
    className: "toast-base g_sub_text10 fw_m bg_pink_100 red_600",
  });
};

// 비밀번호 오류
export const showErrorToast = message => {
  toast.error(message, {
    className: "toast-password g_sub_text10 fw_m bg_pink_100 red_600",
  });
};
// 비밀번호 성공
export const showPasswordSuccesToast = message => {
  toast.error(message, {
    className: "toast-password g_sub_text10 fw_m green_700 bg_mint_100",
    autoClose: 2000,
    position: "top-center",
  });
};

// 시간 미설정 오류
export const showTimeNotSetToast = () => {
  toast.error(toastmessage.TIME_NOT_SET, {
    className: "toast-base g_sub_text10 fw_m bg_pink_100 red_600",
  });
};

// 습관 수정 완료 (삭제/추가 목록 표시)
export const showHabitsUpdateToast = (deletedHabits, addedHabits) => {
  const hasDeleted = deletedHabits && deletedHabits.length > 0;
  const hasAdded = addedHabits && addedHabits.length > 0;

  // 변경사항이 없으면 표시하지 않음
  if (!hasDeleted && !hasAdded) {
    return;
  }

  const toastContent = (
    <div style={{ 
      padding: "12px 16px", 
      minWidth: "280px", 
      maxWidth: "400px",
      textAlign: "left"
    }}>
      <div style={{ 
        marginBottom: "14px", 
        fontWeight: "bold", 
        fontSize: "16px",
        color: "#2d5016"
      }}>
        ✅ 습관 목록이 수정되었습니다
      </div>
      {hasAdded && (
        <div>
          <div style={{ 
            fontSize: "14px", 
            color: "#2e7d32", 
            marginBottom: "8px",
            fontWeight: "600"
          }}>
            ➕ 추가된 습관 ({addedHabits.length}개)
          </div>
          <div style={{ 
            fontSize: "13px", 
            color: "#666", 
            paddingLeft: "8px",
            lineHeight: "1.6"
          }}>
            {addedHabits.length > 3 ? (
              <div style={{ marginBottom: "2px" }}>
                • {addedHabits[0]} 외 {addedHabits.length - 1}개
              </div>
            ) : (
              addedHabits.map((name, idx) => (
                <div key={idx} style={{ marginBottom: "2px" }}>• {name}</div>
              ))
            )}
          </div>
        </div>
      )}
      {hasDeleted && (
        <div style={{ marginBottom: hasAdded ? "12px" : "0" }}>
          <div style={{ 
            fontSize: "14px", 
            color: "#ff3b30", 
            marginBottom: "8px",
            fontWeight: "600"
          }}>
            🗑️ 삭제된 습관 ({deletedHabits.length}개)
          </div>
          <div style={{ 
            fontSize: "13px", 
            color: "#666", 
            paddingLeft: "8px",
            lineHeight: "1.6"
          }}>
            {deletedHabits.length > 3 ? (
              <div style={{ marginBottom: "2px" }}>
                • {deletedHabits[0]} 외 {deletedHabits.length - 1}개
              </div>
            ) : (
              deletedHabits.map((name, idx) => (
                <div key={idx} style={{ marginBottom: "2px" }}>• {name}</div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );

  toast.success(toastContent, {
    className: "toast-habits-update g_sub_text10 fw_m green_700 bg_mint_100",
    autoClose: 6000, // 6초 후 자동 닫힘
    position: "top-center",
    closeButton: true, // 닫기 버튼 표시
    style: {
      minWidth: "300px",
      maxWidth: "450px",
    }
  });
};

//컴포넌트에서 사용하는 방법
//import { showSuccesToast } from "../utils/toastmessage";
//onClick={ () => showSuccesToast(100)}
//출력 메세지🎉 100포인트를 획득했습니다!

//import { showErrorToast } from "../utils/toastmessage.js"
//입력 함수~~~
// props로 내리기

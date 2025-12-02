import { toast } from "react-toastify";

export const toastmessage = {
  // 집중 중단 포인트 지급 X
  // LOGIN_ERROR: "🚨 비밀번호가 일치하지 않습니다. 다시 입력해주세요.",
  SUCCES_FOCUS: point => `🎉 ${point}포인트를 획득했습니다!`,
  FOCUS_STOP: "🚨 집중이 중단되었습니다.",
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

//컴포넌트에서 사용하는 방법
//import { showSuccesToast } from "../utils/toastmessage";
//onClick={ () => showSuccesToast(100)}
//출력 메세지🎉 100포인트를 획득했습니다!

//import { showErrorToast } from "../utils/toastmessage.js"
//입력 함수~~~
// props로 내리기

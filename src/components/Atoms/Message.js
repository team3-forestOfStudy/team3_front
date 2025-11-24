export const TOAST_MESSAGE = {
  PASSWORD_NOT_MATCH: {
    type: "error",
    clasName: "password-error",
    getMessage: () => "비밀번호가 일치하지 않습니다. 다시 입력해주세요",
  },
  FOCUS_INTERRUPTED: {
    type: "error",
    className: "stop",
    getMessage: () => "집중이 중단되었습니다.",
  },
  POINT_REWARD: {
    type: "success",
    className: "success",
    getMessage: ({ point }) => `${point}포인트를 획득하였습니다!`,
  },
};
import ToastMessage from "./ToastMessage";

export default function PrintMessage() {
  const { showToastByKey, ToastContainer } = ToastMessage();

  const handleClick = () => {
    showToastByKey("PASSWORD_NOT_MATCH");
  };

  const handlePoint = () => {
    showToastByKey("POINT_REWARD", { point: 50 });
  };

  return (
    <>
      <ToastContainer />
      <button onClick={handleClick}>비밀번호 오류 토스트</button>
      <button onClick={handlePoint}>포인트 토스트</button>
    </>
  );
}
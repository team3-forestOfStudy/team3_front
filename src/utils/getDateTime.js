export const getDateTime = () => {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  
  //24시간
  const rawHours = now.getHours();

  //오전/오후
  const period = rawHours >= 12 ? "오후" : "오전";

  //12시간 오전:오후로 변환
  let hours12 = rawHours % 12;
  if (hours12 === 0) hours12 = 12;
  hours12 = String(hours12).padStart(1, "0");

  return {
    date: `${year}-${month}-${day}`,
    time: `${hours}:${minutes}`,
    full: `${year}-${month}-${day} ${period} ${hours12}:${minutes}`,
  };
};
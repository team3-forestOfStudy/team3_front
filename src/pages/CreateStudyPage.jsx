// CreateStudyPage.jsx (토스트 알림 + 1초 후 상세 페이지 이동)
import StudyMake from "../components/StudyMake.jsx";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const API_BASE_URL = "http://localhost:4000";

export default function CreateStudyPage() {
  const navigate = useNavigate();

  const handleCreate = async formData => {
    const body = {
      nickname: formData.nickname,
      title: formData.studyName,
      description: formData.intro,
      backgroundImage: formData.selectedBg,
      password: formData.password,
      passwordConfirm: formData.passwordCheck,
    };

    try {
      const res = await fetch(`${API_BASE_URL}/api/studies`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      // ❌ 생성 실패
      if (!res.ok || data.result !== "success") {
        toast.error("😨 스터디 생성이 실패했습니다", {
          className: "toast-base g_sub_text10 fw_m bg_pink_100 red_600",
          autoClose: 2000,
        });
        return;
      }

      // ✅ 생성 성공
      toast.success("😍 스터디가 생성되었습니다!", {
        className: "toast-base g_sub_text10 fw_m green_700 bg_mint_100",
        autoClose: 2000,
        position: "top-center", // 위에서 보여주기
      });

      // 1초 뒤 상세 페이지로 이동
      const createdId = data?.data?.studyId;
      if (createdId) {
        setTimeout(() => {
          navigate(`/Studydetails?studyId=${createdId}`);
        }, 1000);
      }
    } catch (error) {
      console.error(error);
      // 🔥 서버 오류
      toast.error("😨 서버 오류가 발생했습니다.", {
        className: "toast-base g_sub_text10 fw_m",
        autoClose: 2000,
      });
    }
  };

  return <StudyMake mode="create" onSubmit={handleCreate} />;
}

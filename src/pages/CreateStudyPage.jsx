// CreateStudyPage.jsx (토스트 알림 + 1초 후 상세 페이지 이동)
import StudyMake from "../components/StudyMake.jsx";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import arrowIcon from "../assets/icons/arrow.svg";

// 🔄 Render 배포 후 API URL 변경 필요
const API_BASE_URL = "https://team3-forest-study-backend.onrender.com";

export default function CreateStudyPage() {
  const navigate = useNavigate();
  const [showTopButton, setShowTopButton] = useState(false);

  // ✅ 스크롤 감지 (컴포넌트 최상단)
  useEffect(() => {
    const container = document.querySelector(".container");
    if (!container) return;

    const handleScroll = () => {
      setShowTopButton(container.scrollTop > 50);
    };

    container.addEventListener("scroll", handleScroll);
    handleScroll(); // 처음에도 한 번 실행해서 현재 스크롤 상태 반영

    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  // ✅ TOP 버튼 클릭 시 맨 위로
  const handleScrollTop = () => {
    const container = document.querySelector(".container");
    if (container) {
      container.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // ✅ 스터디 생성 API
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

      if (!res.ok || data.result !== "success") {
        toast.error("😨 스터디 생성이 실패했습니다", {
          className: "toast-base g_sub_text10 fw_m bg_pink_100 red_600",
          autoClose: 2000,
        });
        return;
      }

      toast.success("😍 스터디가 생성되었습니다!", {
        className: "toast-base g_sub_text10 fw_m green_700 bg_mint_100",
        autoClose: 2000,
        position: "top-center",
      });

      const createdId = data?.data?.studyId;
      if (createdId) {
        setTimeout(() => {
          navigate(`/Studydetails?studyId=${createdId}`);
        }, 1000);
      }
    } catch (error) {
      console.error(error);
      toast.error("😨 서버 오류가 발생했습니다.", {
        className: "toast-base g_sub_text10 fw_m",
        autoClose: 2000,
      });
    }
  };

  return (
    <>
      <StudyMake mode="create" onSubmit={handleCreate} />

      {showTopButton && (
        <button
          type="button"
          className="home-top-button"
          onClick={handleScrollTop}
          aria-label="맨 위로 이동"
        >
          <img src={arrowIcon} alt="" className="home-top-button__icon" />
        </button>
      )}
    </>
  );
}

// EditStudyPage.jsx (토스트 알림 + 1초 후 상세 페이지 이동)
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import StudyMake from "../components/StudyMake.jsx";

const API_BASE_URL = "http://localhost:4000";

export default function EditStudyPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(true);

  // 스터디 기본 정보 불러오기
  useEffect(() => {
    const loadStudy = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/studies/${id}`);
        const data = await res.json();

        if (!res.ok || data.result !== "success") {
          // 조회 실패는 기존 메시지 유지 (토스트로만 변경 가능)
          toast.error(data.message || "😨 서버 오류가 발생했습니다.", {
            className: "toast-base g_sub_text10 fw_m",
            autoClose: 2000,
          });
          return;
        }

        const s = data.data;

        setInitialData({
          nickname: s.nickname,
          studyName: s.title,
          intro: s.description ?? "",
          selectedBg: s.backgroundImage,
        });

        setLoading(false);
      } catch (error) {
        console.error(error);
        toast.error("😨 서버 오류가 발생했습니다.", {
          className: "toast-base g_sub_text10 fw_m",
          autoClose: 2000,
        });
      }
    };

    loadStudy();
  }, [id]);

  const handleUpdate = async formData => {
    // 비밀번호 / 변경 없음 체크는 그대로 alert 사용 (로컬 검증)
    if (!formData.password) {
      alert("수정을 위해 비밀번호를 입력해주세요.");
      return;
    }

    const body = { password: formData.password };
    let hasChange = false;

    if (formData.nickname !== initialData.nickname) {
      body.nickname = formData.nickname;
      hasChange = true;
    }

    if (formData.studyName !== initialData.studyName) {
      body.title = formData.studyName;
      hasChange = true;
    }

    if (formData.intro !== initialData.intro) {
      body.description = formData.intro;
      hasChange = true;
    }

    if (formData.selectedBg !== initialData.selectedBg) {
      body.backgroundImage = formData.selectedBg;
      hasChange = true;
    }

    if (!hasChange) {
      alert("수정할 값이 최소 1개 이상이어야 합니다.");
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/studies/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      // ❌ 수정 실패
      if (!res.ok || data.result !== "success") {
        toast.error("😨 스터디 수정이 실패했습니다.", {
          className: "toast-base g_sub_text10 fw_m bg_pink_100 red_600",
          autoClose: 2000,
        });
        return;
      }

      // ✅ 수정 성공
      toast.success("😀 스터디가 수정되었습니다!", {
        className: "toast-base g_sub_text10 fw_m green_700 bg_mint_100",
        autoClose: 2000,
        position: "top-center",
      });

      // 1초 뒤 상세 페이지로 이동
      setTimeout(() => {
        navigate(`/Studydetails?studyId=${id}`);
      }, 1000);
    } catch (error) {
      console.error(error);
      // 🔥 서버 오류
      toast.error("😨 서버 오류가 발생했습니다.", {
        className: "toast-base g_sub_text10 fw_m",
        autoClose: 2000,
      });
    }
  };

  if (loading) return <div>불러오는 중...</div>;

  return (
    <StudyMake mode="edit" initialData={initialData} onSubmit={handleUpdate} />
  );
}

// EditStudyPage.jsx
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import StudyMake from "../components/StudyMake.jsx";

const API_BASE_URL = "https://team3-forest-study-backend.onrender.com";

export default function EditStudyPage() {
  // ✅ /study/edit/:id 에서 id 받아오기
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ PasswordModal에서 navigate(state)로 넘긴 비밀번호 (인증용)
  const passwordFromState = location.state?.password || "";

  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(true);

  // 스터디 기본 정보 불러오기
  useEffect(() => {
    const loadStudy = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/studies/${id}`);
        const data = await res.json();

        if (!res.ok || data.result !== "success") {
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
      } catch (error) {
        console.error(error);
        toast.error("😨 서버 오류가 발생했습니다.", {
          className: "toast-base g_sub_text10 fw_m",
          autoClose: 2000,
        });
      } finally {
        // ✅ 성공/실패 관계없이 로딩 종료
        setLoading(false);
      }
    };

    loadStudy();
  }, [id]);

  const handleUpdate = async formData => {
    // 비밀번호 수정은 없지만, 인증용 비밀번호는 반드시 필요
    if (!passwordFromState) {
      toast.error("🔐 비밀번호 정보가 없습니다. 다시 시도해주세요.", {
        className: "toast-base g_sub_text10 fw_m bg_pink_100 red_600",
        autoClose: 2000,
      });
      return;
    }

    // PATCH body 기본 구조 (항상 password 포함)
    const body = { password: passwordFromState };
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
      toast.warn("⚠️ 수정할 값이 최소 1개 이상이어야 합니다.", {
        className: "toast-base g_sub_text10 fw_m",
        autoClose: 2000,
      });
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
        toast.error(data.message || "😨 스터디 수정이 실패했습니다.", {
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
        // 여기 주소는 팀이 이미 쓰고 있는 패턴 유지
        navigate(`/Studydetails?studyId=${id}`);
      }, 1000);
    } catch (error) {
      console.error(error);
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

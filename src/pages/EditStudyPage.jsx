// EditStudyPage.jsx (updated: 수정 성공 후 상세 페이지 이동)
import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import StudyMake from '../components/StudyMake.jsx';

const API_BASE_URL = 'http://localhost:4000';

export default function EditStudyPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStudy = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/studies/${id}`);
        const data = await res.json();

        if (!res.ok || data.result !== 'success') {
          alert(data.message || '스터디 정보를 불러오지 못했습니다.');
          return;
        }

        const s = data.data;

        setInitialData({
          nickname: s.nickname,
          studyName: s.title,
          intro: s.description ?? '',
          selectedBg: s.backgroundImage,
        });

        setLoading(false);
      } catch (error) {
        console.error(error);
        alert('서버 오류가 발생했습니다.');
      }
    };

    loadStudy();
  }, [id]);

  const handleUpdate = async formData => {
    if (!formData.password) {
      alert('수정을 위해 비밀번호를 입력해주세요.');
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
      alert('수정할 값이 최소 1개 이상이어야 합니다.');
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/studies/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok || data.result !== 'success') {
        alert(data.message || '스터디 수정에 실패했습니다.');
        return;
      }

      alert(data.message || '스터디가 수정되었습니다.');

      // ⭐ 수정 후 상세 페이지로 이동
      navigate(`/Studydetails?studyId=${id}`);
    } catch (error) {
      console.error(error);
      alert('서버 오류가 발생했습니다.');
    }
  };

  if (loading) return <div>불러오는 중...</div>;

  return (
    <StudyMake mode="edit" initialData={initialData} onSubmit={handleUpdate} />
  );
}

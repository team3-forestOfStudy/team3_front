import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import StudyMake from '../components/StudyMake';

const API_BASE_URL = 'http://localhost:4000';

export default function EditStudyPage() {
  const { id } = useParams(); // /study/edit/:id
  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(true);

  // 1) 스터디 상세 조회 -> 폼 초기값으로 셋팅
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

  // 수정 요청 (PUT /api/studies/ :studyID 임시)
  const handleUpdate = async formData => {
    const body = {
      nickname: formData.nickname,
      title: formData.studyName,
      description: formData.intro,
      backgroundImage: formData.selectedBg,
      password: formData.password,
      passwordConfirm: formData.passwordCheck,
    };

    try {
      const res = await fetch(`${API_BASE_URL}/api/studies/${id}`, {
        method: 'PUT', // 만약 PATCH면 이 부분 바꾸기
        headers: { 'Content-Type': 'application/josn' },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok || data.result !== 'success') {
        alert(data.message || '스터디 수정에 실패했습니다.');
        return;
      }

      alert(data.message || '스터디가 수정되었습니다');
      //TODO: 상세 페이지로 이동
      // navigate(`/Studydetails?studyId=${id}`);
    } catch (error) {
      console.error(error);
      alert('서버 오류가 발생했습니다');
    }
  };

  if (loading) return <div>불러오는 중...</div>;

  return (
    <StudyMake mode="edit" initialData={initialData} onSubmit={handleUpdate} />
  );
}

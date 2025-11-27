// CreateStudyPage.jsx (updated: 생성 성공 후 상세 페이지 이동)
import StudyMake from '../components/StudyMake';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = 'http://localhost:4000';

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
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok || data.result !== 'success') {
        alert(data.message || '스터디 생성에 실패했습니다.');
        return;
      }

      alert(data.message || '스터디가 생성되었습니다!');

      // ⭐ 생성된 studyId를 이용해 상세 페이지로 이동
      navigate(`/Studydetails?studyId=${data.data.studyId}`);
    } catch (error) {
      console.error(error);
      alert('서버 오류가 발생했습니다.');
    }
  };

  return <StudyMake mode="create" onSubmit={handleCreate} />;
}

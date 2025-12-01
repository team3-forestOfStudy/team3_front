# 🚀 공부의 숲 (Study Forest) 프론트엔드

코드잇 초급 프로젝트 '공부의 숲'(풀스택 10기 - 3팀)의 프론트엔드 레포지토리입니다.

## 🌟 1. 프로젝트 개요 (Overview)

저희 서비스는 사용자가 자신만의 스터디를 만들고, 수행하고 싶은 습관을 기록하며, 집중 타이머를 통해 포인트를 획득하는 플랫폼입니다.

- **핵심 목표:** 사용자 스터디 생성 및 관리, 습관 기록, 집중 타이머를 통한 포인트 적립 시스템 구축

---

## 🛠️ 2. 기술 스택 (Tech Stack)

| 구분                | 기술                  | 설명                                                          |
| :------------------ | :-------------------- | :------------------------------------------------------------ |
| **프레임워크**      | **React 19.2.0**      | 사용자 인터페이스 구축을 위한 라이브러리                       |
| **라우팅**          | **React Router v7**   | SPA(Single Page Application) 라우팅 관리                      |
| **빌드 도구**       | **Create React App**  | React 프로젝트 개발 환경 구축 및 빌드                         |
| **UI 라이브러리**   | **react-toastify**    | 사용자 알림 메시지 표시 (토스트 알림)                         |
| **이모지 피커**     | **emoji-picker-react**| 스터디에 이모지를 추가하기 위한 이모지 선택 컴포넌트         |
| **스타일링**        | **CSS Modules**       | 컴포넌트별 CSS 파일로 스타일 관리                              |
| **코드 품질**       | **ESLint + Prettier** | 코드 스타일 통일 및 자동 포맷팅                               |

---

## ⚙️ 3. 프로젝트 구조 (Project Structure)

프론트엔드는 **컴포넌트 기반 아키텍처 (Component-Based Architecture)**를 기반으로 구축되어, 재사용성과 유지보수성을 높였습니다.

```
src/
├── components/          # 재사용 가능한 컴포넌트
│   ├── Atoms/           # 기본 UI 컴포넌트 (Button, Chip, Modal 등)
│   ├── Ui/              # 레이아웃 컴포넌트 (Header 등)
│   └── *.jsx            # 기능별 컴포넌트 (StudyCard, Timer, EmojiAdd 등)
├── pages/               # 페이지 컴포넌트
│   ├── Home.jsx         # 홈 페이지 (스터디 목록)
│   ├── CreateStudyPage.jsx
│   ├── EditStudyPage.jsx
│   ├── StudyDetailsPage.jsx
│   ├── FocusPage.jsx    # 집중 타이머 페이지
│   ├── HobbiesPage.jsx  # 오늘의 습관 페이지
│   └── Guide.jsx
├── styles/              # CSS 스타일 파일
├── utils/               # 유틸리티 함수
│   ├── date.js          # 날짜 관련 함수
│   ├── validation.js    # 유효성 검사 함수
│   ├── recentViewed.js  # 최근 조회 스터디 관리
│   └── toastmessage.js  # 토스트 메시지 유틸
├── api/                 # API 호출 함수 (향후 통합 예정)
├── assets/              # 이미지, 아이콘 등 정적 파일
├── App.jsx              # 메인 앱 컴포넌트 (라우팅 설정)
└── index.jsx            # 앱 진입점
```

### 3.1. 컴포넌트 계층 구조

| 계층           | 역할                                                   | 예시 파일                   |
| :------------- | :----------------------------------------------------- | :--------------------------- |
| **Pages**      | 전체 페이지를 구성하는 최상위 컴포넌트                 | `src/pages/Home.jsx`         |
| **Components** | 페이지 내에서 재사용되는 기능 컴포넌트                 | `src/components/StudyCard.jsx` |
| **Atoms**      | 가장 작은 단위의 UI 컴포넌트 (Button, Chip 등)         | `src/components/Atoms/PointButton.jsx` |
| **Utils**      | 공통으로 사용되는 유틸리티 함수                        | `src/utils/date.js`          |

---

## 🗺️ 4. 라우팅 구조 (Routing Structure)

React Router v7을 사용하여 SPA 라우팅을 구현했습니다.

| 경로 | 컴포넌트 | 설명 |
| :--- | :--- | :--- |
| `/` | `Home` | 홈 페이지 (스터디 목록, 최근 조회) |
| `/study/make` | `CreateStudyPage` | 스터디 생성 페이지 |
| `/study/edit/:id` | `EditStudyPage` | 스터디 수정 페이지 |
| `/Studydetails` | `StudyDetailsPage` | 스터디 상세 페이지 (쿼리 파라미터: `?studyId=`) |
| `/Focus` | `FocusPage` | 집중 타이머 페이지 (쿼리 파라미터: `?studyId=`) |
| `/Hobbies` | `HobbiesPage` | 오늘의 습관 페이지 (쿼리 파라미터: `?studyId=`) |
| `/guide` | `Guide` | 가이드 페이지 |

---

## 🔌 5. API 연동 (API Integration)

### 5.1. 백엔드 서버 주소

- **개발 환경**: `http://localhost:4000`
- **배포 환경**: `https://team3-forest-study-backend.onrender.com`

### 5.2. 주요 API 연동

프론트엔드에서 사용하는 주요 API 엔드포인트입니다.

| 기능 | 메서드 | 엔드포인트 | 사용 위치 |
| :--- | :--- | :--- | :--- |
| **스터디 생성** | `POST` | `/api/studies` | `CreateStudyPage.jsx` |
| **스터디 목록 조회** | `GET` | `/api/studies` | `StudyBrowse.jsx` (검색, 정렬, 페이지네이션) |
| **스터디 상세 조회** | `GET` | `/api/studies/{studyId}` | `StudyDetailsPage.jsx`, `FocusPage.jsx`, `HobbiesPage.jsx` |
| **스터디 수정** | `PATCH` | `/api/studies/{studyId}` | `EditStudyPage.jsx` |
| **스터디 삭제** | `DELETE` | `/api/studies/{studyId}` | `PasswordModal.jsx` |
| **집중 로그 생성** | `POST` | `/api/studies/{studyId}/focus-logs` | `Timer.jsx` |
| **이모지 추가** | `POST` | `/api/studies/{studyId}/emojis` | `EmojiAdd.jsx` |
| **이모지 목록 조회** | `GET` | `/api/studies/{studyId}/emojis` | `EmojiAdd.jsx`, `StudyDetailsPage.jsx` |

### 5.3. API 호출 패턴

현재는 각 컴포넌트에서 `fetch`를 직접 사용하고 있으며, 향후 `src/api/` 폴더로 통합 예정입니다.

```javascript
// 예시: 스터디 목록 조회
const API_BASE_URL = "https://team3-forest-study-backend.onrender.com";
const res = await fetch(`${API_BASE_URL}/api/studies?page=1&pageSize=6`);
const data = await res.json();
```

---

## 🚀 6. 시작하기 (Getting Started)

### 6.1. 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행 (http://localhost:3000)
npm start

# 프로덕션 빌드
npm run build

# 테스트 실행
npm test
```

### 6.2. 환경 변수 설정

프로젝트 루트에 `.env` 파일을 생성하여 API 서버 주소를 설정할 수 있습니다.

```env
REACT_APP_API_BASE_URL=https://team3-forest-study-backend.onrender.com
```

---

## 🎨 7. 주요 기능 (Features)

### 7.1. 스터디 관리
- ✅ 스터디 생성 (제목, 소개, 배경 이미지, 비밀번호 설정)
- ✅ 스터디 목록 조회 (검색, 정렬, 페이지네이션)
- ✅ 스터디 상세 조회
- ✅ 스터디 수정/삭제 (비밀번호 인증)
- ✅ 최근 조회한 스터디 목록 (쿠키 기반)

### 7.2. 집중 타이머
- ✅ 집중 시간 설정 (최대 60분)
- ✅ 타이머 시작/일시정지/리셋
- ✅ 집중 시간 기록 및 포인트 적립
- ✅ 포인트 획득 알림 (토스트)

### 7.3. 이모지 기능
- ✅ 스터디에 이모지 추가
- ✅ 이모지 카운트 표시
- ✅ 인기 이모지 상위 3개 표시

### 7.4. 오늘의 습관
- ✅ 습관 목록 표시
- ✅ 습관 완료 체크
- ✅ 습관 목록 수정

---

## 🤝 8. 협업 및 기여 (Contribution)

### 8.1. 브랜치 전략

GitHub Flow를 따르며, 기능별 브랜치에서 작업 후 PR을 통해 코드를 검토하고 병합합니다.

- **main**: 운영 환경 배포 코드
- **dev**: 개발 통합 브랜치
- **feature/\***: 기능 개발 브랜치 (예: `feature/study-card`, `feature/timer`)

### 8.2. PR (Pull Request) 가이드라인

1. 작업 완료 후 **dev** 브랜치로 PR을 생성합니다.
2. PR 제목은 `[타입]: 변경의 종류` 형식으로 작성합니다.
   - 예: `[feat] 스터디 카드 컴포넌트 구현`
   - 예: `[fix] 타이머 포인트 계산 오류 수정`
   - 예: `[refactor] API 호출 함수 통합`
3. PR 본문에 변경 내용, 테스트 방법, 스크린샷 등을 기재합니다.

### 8.3. 코딩 컨벤션

- **컴포넌트명**: PascalCase (예: `StudyCard.jsx`)
- **함수명/변수명**: camelCase (예: `handleClick`, `studyId`)
- **CSS 클래스**: kebab-case (예: `study-card`, `bg-green-300`)
- **파일명**: 컴포넌트는 `.jsx`, 유틸리티는 `.js`

---

## 👤 9. 주요 담당자

| 역할                 | 이름   |
| :------------------- | :----- |
| **메인 페이지 구현** | 유찬혁 |
| **스터디 생성 페이지 구현** | 유찬혁 |
| **스터디 상세 페이지 구현** | 이인창 |
| **오늘의 습관 페이지 구현** | 김민식 |
| **오늘의 집중 페이지 구현** | 김민식 |

---

## 📝 10. 추가 정보

### 10.1. 반응형 디자인

프로젝트는 반응형 디자인을 지원합니다.

- **Desktop**: 1920px ~ 1201px
- **Tablet**: 1200px ~ 601px
- **Mobile**: 600px ~ 375px


### 10.2. 향후 개선 사항

- [ ] API 호출 함수를 `src/api/` 폴더로 통합
- [ ] 환경 변수를 통한 API URL 관리
- [ ] 에러 바운더리 추가
- [ ] 로딩 상태 전역 관리
- [ ] TypeScript 마이그레이션 검토

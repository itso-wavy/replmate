# ReplMate MVP Tasks — CLAUDE.md

## 프로젝트 개요

ReplMate 프론트엔드 개발 일정 관리용 캘린더 앱 (MVP).
React + Vite 기반 SPA, Supabase REST API로 태스크 데이터를 영속화합니다.

## 기술 스택

- **프레임워크**: React 19 + Vite 8
- **스타일링**: 인라인 스타일 (CSS-in-JS 없음, Tailwind 없음)
- **백엔드**: Supabase (REST API 직접 호출, SDK 미사용)
- **폰트**: DM Sans, DM Mono (Google Fonts)
- **빌드**: ESM 모듈 방식

## 프로젝트 구조

```
src/
├── App.jsx               # 루트 컴포넌트 (CalendarV2만 렌더)
├── main.jsx              # React 엔트리포인트
├── components/
│   ├── CalendarV2.jsx    # 메인 캘린더 뷰 + 상태 관리
│   ├── Chip.jsx          # 태스크 칩 (드래그 가능)
│   ├── TaskForm.jsx      # 태스크 추가/편집 모달 폼
│   ├── Toast.jsx         # 토스트 알림 컴포넌트
│   ├── hook.jsx          # useToast 훅
│   └── index.js          # 컴포넌트 배럴 익스포트
├── constants/
│   └── index.js          # 카테고리, 색상, 월 설정, 상수
├── lib/
│   └── supabase.js       # Supabase REST 래퍼 (sbFetch, db)
└── utils/
    └── index.js          # 날짜 유틸, emptyTask, buildWeeks 등
```

## 주요 기능

- 월별 캘린더 뷰 (2026년 3~4월 고정)
- 태스크 CRUD (추가/편집/삭제)
- 태스크 드래그앤드롭으로 날짜 이동
- 실제 소요 시간 인라인 입력
- Supabase 동기화 (불러오기 / 저장)
- 토스트 알림

## 데이터 모델 (Supabase `tasks` 테이블)

| 필드 | 타입 | 설명 |
|------|------|------|
| id | string | UUID (클라이언트 생성) |
| name | string | 태스크 이름 |
| estimated_hours | string/number | 예상 소요 시간 |
| priority | 'high'\|'medium'\|'low' | 우선순위 |
| start_date | string (YYYY-MM-DD) | 시작일 |
| end_date | string (YYYY-MM-DD) | 종료일 |
| category | string | 개발/QA/배포/기획/디자인/기타 |
| note | string | 메모 |
| actual_hours | number\|null | 실제 소요 시간 |

## 환경 변수

`.env` 파일에 설정:
```
VITE_SUPABASE_URL=https://...supabase.co
VITE_SUPABASE_KEY=...
```

## 개발 명령어

```bash
npm run dev      # 개발 서버
npm run build    # 프로덕션 빌드
npm run preview  # 빌드 미리보기
npm run lint     # ESLint 검사
```

## 코딩 컨벤션

- 스타일은 인라인 스타일 객체 사용 (className은 전역 CSS 클래스명만)
- 컴포넌트는 함수형, hooks 사용
- Supabase 호출은 항상 try/catch로 감싸고 toast로 에러 표시
- 날짜는 `YYYY-MM-DD` 문자열 형식으로 통일

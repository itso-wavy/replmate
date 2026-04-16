# API 엔드포인트 구조

API 엔드포인트는 `lib/endpoints.ts`에서 관리하며, 버전을 상수로 분리하여 다중 버전에 대응합니다.

## 현재 구조 (단일 버전 v1)

API 기본 URL은 환경 변수로 관리하며, 버전 prefix는 `lib/endpoints.ts`에서 상수로 선언합니다.

```env
NEXT_PUBLIC_API_URL=https://api.example.com
```

```typescript
// lib/endpoints.ts
const API_BASE = process.env.NEXT_PUBLIC_API_URL;
export const API_BASE_V1 = `${API_BASE}/v1`;

export const USER_ENDPOINTS = {
  GET_USER: `${API_BASE_V1}/users/me`,
};
```

axios `baseURL`도 `API_BASE_V1`을 직접 사용합니다.

```typescript
// lib/api.ts
import { API_BASE_V1 } from '@/lib/endpoints';

export const api = axios.create({
  baseURL: API_BASE_V1,
  withCredentials: true,
});
```

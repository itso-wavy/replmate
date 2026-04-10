# API 엔드포인트 구조

API 엔드포인트는 `lib/endpoints.ts`에서 관리하며, 경로에 버전을 명시하여 다중 버전에 대응합니다.

```typescript
const V1 = `${API_BASE}/v1`;

export const USER_ENDPOINTS = {
  GET_USER: `${V1}/users/me`,
};
```

새로운 API 버전이 추가될 경우 `V2` 등의 상수를 선언하여 엔드포인트별로 버전을 지정할 수 있습니다.

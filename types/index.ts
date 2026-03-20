// Enums
export * from './enums';

// Common
export * from './api/common';

// API Response types
export * from './api/store';
export * from './api/product';
export * from './api/reply';
export * from './api/usage';
export * from './api/plan';
export * from './api/term';
export * from './api/user';
export * from './api/contact';
export * from './api/reminder';
export * from './api/job';

// Domain types
export * from './domain/alert';
export * from './domain/common';
export * from './domain/contact';
export * from './domain/job';
export * from './domain/plan';
export * from './domain/product';
export * from './domain/reminder';
export * from './domain/reply';
export * from './domain/store';
// export * from './domain/term';
export * from './domain/usage';
export * from './domain/user';

// Page types
export * from './domain/pages';

/* 
매퍼 예시
// 
// LoginResponse → LoginResponseDomain 변환
// 참고: user는 별도로 toUserDomain()을 통해 변환 필요
// 
// export function toLoginResponseDomain(
//   response: LoginResponse,
//   userDomain: UserDomain
// ): LoginResponseDomain {
//   return {
//     user: userDomain,
//     accessToken: response.accessToken,
//     refreshToken: response.refreshToken,
//   };
// }
 */

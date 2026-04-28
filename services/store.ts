import { api } from '@/lib/api';
import { STORE_ENDPOINTS } from '@/lib/endpoints';
import type {
  CreateStoreRequest,
  MyStoresResponseDto,
  PresignedUrlDto,
  PresignedUrlRequest,
  PresignedUrlsDto,
  PresignedUrlsRequest,
  StoreDetailDto,
  StoreDto,
  StoreInfoDto,
  StoreReplyOptionsDto,
  StoreUrlCheckInfoDto,
  UpdateStoreRequest,
  UpdateStoresRequest,
} from '@/types/api/store';
import {
  type MyStoresResult,
  StoreDetailDomain,
  StoreDomain,
  StoreReplyOptionsDomain,
  toMyStoresResult,
  toStoreDetailDomain,
  toStoreDomain,
  toStoreDomainList,
  toStoreReplyOptionsDomain,
} from '@/types/domain/store';

// ==========================================================
// 스토어 조회
// ==========================================================

/**
 * 내 스토어 목록 조회
 */
export async function getMyStores(): Promise<MyStoresResult> {
  const response = await api.get<MyStoresResponseDto>(
    STORE_ENDPOINTS.GET_MY_STORES
  );
  return toMyStoresResult(response.data);
}

/**
 * 스토어 상세 조회
 */
export async function getStoreDetail(
  storeId: string | number
): Promise<StoreDetailDomain> {
  const response = await api.get<StoreDetailDto>(
    STORE_ENDPOINTS.GET_STORE_DETAIL(storeId)
  );
  return toStoreDetailDomain(response.data);
}

/**
 * 플랫폼 타입 목록 조회
 * GET /api/v1/stores/platform-types → string[]
 */
export async function getPlatformTypes(): Promise<string[]> {
  const response = await api.get<string[]>(STORE_ENDPOINTS.GET_PLATFORM_TYPES);
  return response.data;
}

// ==========================================================
// 스토어 생성/수정/삭제
// ==========================================================

/**
 * 스토어 생성
 * verificationImageKeys: presigned URL로 업로드 후 받은 imageKey 배열 (1~3개)
 * 응답: StoreInfoDto (job + store)
 */
export async function createStore(
  data: CreateStoreRequest
): Promise<StoreInfoDto> {
  const response = await api.post<StoreInfoDto>(
    STORE_ENDPOINTS.CREATE_STORE,
    data
  );
  return response.data;
}

/**
 * 스토어 URL 중복 확인 (GET 방식, query param 사용)
 */
export async function checkStoreUrl(
  url: string
): Promise<StoreUrlCheckInfoDto> {
  const response = await api.get<StoreUrlCheckInfoDto>(
    STORE_ENDPOINTS.CHECK_STORE_URL,
    { params: { url } }
  );
  return response.data;
}

/**
 * 스토어 업데이트 (활성화 상태, 비활성화 예약 등)
 * PATCH /api/v1/stores/{store_id}
 */
export async function updateStore(
  storeId: string | number,
  data: UpdateStoreRequest
): Promise<StoreDomain> {
  const response = await api.patch<StoreDto>(
    STORE_ENDPOINTS.UPDATE_STORE(storeId),
    data
  );
  return toStoreDomain(response.data);
}

/**
 * 스토어 삭제
 */
export async function deleteStore(storeId: string | number): Promise<void> {
  await api.delete(STORE_ENDPOINTS.DELETE_STORE(storeId));
}

// ==========================================================
// 스토어 리플 옵션
// ==========================================================

/**
 * 스토어 리플 옵션 조회
 */
export async function getReplyOptions(
  storeId: string | number
): Promise<StoreReplyOptionsDomain> {
  const response = await api.get<StoreReplyOptionsDto>(
    STORE_ENDPOINTS.GET_REPLY_OPTIONS(storeId)
  );
  return toStoreReplyOptionsDomain(response.data);
}

/**
 * 스토어 리플 옵션 수정
 */
export async function updateReplyOptions(
  storeId: string | number,
  options: Partial<{
    tone: string;
    lengthType: string;
    includeEmoji: boolean;
    brandGuideline: string | null;
  }>
): Promise<StoreReplyOptionsDomain> {
  const response = await api.put<StoreReplyOptionsDto>(
    STORE_ENDPOINTS.UPDATE_REPLY_OPTIONS(storeId),
    options
  );
  return toStoreReplyOptionsDomain(response.data);
}

// ==========================================================
// 스토어 인증 (Presigned URL 방식)
// ==========================================================

/**
 * Presigned URL 발급 (단건)
 * POST /api/v1/stores/presigned-url
 * 응답의 uploadUrl로 S3에 직접 업로드 후 imageKey를 사용
 */
export async function getPresignedUrl(
  data: PresignedUrlRequest
): Promise<PresignedUrlDto> {
  const response = await api.post<PresignedUrlDto>(
    STORE_ENDPOINTS.GET_PRESIGNED_URL,
    data
  );
  return response.data;
}

/**
 * Presigned URL 일괄 발급 (최대 3개)
 * POST /api/v1/stores/presigned-urls
 * contentTypes 배열로 요청, 각 uploadUrl로 S3 업로드 후 imageKeys 사용
 */
export async function getPresignedUrls(
  data: PresignedUrlsRequest
): Promise<PresignedUrlsDto> {
  const response = await api.post<PresignedUrlsDto>(
    STORE_ENDPOINTS.GET_PRESIGNED_URLS,
    data
  );
  return response.data;
}

/**
 * 인증 이미지 업데이트 (imageKeys 배열, 최대 3개)
 * PUT /api/v1/stores/{store_id}/verification-image
 */
export async function updateVerificationImage(
  storeId: string | number,
  imageKeys: string[]
): Promise<void> {
  await api.put(STORE_ENDPOINTS.UPDATE_VERIFICATION_IMAGE(storeId), {
    imageKeys,
  });
}

/**
 * 스토어 벌크 업데이트
 * PATCH /api/v1/users/me/stores
 */
export async function updateStoresBulk(
  data: UpdateStoresRequest
): Promise<StoreDomain[]> {
  const response = await api.patch<StoreDto[]>(
    STORE_ENDPOINTS.UPDATE_STORES_BULK,
    data
  );
  return toStoreDomainList(response.data);
}

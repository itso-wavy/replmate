import { api } from '@/lib/api';
import { STORE_ENDPOINTS } from '@/lib/endpoints';
import {
  PlatformType,
  StoreDomain,
  StoreDto,
  StoreReplyOptionsDomain,
  StoreReplyOptionsDto,
  toStoreDomain,
  toStoreDomainList,
  toStoreReplyOptionsDomain,
} from '@/types';

// ============================================================================
// 스토어 조회
// ============================================================================

/**
 * 내 스토어 목록 조회
 */
export async function getMyStores(): Promise<StoreDomain[]> {
  const response = await api.get<StoreDto[]>(STORE_ENDPOINTS.GET_MY_STORES);
  return toStoreDomainList(response.data);
}

/**
 * 스토어 상세 조회
 */
export async function getStoreDetail(
  storeId: string | number
): Promise<StoreDomain> {
  const response = await api.get<StoreDto>(
    STORE_ENDPOINTS.GET_STORE_DETAIL(storeId)
  );
  return toStoreDomain(response.data);
}

/**
 * 지원 플랫폼 목록 조회
 */
export async function getPlatforms(): Promise<PlatformType[]> {
  const response = await api.get<PlatformType[]>(STORE_ENDPOINTS.GET_PLATFORMS);
  return response.data;
}

// ============================================================================
// 스토어 생성/수정/삭제
// ============================================================================

/**
 * 스토어 생성
 */
export async function createStore(data: {
  name: string;
  url: string;
  platform: PlatformType;
}): Promise<StoreDomain> {
  const response = await api.post<StoreDto>(STORE_ENDPOINTS.CREATE_STORE, data);
  return toStoreDomain(response.data);
}

/**
 * 스토어 URL 중복 확인
 */
export async function checkStoreUrl(url: string): Promise<{
  isAvailable: boolean;
  message: string;
}> {
  const response = await api.post<{ isAvailable: boolean; message: string }>(
    STORE_ENDPOINTS.CHECK_STORE_URL,
    { url }
  );
  return response.data;
}

/**
 * 스토어 활성화 상태 변경
 */
export async function updateStoreStatus(
  storeId: string | number,
  isActive: boolean
): Promise<StoreDomain> {
  const response = await api.patch<StoreDto>(
    STORE_ENDPOINTS.UPDATE_STORE_STATUS(storeId),
    { isActive }
  );
  return toStoreDomain(response.data);
}

/**
 * 스토어 삭제
 */
export async function deleteStore(storeId: string | number): Promise<void> {
  await api.delete(STORE_ENDPOINTS.DELETE_STORE(storeId));
}

// ============================================================================
// 스토어 리플 옵션
// ============================================================================

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

// ============================================================================
// 스토어 인증
// ============================================================================

/**
 * 스토어 인증 이미지 업로드
 */
export async function uploadVerificationImage(
  storeId: string | number,
  file: File
): Promise<StoreDomain> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await api.post<StoreDto>(
    STORE_ENDPOINTS.UPLOAD_VERIFICATION_IMAGE(storeId),
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
  return toStoreDomain(response.data);
}

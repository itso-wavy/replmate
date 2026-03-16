import { api } from '@/lib/api';
import { SERVICE_INFO_ENDPOINTS } from '@/lib/endpoints';

// ============================================================================
// 서비스 정보 타입
// ============================================================================

// GET /api/v1/service-info 응답
// 주의: 이 DTO는 백엔드가 snake_case 필드명을 그대로 반환합니다 (swagger 260316 기준)
export interface ServiceInfoDto {
  service_name: string;
  email: string;
  business_name: string;
  ceo: string;
  business_registration_number: string;
  mail_order_sales_registration: string;
  address: string;
}

// ============================================================================
// 서비스 정보 조회
// ============================================================================

/**
 * 서비스 정보 조회
 */
export async function getServiceInfo(): Promise<ServiceInfoDto> {
  const response = await api.get<ServiceInfoDto>(
    SERVICE_INFO_ENDPOINTS.GET_SERVICE_INFO
  );
  return response.data;
}

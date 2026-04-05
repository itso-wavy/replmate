import { api } from '@/lib/api';
import { SERVICE_INFO_ENDPOINTS } from '@/lib/endpoints';

// ==========================================================
// 서비스 정보 타입
// ==========================================================

// GET /api/v1/service-info 응답
export interface ServiceInfoDto {
  serviceName: string;
  email: string;
  businessName: string;
  ceo: string;
  businessRegistrationNumber: string;
  mailOrderSalesRegistration: string;
  address: string;
}

// ==========================================================
// 서비스 정보 조회
// ==========================================================

/**
 * 서비스 정보 조회
 */
export async function getServiceInfo(): Promise<ServiceInfoDto> {
  const response = await api.get<ServiceInfoDto>(
    SERVICE_INFO_ENDPOINTS.GET_SERVICE_INFO
  );
  return response.data;
}

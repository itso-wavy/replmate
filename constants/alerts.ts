import type { Alert } from '@/types/domain/alert';
import type { ReminderDomain } from '@/types/domain/reminder';
import { ReminderEvent } from '@/types/enums';

import { ROUTES } from './nav-menu';

export const alertsConfig: Record<ReminderEvent, Alert> = {
  [ReminderEvent.PAYMENT_FAILED]: {
    id: 'alert-payment-failed',
    createdAt: new Date(),
    type: ReminderEvent.PAYMENT_FAILED,
    variant: 'error',
    // TODO: meta.daysLeft로 D-N 동적 치환 필요
    title: `정기 결제에 실패했습니다. D-? 후 무료 플랜으로 전환됩니다.\n원활한 서비스 이용을 위해 결제 정보를 확인해주세요.`,
    href: ROUTES.SUBSCRIBE,
  },
  [ReminderEvent.STORE_AUTH_REJECTED]: {
    id: 'alert-store-auth-rejected',
    createdAt: new Date(),
    type: ReminderEvent.STORE_AUTH_REJECTED,
    variant: 'warning',
    title: `쇼핑몰 관리자 인증이 반려되었습니다.`,
    href: ROUTES.STORES,
  },
  [ReminderEvent.STORE_ADJUSTMENT_REQUIRED]: {
    id: 'alert-store-adjustment-required',
    createdAt: new Date(),
    type: ReminderEvent.STORE_ADJUSTMENT_REQUIRED,
    variant: 'warning',
    title: `구독 플랜 변경으로 쇼핑몰 수 조정이 필요합니다.`,
    href: ROUTES.STORES,
  },
  [ReminderEvent.PRODUCT_ADJUSTMENT_REQUIRED]: {
    id: 'alert-product-adjustment-required',
    createdAt: new Date(),
    type: ReminderEvent.PRODUCT_ADJUSTMENT_REQUIRED,
    variant: 'warning',
    title: '구독 플랜 변경으로 상품 수 조정이 필요합니다.',
    href: ROUTES.PRODUCTS,
  },
  [ReminderEvent.STORE_CONNECTION_REQUIRED]: {
    id: 'alert-store-connection-required',
    createdAt: new Date(),
    type: ReminderEvent.STORE_CONNECTION_REQUIRED,
    variant: 'warning',
    title: '쇼핑몰 연동이 필요합니다.',
    description:
      '현재 사용 가능한 쇼핑몰이 없어 서비스 이용이 제한됩니다. 쇼핑몰 상태를 확인해 주세요.',
    href: ROUTES.STORES,
  },
  [ReminderEvent.STORE_ADJUSTMENT_REQUIRED_DETAIL]: {
    id: 'alert-store-adjustment-required-detail',
    createdAt: new Date(),
    type: ReminderEvent.STORE_ADJUSTMENT_REQUIRED_DETAIL,
    variant: 'warning',
    title: '구독 플랜 변경으로 쇼핑몰 조정이 필요합니다.',
    description:
      '2025.01.01부터 무료 플랜(쇼핑몰 최대 1개 · 상품 최대 20개)이 적용됩니다.\n현재 쇼핑몰 2개, 상품 30개가 등록되어 있어 조정이 필요합니다. 기한 내 조정하지 않으실 경우, 최근 등록된 순서대로 자동 비활성화 처리됩니다.',
  },
  [ReminderEvent.PRODUCT_ADJUSTMENT_REQUIRED_DETAIL]: {
    id: 'alert-product-adjustment-required-detail',
    createdAt: new Date(),
    type: ReminderEvent.PRODUCT_ADJUSTMENT_REQUIRED_DETAIL,
    variant: 'warning',
    title: '구독 플랜 변경으로 상품 조정이 필요합니다.',
    description:
      '2025.01.01부터 무료 플랜(쇼핑몰 최대 1개 · 상품 최대 20개)이 적용됩니다.',
  },
  [ReminderEvent.STORE_ADJUSTMENT_SCHEDULED]: {
    id: 'alert-store-adjustment-scheduled',
    createdAt: new Date(),
    type: ReminderEvent.STORE_ADJUSTMENT_SCHEDULED,
    variant: 'info',
    title: '구독 플랜 변경으로 쇼핑몰이 조정될 예정입니다.',
    description:
      '2025.01.01부터 무료 플랜(쇼핑몰 최대 1개 · 상품 최대 20개)이 적용됩니다.',
  },
  [ReminderEvent.PRODUCT_ADJUSTMENT_SCHEDULED]: {
    id: 'alert-product-adjustment-scheduled',
    createdAt: new Date(),
    type: ReminderEvent.PRODUCT_ADJUSTMENT_SCHEDULED,
    variant: 'info',
    title: '구독 플랜 변경으로 상품이 조정될 예정입니다.',
    description:
      '2025.01.01부터 무료 플랜(쇼핑몰 최대 1개 · 상품 최대 20개)이 적용됩니다.',
  },
};

/**
 * FIXME: 여기 바뀜
 * ReminderDomain → Alert 변환
 *
 * 같은 AlertEvent라도 meta 값에 따라 다른 ReminderEvent을 반환할 수 있음.
 * (예: "경고배너-다운그레이드" 이벤트는 store/product 초과 모두 동일 타입으로 내려옴)
 * → meta 구조는 실제 데이터 수신 후 분기 처리 추가 필요 (.docs/api-mapping.md §0 참고)
 *
 * TODO: plan_expiring_soon, quota_running_low, product_sync_needed 미매핑 (ReminderEvent 없음)
 */
export function toAlert(reminder: ReminderDomain): Alert | null {
  let alertType: ReminderEvent | null = null;

  switch (reminder.event) {
    case 'plan_expired': {
      // TODO: meta.daysLeft 키 확정 후 정확한 키 사용
      const daysLeft = reminder.meta?.daysLeft;
      const base = alertsConfig[ReminderEvent.PAYMENT_FAILED];
      return {
        ...base,
        id: String(reminder.id),
        createdAt: reminder.createdAt,
        title:
          daysLeft != null
            ? `정기 결제에 실패했습니다. D-${daysLeft} 후 무료 플랜으로 전환됩니다.\n원활한 서비스 이용을 위해 결제 정보를 확인해주세요.`
            : base.title,
      };
    }
    case 'store_auth_expired':
      alertType = ReminderEvent.STORE_AUTH_REJECTED;
      break;
    case 'store_verification_required':
      alertType = ReminderEvent.STORE_CONNECTION_REQUIRED;
      break;
    case 'product_limit_reached':
      // 동일 이벤트 타입으로 store/product 초과 모두 내려옴 (.docs/api-mapping.md §0)
      // TODO: meta 구조가 확정되면 정확한 키 사용 (현재 meta.resource 가정)
      alertType =
        reminder.meta?.resource === 'store'
          ? ReminderEvent.STORE_ADJUSTMENT_REQUIRED
          : ReminderEvent.PRODUCT_ADJUSTMENT_REQUIRED;
      break;
    default:
      return null;
  }

  return {
    ...alertsConfig[alertType],
    id: String(reminder.id),
    createdAt: reminder.createdAt,
  };
}

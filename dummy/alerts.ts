import { Alert, AlertType } from '@/types';

export const alertsConfig: Record<AlertType, Alert> = {
  [AlertType.PAYMENT_FAILED]: {
    id: 'alert-payment-failed',
    createdAt: new Date(),
    type: AlertType.PAYMENT_FAILED,
    variant: 'error',
    title: `정기 결제에 실패했습니다. D-2 후 무료 플랜으로 전환됩니다.\n원활한 서비스 이용을 위해 결제 정보를 확인해 주세요.`,
    href: '/subscribe',
  },
  [AlertType.STORE_AUTH_REJECTED]: {
    id: 'alert-store-auth-rejected',
    createdAt: new Date(),
    type: AlertType.STORE_AUTH_REJECTED,
    variant: 'warning',
    title: `쇼핑몰 관리자 인증이 반려되었습니다.`,
    href: '/stores',
  },
  [AlertType.STORE_ADJUSTMENT_REQUIRED]: {
    id: 'alert-store-adjustment-required',
    createdAt: new Date(),
    type: AlertType.STORE_ADJUSTMENT_REQUIRED,
    variant: 'warning',
    title: `구독 플랜 변경으로 쇼핑몰 수 조정이 필요합니다.`,
    href: '/stores',
  },
  [AlertType.PRODUCT_ADJUSTMENT_REQUIRED]: {
    id: 'alert-product-adjustment-required',
    createdAt: new Date(),
    type: AlertType.PRODUCT_ADJUSTMENT_REQUIRED,
    variant: 'warning',
    title: '구독 플랜 변경으로 상품 수 조정이 필요합니다.',
    href: '/products',
  },
  [AlertType.STORE_CONNECTION_REQUIRED]: {
    id: 'alert-store-connection-required',
    createdAt: new Date(),
    type: AlertType.STORE_CONNECTION_REQUIRED,
    variant: 'warning',
    title: '쇼핑몰 연동이 필요합니다.',
    description:
      '현재 사용 가능한 쇼핑몰이 없어 서비스 이용이 제한됩니다. 쇼핑몰 상태를 확인해 주세요.',
    href: '/stores',
  },
  [AlertType.STORE_ADJUSTMENT_REQUIRED_DETAIL]: {
    id: 'alert-store-adjustment-required-detail',
    createdAt: new Date(),
    type: AlertType.STORE_ADJUSTMENT_REQUIRED_DETAIL,
    variant: 'warning',
    title: '구독 플랜 변경으로 쇼핑몰 조정이 필요합니다.',
    description:
      '2025.01.01부터 무료 플랜(쇼핑몰 최대 1개 · 상품 최대 20개)이 적용됩니다.\n현재 쇼핑몰 2개, 상품 30개가 등록되어 있어 조정이 필요합니다. 기한 내 조정하지 않으실 경우, 최근 등록된 순서대로 자동 비활성화 처리됩니다.',
  },
  [AlertType.PRODUCT_ADJUSTMENT_REQUIRED_DETAIL]: {
    id: 'alert-product-adjustment-required-detail',
    createdAt: new Date(),
    type: AlertType.PRODUCT_ADJUSTMENT_REQUIRED_DETAIL,
    variant: 'warning',
    title: '구독 플랜 변경으로 상품 조정이 필요합니다.',
    description:
      '2025.01.01부터 무료 플랜(쇼핑몰 최대 1개 · 상품 최대 20개)이 적용됩니다.',
  },
  [AlertType.STORE_ADJUSTMENT_SCHEDULED]: {
    id: 'alert-store-adjustment-scheduled',
    createdAt: new Date(),
    type: AlertType.STORE_ADJUSTMENT_SCHEDULED,
    variant: 'info',
    title: '구독 플랜 변경으로 쇼핑몰이 조정될 예정입니다.',
    description:
      '2025.01.01부터 무료 플랜(쇼핑몰 최대 1개 · 상품 최대 20개)이 적용됩니다.',
  },
  [AlertType.PRODUCT_ADJUSTMENT_SCHEDULED]: {
    id: 'alert-product-adjustment-scheduled',
    createdAt: new Date(),
    type: AlertType.PRODUCT_ADJUSTMENT_SCHEDULED,
    variant: 'info',
    title: '구독 플랜 변경으로 상품이 조정될 예정입니다.',
    description:
      '2025.01.01부터 무료 플랜(쇼핑몰 최대 1개 · 상품 최대 20개)이 적용됩니다.',
  },
};

export const dummyDashboardAlerts: Alert[] = [
  alertsConfig[AlertType.PAYMENT_FAILED],
  alertsConfig[AlertType.STORE_AUTH_REJECTED],
  alertsConfig[AlertType.STORE_ADJUSTMENT_REQUIRED],
  alertsConfig[AlertType.PRODUCT_ADJUSTMENT_REQUIRED],
];

export const dummyStoreAlert: Alert =
  alertsConfig[AlertType.STORE_ADJUSTMENT_REQUIRED_DETAIL];

export const dummyProductAlert: Alert =
  alertsConfig[AlertType.PRODUCT_ADJUSTMENT_SCHEDULED];

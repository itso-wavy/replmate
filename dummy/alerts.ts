import type { Alert } from '@/types';
import { AlertType } from '@/types';
import { alertsConfig } from '@/constants/alerts';

export { alertsConfig };

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

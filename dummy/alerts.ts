import type { Alert } from '@/types';
import { ReminderEvent } from '@/types';
import { alertsConfig } from '@/constants/alerts';

export { alertsConfig };

export const dummyDashboardAlerts: Alert[] = [
  alertsConfig[ReminderEvent.PAYMENT_FAILED],
  alertsConfig[ReminderEvent.STORE_AUTH_REJECTED],
  alertsConfig[ReminderEvent.STORE_ADJUSTMENT_REQUIRED],
  alertsConfig[ReminderEvent.PRODUCT_ADJUSTMENT_REQUIRED],
];

export const dummyStoreAlert: Alert =
  alertsConfig[ReminderEvent.STORE_ADJUSTMENT_REQUIRED_DETAIL];

export const dummyProductAlert: Alert =
  alertsConfig[ReminderEvent.PRODUCT_ADJUSTMENT_SCHEDULED];

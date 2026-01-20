import { AlertType } from './enums';

export type AlertVariant = 'success' | 'info' | 'warning' | 'error';

export interface Alert {
  id: string;
  createdAt: Date;
  variant: AlertVariant;
  type: AlertType;
  title: string;
  description?: string;
  href?: string;
}

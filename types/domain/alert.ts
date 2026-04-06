import type {
  ReminderCategory,
  ReminderEvent,
  ReminderLevel,
} from '@/types/enums';

export interface Alert {
  id: string;
  createdAt: Date;
  variant: ReminderLevel;
  category: ReminderCategory;
  type: ReminderEvent;
  title: string;
  description?: string;
  href?: string;
}

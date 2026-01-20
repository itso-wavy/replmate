// ============================================================================
// 알림 (Reminders)
// ============================================================================

// GET /api/v1/reminders 리마인더 목록 조회
export interface ReminderDto {
  id: number;
  userId: number;
  category: string;
  level: string;
  title: string;
  message: string;
  actionUrl: string | null;
  isRead: boolean;
  readAt: string | null;
  createdAt: string;
}

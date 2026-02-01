// ============================================================================
// 문의 (Contacts)
// ============================================================================

// GET /api/v1/contacts 문의 목록 조회
// POST /api/v1/contacts 문의 생성
// GET /api/v1/contacts/{contact_id} 문의 단건 조회
export interface ContactDto {
  id: number;
  name: string;
  email: string;
  subject: string;
  content: string;
  isRead: boolean;
  createdAt: string;
}

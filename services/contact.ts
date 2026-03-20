import { api } from '@/lib/api';
import { CONTACT_ENDPOINTS } from '@/lib/endpoints';
import type { ContactDto } from '@/types/api/contact';
import { ContactDomain, toContactDomain } from '@/types/domain/contact';

/**
 * 문의 생성
 * POST /api/v1/contacts
 */
export async function createContact(data: {
  name: string;
  email: string;
  subject: string;
  content: string;
}): Promise<ContactDomain> {
  const response = await api.post<ContactDto>(
    CONTACT_ENDPOINTS.CREATE_CONTACT,
    data
  );
  return toContactDomain(response.data);
}

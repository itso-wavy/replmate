import type { ContactDto } from '@/types/api/contact';

/**
 * 문의 Domain 타입
 * API DTO의 날짜 문자열을 Date 객체로 변환
 */
export interface ContactDomain {
  id: number;
  name: string;
  email: string;
  subject: string;
  content: string;
  isRead: boolean;
  createdAt: Date;
}

/**
 * 답변 정보를 포함한 문의 확장 타입
 * 프론트엔드에서 문의 관리 시 답변 상태 표시용
 */
export interface ContactWithReply extends ContactDomain {
  replyContent?: string;
  repliedAt?: Date;
  repliedBy?: string;
}

/**
 * ContactDto를 ContactDomain으로 변환
 * @param dto - API에서 받은 ContactDto
 * @returns ContactDomain 객체
 */
export function toContactDomain(dto: ContactDto): ContactDomain {
  return {
    id: dto.id,
    name: dto.name,
    email: dto.email,
    subject: dto.subject,
    content: dto.content,
    isRead: dto.isRead,
    createdAt: new Date(dto.createdAt),
  };
}

/**
 * ContactDto 배열을 ContactDomain 배열로 변환
 * @param dtos - API에서 받은 ContactDto 배열
 * @returns ContactDomain 배열
 */
export function toContactDomainList(dtos: ContactDto[]): ContactDomain[] {
  return dtos.map(toContactDomain);
}

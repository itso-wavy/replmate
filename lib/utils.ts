import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * 이메일 링크 생성 유틸리티
 */

interface CreateMailtoLinkOptions {
  subject?: string;
  body?: string;
  cc?: string;
  bcc?: string;
}

export const createMailtoLink = (
  email: string,
  options?: CreateMailtoLinkOptions
): string => {
  const { subject, body, cc, bcc } = options || {};

  const params = new URLSearchParams();

  if (subject) params.append('subject', subject);
  if (body) params.append('body', body);
  if (cc) params.append('cc', cc);
  if (bcc) params.append('bcc', bcc);

  const query = params.toString();
  return `mailto:${email}${query ? `?${query}` : ''}`;
};

/**
 * 이메일 링크로 열기
 * @param email - 수신자 이메일 주소
 * @param options - 선택 옵션
 */
export const openMailtoLink = (
  email: string,
  options?: CreateMailtoLinkOptions
): void => {
  if (typeof window === 'undefined') return;
  window.location.href = createMailtoLink(email, options);
};

export const openReplmateSupportEmail = () => {
  openMailtoLink('support@replmate.com', {
    subject: '[리플메이트]_고객_문의',
  });
};

/**
 * 날짜 문자열을 'YYYY.MM.DD' 형식으로 변환
 * @param dateString - 날짜 문자열 (예: '2025.12.02' 또는 ISO 형식)
 * @returns 'YYYY.MM.DD' 형식의 문자열
 */
export const formatDate = (dateString: string) => {
  // 이미 'YYYY.MM.DD' 형식이면 그대로 반환
  if (/^\d{4}\.\d{2}\.\d{2}$/.test(dateString)) {
    return dateString;
  }

  // Date 객체로 변환 후 포맷팅
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}.${month}.${day}`;
};

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

/**
 * 이메일 링크 생성 유틸리티
 */
import { toast } from 'sonner';

import { COMPANY_META_INFO } from '@/constants/company';

interface CreateMailtoLinkOptions {
  subject?: string;
  body?: string;
  cc?: string;
  bcc?: string;
}

const COPY_TOAST_STYLE = {
  background: 'var(--color-accent-foreground)',
  color: 'var(--color-background)',
  border: '1px solid var(--color-foreground-description)',
} as const;

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
 * 기본 메일 앱이 없는 환경에서는 이메일 주소를 클립보드에 복사하고 토스트로 안내한다.
 * @param email - 수신자 이메일 주소
 * @param options - 선택 옵션
 */
export const openMailtoLink = (
  email: string,
  options?: CreateMailtoLinkOptions
): void => {
  if (typeof window === 'undefined') return;

  // 메일 앱이 뜨면 브라우저 창이 포커스를 잃는다는 점을 이용
  let mailAppOpened = false;
  const handleBlur = () => {
    mailAppOpened = true;
  };
  window.addEventListener('blur', handleBlur, { once: true });

  window.location.href = createMailtoLink(email, options);

  setTimeout(() => {
    window.removeEventListener('blur', handleBlur);
    if (mailAppOpened) return;

    navigator.clipboard
      ?.writeText(email)
      .then(() => {
        toast.success('이메일 주소가 복사되었습니다.', {
          style: COPY_TOAST_STYLE,
        });
      })
      .catch(() => {
        // 클립보드 접근 실패
      });
  }, 1500);
};

export const openReplmateSupportEmail = () => {
  openMailtoLink(COMPANY_META_INFO.EMAIL, {
    subject: '[리플메이트]_고객_문의',
  });
};

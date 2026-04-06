'use client';

import { useRouter } from 'next/navigation';

import { EnvelopeSimpleIcon } from '@phosphor-icons/react';
import { CheckCircle2, CircleX, PhoneIcon } from 'lucide-react';

import { Logo, TermsAccordionItem } from '@/components/global';
import { WithdrawModal } from '@/components/modal';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { Switch } from '@/components/ui/switch';
import { COMPANY_META_INFO } from '@/constants/company';
import { ROUTES } from '@/constants/nav-menu';
import { TERMS_CONFIG } from '@/constants/terms';
import { formatDate, openReplmateSupportEmail } from '@/lib/utils';

import {
  InnerPageLayout,
  InnerPageRow,
  InnerPageSection,
} from '../_components';
import { useAccountPage } from './_hooks/useAccountPage';

const authProviderLabelMap: Record<string, string> = {
  google: 'Google 로그인',
  kakao: 'Kakao 로그인',
  naver: 'Naver 로그인',
};

const AccountPage = () => {
  const router = useRouter();

  const {
    user,
    termsList,
    expandedTerms,
    toggleExpand,
    emailEnabled,
    smsEnabled,
    isLoadingNotification,
    isUpdatingNotification,
    handleEmailToggle,
    handleSmsToggle,
    isVerifying,
    handleUserVerify,
    isLoadingTerms,
    subscriptionStatus,
    isWithdrawModalOpen,
    setIsWithdrawModalOpen,
    isDeleting,
    handleUserWithdraw,
  } = useAccountPage();

  return (
    <InnerPageLayout heading='계정 관리'>
      {/* 계정 정보 */}
      <InnerPageSection heading='계정 정보'>
        <div className='space-y-2.5'>
          <InnerPageRow
            label='이메일'
            className='*:first:text-muted-foreground'
          >
            {user?.email ?? '-'}
          </InnerPageRow>
          <InnerPageRow
            label='가입일'
            className='*:first:text-muted-foreground'
          >
            {formatDate(user?.createdAt) ?? '-'}
          </InnerPageRow>
          <InnerPageRow
            label='로그인 방식'
            className='*:first:text-muted-foreground'
          >
            {authProviderLabelMap[user?.authProvider ?? ''] ?? '-'}
          </InnerPageRow>
        </div>
      </InnerPageSection>

      {/* 본인인증 정보 */}
      <InnerPageSection heading='본인인증 정보'>
        <div className='flex items-center justify-between rounded-xl border px-4 py-3.5'>
          {user?.isVerified ? (
            <p className='typo-body-14 text-brand-500 flex items-center gap-1.5'>
              <CheckCircle2 size={16} />
              <span className='font-medium'>인증 완료</span>
              {user.verifiedAt && (
                <span className='text-muted-foreground font-normal'>
                  ({formatDate(user.verifiedAt, 'yyyy.MM.dd')})
                </span>
              )}
            </p>
          ) : (
            <>
              <p className='typo-body-14 text-brand-red flex items-center gap-1.5'>
                <CircleX size={16} />
                미인증
              </p>
              <Button
                onClick={handleUserVerify}
                isPending={isVerifying}
                className='min-w-[80px]'
              >
                본인인증
              </Button>
            </>
          )}
        </div>
      </InnerPageSection>

      {/* 마케팅 및 알림 설정 */}
      <InnerPageSection heading='마케팅 및 알림 설정'>
        <InnerPageRow label='이메일 수신' className='justify-between'>
          <Switch
            checked={emailEnabled}
            onCheckedChange={handleEmailToggle}
            disabled={isLoadingNotification || isUpdatingNotification}
          />
        </InnerPageRow>
        <InnerPageRow label='SMS 문자 수신' className='justify-between'>
          <Switch
            checked={smsEnabled}
            onCheckedChange={handleSmsToggle}
            disabled={isLoadingNotification || isUpdatingNotification}
          />
        </InnerPageRow>
        <p className='typo-body-14 text-foreground-description-muted'>
          필수 고지 사항 및 중요 알림은 수신 동의와 관계 없이 발송됩니다.
        </p>
      </InnerPageSection>

      {/* 약관 */}
      <InnerPageSection heading='약관'>
        {isLoadingTerms ? (
          <div className='grid place-content-center py-6'>
            <Spinner />
          </div>
        ) : (
          <div className='divide-y'>
            {TERMS_CONFIG.map(({ type, label }) => (
              <TermsAccordionItem
                key={type}
                size='sm'
                label={label}
                content={termsList?.find((t) => t.type === type)?.content}
                isExpanded={expandedTerms.has(type)}
                onToggleExpand={() => toggleExpand(type)}
              />
            ))}
          </div>
        )}
      </InnerPageSection>

      {/* 회원탈퇴 */}
      <InnerPageSection heading='회원탈퇴'>
        <div className='flex items-center justify-between'>
          <p className='typo-body-14 text-foreground-description'>
            회원 탈퇴 시 모든 데이터가 삭제되며 복구할 수 없습니다.
          </p>
          <Button
            onClick={() => setIsWithdrawModalOpen(true)}
            isPending={isDeleting}
            disabled={!subscriptionStatus}
            variant='link'
            className='text-foreground-description-muted hover:text-foreground-description -ml-0.5 underline underline-offset-[6px]'
          >
            탈퇴하기
          </Button>
        </div>
      </InnerPageSection>

      {/* 회사 정보 */}
      <div className='typo-caption-14 text-foreground-description mt-16 bg-gray-50 py-8 md:py-16'>
        <div className='wrapper'>
          <div className='flex items-start'>
            <Logo
              // href={ROUTES.ACCOUNT}
              showIcon
              showText={false}
              iconClassName='-mt-2 size-[40px] mr-2 '
              className='pointer-events-none'
            />

            <div className='space-y-2 select-text'>
              <p className='typo-heading-16 text-brand-500 mt-2.5 font-semibold'>
                {COMPANY_META_INFO.COMPANY_NAME}
              </p>
              <div className='mt-1 space-y-0.5'>
                <p>
                  대표: {COMPANY_META_INFO.REPRESENTATIVE} | 사업자등록번호:{' '}
                  {COMPANY_META_INFO.BUSINESS_REGISTRATION_NUMBER} |
                  통신판매업신고:
                  {COMPANY_META_INFO.MAIL_ORDER_BUSINESS_REPORT_NUMBER}
                </p>
                <p>주소: {COMPANY_META_INFO.ADDRESS}</p>
              </div>

              <div className='typo-caption-14 *:group *:hover:text-foreground mt-3.5 *:flex *:w-fit *:cursor-pointer *:items-center *:transition-colors'>
                <a
                  href={`tel:${COMPANY_META_INFO.CUSTOMER_CENTER}`}
                  className='mt-6 md:mt-2'
                >
                  <PhoneIcon size={12} className='text-brand-500 mr-1.5' />
                  <span>고객센터: {COMPANY_META_INFO.CUSTOMER_CENTER}</span>
                </a>

                <div className='mt-1 flex w-fit cursor-pointer items-center transition-colors'>
                  <EnvelopeSimpleIcon
                    size={12}
                    className='text-brand-500 mr-1.5'
                  />
                  <p
                    onClick={openReplmateSupportEmail}
                    className='flex items-start'
                  >
                    이메일 문의: {COMPANY_META_INFO.EMAIL}
                  </p>
                </div>
              </div>

              {/* <p className='pt-2'>© 2026 Replmate. All rights reserved.</p> */}
            </div>
          </div>
        </div>
      </div>

      {subscriptionStatus && (
        <WithdrawModal
          open={isWithdrawModalOpen}
          onOpenChange={setIsWithdrawModalOpen}
          subscriptionStatus={subscriptionStatus}
          onWithdraw={handleUserWithdraw}
          onGoToSubscribe={() => router.push(ROUTES.SUBSCRIBE)}
          isDeleting={isDeleting}
        />
      )}
    </InnerPageLayout>
  );
};

export default AccountPage;

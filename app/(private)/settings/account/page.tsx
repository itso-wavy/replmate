'use client';

import { useState } from 'react';

import { CheckCircle2, CircleX } from 'lucide-react';

import { TermsAccordionItem } from '@/components/global/TermsAccordionItem';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { TERMS_CONFIG } from '@/constants/terms';
import { dummyNotificationSettings } from '@/dummy/account';
import { useTermsList } from '@/hooks/useTerms';
import { formatDate } from '@/lib/utils';
import { UserStore } from '@/store/userStore';

import {
  InnerPageLayout,
  InnerPageRow,
  InnerPageSection,
} from '../_components';

const authProviderLabelMap: Record<string, string> = {
  google: 'Google 로그인',
  kakao: 'Kakao 로그인',
  naver: 'Naver 로그인',
};

const AccountPage = () => {
  const user = UserStore.useUser();
  const { data: termsList } = useTermsList();

  const [expandedTerms, setExpandedTerms] = useState<Set<string>>(new Set());
  const toggleExpand = (type: string) =>
    setExpandedTerms((prev) => {
      const next = new Set(prev);
      next.has(type) ? next.delete(type) : next.add(type);
      return next;
    });

  const [emailEnabled, setEmailEnabled] = useState(
    dummyNotificationSettings.emailEnabled
  );
  const [smsEnabled, setSmsEnabled] = useState(
    dummyNotificationSettings.smsEnabled
  );

  const handleUserVerify = () => {};
  const handleAlarmSettingSave = () => {};
  const handleUserWithdraw = () => {};

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
              <Button onClick={handleUserVerify} className='min-w-[80px]'>
                본인인증
              </Button>
            </>
          )}
        </div>
      </InnerPageSection>

      {/* 마케팅 및 알림 설정 */}
      <InnerPageSection heading='마케팅 및 알림 설정'>
        <form className='flex flex-col space-y-4 rounded-xl border px-4 py-4'>
          <InnerPageRow
            label='이메일 수신'
            className='justify-between *:first:font-medium'
          >
            <Switch checked={emailEnabled} onCheckedChange={setEmailEnabled} />
          </InnerPageRow>
          <InnerPageRow
            label='SMS 문자 수신'
            className='justify-between *:first:font-medium'
          >
            <Switch checked={smsEnabled} onCheckedChange={setSmsEnabled} />
          </InnerPageRow>

          <div className='mt-1 flex items-center justify-end gap-2'>
            <p className='typo-body-14 text-foreground-description'>
              필수 고지 사항 및 중요 알림은 수신 동의와 관계 없이 발송됩니다.
            </p>
            <Button
              onClick={handleAlarmSettingSave}
              variant='outline'
              className='min-w-[80px] border-0'
            >
              저장하기
            </Button>
          </div>
        </form>
      </InnerPageSection>

      {/* 약관 */}
      <InnerPageSection heading='약관'>
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
      </InnerPageSection>

      {/* 회원탈퇴 */}
      <InnerPageSection heading='회원탈퇴'>
        <div className='flex items-center justify-between'>
          <p className='typo-body-14 text-foreground-description'>
            회원 탈퇴 시 모든 데이터가 삭제되며 복구할 수 없습니다.
          </p>
          <Button
            onClick={handleUserWithdraw}
            variant='ghost'
            className='bg-input/30 text-destructive hover:text-destructive/80 min-w-[80px] shrink-0'
          >
            탈퇴하기
          </Button>
        </div>
      </InnerPageSection>
    </InnerPageLayout>
  );
};

export default AccountPage;

'use client';

import { useRouter } from 'next/navigation';

import { useState } from 'react';

import { signIn } from 'next-auth/react';

import { PublicHeader } from '@/app/(public)/_components';
import { TermsAccordionItem } from '@/components/global/TermsAccordionItem';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Spinner } from '@/components/ui/spinner';
import { AUTH_PROVIDER_ID } from '@/constants/auth';
import { TERMS_CONFIG } from '@/constants/terms';
import { useTermsList } from '@/hooks/useTerms';
import { useAgreeTerms } from '@/hooks/useUser';
import { api } from '@/lib/api';
import { USER_ENDPOINTS } from '@/lib/endpoints';
import type { UserDto } from '@/types/api/user';
import { TermsType } from '@/types/enums';

const REQUIRED_TYPES = TERMS_CONFIG.filter((t) => t.required).map(
  (t) => t.type
);

export default function TermsAgreementPage() {
  const router = useRouter();
  const { data: termsList, isLoading } = useTermsList();
  const { mutate: agreeTerms, isPending } = useAgreeTerms();
  const [checked, setChecked] = useState<Set<TermsType>>(new Set());
  const [expanded, setExpanded] = useState<Set<TermsType>>(new Set());

  const checkedCount = checked.size;
  const allChecked = checkedCount === TERMS_CONFIG.length;
  const allRequiredChecked = REQUIRED_TYPES.every((t) => checked.has(t));

  const toggleAll = () => {
    if (allChecked) {
      setChecked(new Set());
    } else {
      setChecked(new Set(TERMS_CONFIG.map((t) => t.type)));
    }
  };

  const toggleCheck = (type: TermsType) => {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(type)) next.delete(type);
      else next.add(type);
      return next;
    });
  };

  const toggleExpand = (type: TermsType) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(type)) next.delete(type);
      else next.add(type);
      return next;
    });
  };

  const handleSubmit = () => {
    if (!allRequiredChecked) return;

    const checkedIds =
      termsList
        ?.filter((t) => checked.has(t.type as TermsType))
        .map((t) => t.id) ?? [];

    agreeTerms(checkedIds, {
      onSuccess: async () => {
        // proxy의 needsTermsAgreement 체크를 통과하기 위해 세션 갱신
        const res = await api.get<UserDto>(USER_ENDPOINTS.GET_USER);
        await signIn(AUTH_PROVIDER_ID.BACKEND_SESSION, {
          user: JSON.stringify(res.data),
          redirect: false,
        });
        router.replace('/dashboard');
      },
    });
  };

  return (
    <>
      <PublicHeader />

      <main className='wrapper flex min-h-svh flex-1 flex-col overflow-y-auto py-16'>
        {isLoading && (
          <div className='grid place-content-center'>
            <Spinner />
          </div>
        )}

        {!isLoading && (
          <div className='relative mx-auto flex w-[520px] flex-col'>
            <div>
              <h1 className='text-foreground typo-display-32'>약관동의</h1>
              <p className='typo-body-16 text-muted-foreground pt-2'>
                서비스를 이용하려면 먼저 약관에 동의해 주세요.
              </p>
            </div>
            <div className='mt-14 flex flex-col space-y-2'>
              {/* 전체 동의 */}
              <div
                className='bg-accent flex cursor-pointer items-center gap-3 rounded-xl px-5 py-4'
                onClick={toggleAll}
              >
                <Checkbox
                  checked={allChecked}
                  onCheckedChange={toggleAll}
                  onClick={(e) => e.stopPropagation()}
                />
                <span className='typo-body-16 font-semibold'>전체 동의</span>
              </div>

              {/* Terms List */}
              <div className='mx-6 mt-2 divide-y'>
                {TERMS_CONFIG.map(({ type, label, required }) => (
                  <TermsAccordionItem
                    key={type}
                    label={label}
                    required={required}
                    showRequiredBadge
                    content={termsList?.find((t) => t.type === type)?.content}
                    isExpanded={expanded.has(type)}
                    onToggleExpand={() => toggleExpand(type)}
                    isChecked={checked.has(type)}
                    onToggleCheck={() => toggleCheck(type)}
                  />
                ))}
              </div>

              {/* Submit */}
              <div className='mt-8'>
                <Button
                  className='w-full'
                  disabled={!allRequiredChecked || isPending}
                  onClick={handleSubmit}
                >
                  {isPending ? (
                    <Spinner className='size-4' />
                  ) : (
                    '동의하고 시작하기'
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
}

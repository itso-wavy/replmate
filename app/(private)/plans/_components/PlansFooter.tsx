'use client';

import { useState } from 'react';

import { EnvelopeSimpleIcon } from '@phosphor-icons/react';
import { PhoneIcon } from 'lucide-react';

// import { Logo } from '@/components/global';
import { TermModal } from '@/components/modal';
import { COMPANY_META_INFO } from '@/constants/company';
import { TERMS_CONFIG } from '@/constants/terms';
import { openReplmateSupportEmail } from '@/lib/utils';
import { TermsType } from '@/types/enums';

const PlansFooter = () => {
  const [termModal, setTermModal] = useState<TermsType | null>(null);

  return (
    <>
      <div className='typo-caption-14 text-foreground-description mt-8'>
        <div className='wrapper'>
          <div className='flex items-start'>
            {/* <Logo
              showIcon
              showText={false}
              iconClassName='-mt-2 size-[40px] mr-2 '
              className='pointer-events-none'
            /> */}

            <div className='space-y-2 select-text'>
              <p className='typo-heading-16 text-brand-500 mt-2.5 font-semibold'>
                {COMPANY_META_INFO.COMPANY_NAME}
              </p>
              <div className='mt-1 space-y-0.5'>
                <p>
                  대표: {COMPANY_META_INFO.REPRESENTATIVE} | 사업자등록번호:{' '}
                  {COMPANY_META_INFO.BUSINESS_REGISTRATION_NUMBER}
                  {COMPANY_META_INFO.MAIL_ORDER_BUSINESS_REPORT_NUMBER &&
                    `|
                  통신판매업신고:
                  ${COMPANY_META_INFO.MAIL_ORDER_BUSINESS_REPORT_NUMBER}`}
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

              <div className='mt-3.5 flex items-center space-x-4'>
                {TERMS_CONFIG.filter((t) => t.required).map(
                  ({ label, type }) => (
                    <button
                      key={type}
                      type='button'
                      className='hover:text-foreground transition-colors'
                      onClick={() => setTermModal(type)}
                    >
                      {label}
                    </button>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {termModal && (
        <TermModal
          id={termModal}
          open={termModal !== null}
          onOpenChange={(open) => !open && setTermModal(null)}
        />
      )}
    </>
  );
};

export default PlansFooter;

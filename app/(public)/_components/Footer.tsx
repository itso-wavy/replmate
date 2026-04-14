'use client';

import { useState } from 'react';

import { EnvelopeSimpleIcon } from '@phosphor-icons/react/dist/ssr';
import { PhoneIcon } from 'lucide-react';

import Logo from '@/components/global/Logo';
import { TermModal } from '@/components/modal';
import { COMPANY_META_INFO } from '@/constants/company';
import { openReplmateSupportEmail } from '@/lib/utils';
import { TermsType } from '@/types';

const Footer = () => {
  const [showTermOfUseModal, setShowTermOfUseModal] = useState(false);
  const [showPrivacyTermModal, setShowPrivacyTermModal] = useState(false);
  const [showServiceTermModal, setShowServiceTermModal] = useState(false);

  return (
    <footer className='bg-gray-50 py-8 text-gray-400 md:py-16 md:pt-20'>
      <div className='wrapper flex flex-col justify-between md:flex-row'>
        <div className='typo-caption-12 mb-8 flex items-start md:mb-0'>
          <Logo
            showIcon
            showText={false}
            iconClassName='-mt-2 grayscale-100 contrast-100 size-[40px] mr-2'
          />

          <div className='space-y-2 select-text'>
            <p className='font-semibold'>{COMPANY_META_INFO.COMPANY_NAME}</p>
            <div className='space-y-0.5'>
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
            <p className='pt-2'>© 2026 Replmate. All rights reserved.</p>
          </div>
        </div>

        <div className='mb-6 border-t border-gray-100 md:border-t-0 md:*:ml-auto'>
          <div className='*:typo-caption-14 *:group *:hover:text-secondary/90 *:flex *:w-fit *:cursor-pointer *:items-center *:transition-colors'>
            <a
              href={`tel:${COMPANY_META_INFO.CUSTOMER_CENTER}`}
              className='mt-6 md:mt-2'
            >
              <PhoneIcon
                size={12}
                className='mr-1.5 group-hover:text-gray-400/90'
              />
              <span>고객센터: {COMPANY_META_INFO.CUSTOMER_CENTER}</span>
            </a>

            <div className='mt-1 flex w-fit cursor-pointer items-center transition-colors'>
              <EnvelopeSimpleIcon
                size={12}
                className='mr-1.5 group-hover:text-gray-400/90'
              />
              <p
                onClick={openReplmateSupportEmail}
                className='flex items-start'
              >
                이메일 문의: {COMPANY_META_INFO.EMAIL}
              </p>
            </div>
          </div>

          <div className='typo-caption-12 mt-4 space-x-4 md:text-end'>
            <button
              type='button'
              onClick={() => setShowTermOfUseModal(true)}
              className='hover:text-secondary/90'
            >
              이용약관
            </button>
            <button
              type='button'
              onClick={() => setShowPrivacyTermModal(true)}
              className='hover:text-secondary/90'
            >
              개인정보 처리방침
            </button>
            <button
              type='button'
              onClick={() => setShowServiceTermModal(true)}
              className='hover:text-secondary/90'
            >
              개인정보 수집 및 이용
            </button>
          </div>
        </div>
      </div>
      <TermModal
        id={TermsType.TERMS_OF_SERVICE}
        open={showTermOfUseModal}
        onOpenChange={setShowTermOfUseModal}
      />
      <TermModal
        id={TermsType.PRIVACY_POLICY}
        open={showPrivacyTermModal}
        onOpenChange={setShowPrivacyTermModal}
      />
      <TermModal
        id={TermsType.PERSONAL_INFO_COLLECTION}
        open={showServiceTermModal}
        onOpenChange={setShowServiceTermModal}
      />
    </footer>
  );
};

export default Footer;

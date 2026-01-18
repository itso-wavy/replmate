'use client';

import { EnvelopeSimpleIcon } from '@phosphor-icons/react/dist/ssr';

import Logo from '@/components/global/Logo';
import TermDialog from '@/components/global/TermDialog';
import { openReplmateSupportEmail } from '@/lib/utils';

const Footer = () => {
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
            <p className='font-semibold'>(주) 리플메이트</p>
            <div className='space-y-0.5'>
              <p>
                대표: 정태준 | 사업자등록번호: 123-45-67890 | 통신판매업신고:
                2024-서울강남-0000
              </p>
              <p>주소: 서울특별시 강남구 테헤란로 123, 리플타워 4층</p>
            </div>
            <p className='pt-2'>© 2025 Replmate. All rights reserved.</p>
          </div>
        </div>

        <div className='typo-caption-14 mb-6 border-t border-gray-100 md:border-t-0 md:*:ml-auto'>
          <div className='hover:text-brand-main/90 group mt-6 flex w-fit cursor-pointer items-center transition-colors md:mt-0'>
            <EnvelopeSimpleIcon
              size={16}
              className='mr-2 group-hover:text-gray-400/90'
            />
            {/* <Mail size={16} className='mr-2 group-hover:text-gray-400/90' /> */}
            <p onClick={openReplmateSupportEmail} className='flex items-start'>
              이메일 문의: support@replmate.com
            </p>
          </div>

          <div className='typo-caption-12 mt-2 w-fit space-x-4 md:text-end'>
            <TermDialog
              id='terms'
              trigger={<div className='hover:text-brand-main/90'>이용약관</div>}
            />
            <TermDialog
              id='privacy'
              trigger={
                <div className='hover:text-brand-main/90'>개인정보처리방침</div>
              }
            />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

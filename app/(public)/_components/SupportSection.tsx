'use client';

import { Button } from '@/components/ui/button';
import { openReplmateSupportEmail } from '@/lib/utils';

const SupportSection = ({ id }: { id: string }) => {
  return (
    <section
      id={id}
      className='relative overflow-hidden bg-gray-900 py-[120px]'
    >
      {/* Background Shapes */}

      {/* Gradation Background */}

      <div className='wrapper'>
        <div className='text-center *:text-balance'>
          <p className='typo-eyebrow-14 text-brand-8 mb-2'>고객지원</p>
          <h2 className='typo-display-36 relative inline-block text-white'>
            리플메이트에 궁금한 점이 있으신가요?
          </h2>
        </div>

        <div className='mx-auto mt-12 flex w-full flex-col items-center justify-center gap-x-4 gap-y-3 *:w-full sm:max-w-[280px] sm:flex-row'>
          {/* <Button
            size='lg'
            onClick={() => router.push('/login')}
            className='from-brand-main to-brand-main/50 bg-gradient-to-r transition-colors hover:bg-white'
          >
            무료로 시작하기
          </Button> */}
          <Button
            size='lg'
            variant='secondary'
            onClick={openReplmateSupportEmail}
            className='from-primary to-brand-2/50 h-12 bg-gradient-to-r transition-colors md:h-14'
          >
            도입 문의하기
          </Button>
        </div>
        <div className='mt-12 text-center'>
          <div className='typo-body-18 text-primary-foreground/90'>
            리뷰 관리가 쉬워지면{' '}
            <span className='text-brand-9/90 relative z-10'>
              매출이 달라집니다
            </span>
          </div>
          <div className='typo-body-16 text-primary-foreground/80'>
            <p>더 이상 감정 노동하지 마세요.</p>
            <p>리플메이트가 든든한 파트너가 되어드리겠습니다.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SupportSection;

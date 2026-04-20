'use client';

import { useRouter } from 'next/navigation';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/constants/nav-menu';
import { openReplmateSupportEmail } from '@/lib/utils';

import { HeroReplyCard } from '.';

const HeroSection = ({ id }: { id: string }) => {
  const router = useRouter();

  return (
    <section
      id={id}
      className='from-warmgray-100 relative bg-gradient-to-b to-white to-50% pt-33 pb-20 md:pt-37 md:pb-32'
    >
      <div className='wrapper relative flex flex-col items-center text-center'>
        <Badge className='text-primary animate-bounce-slow typo-caption-14 border-border mb-4 border bg-white/90 px-3.5 py-3 shadow-xs'>
          ✨ AI 기반 스마트 리뷰 관리
        </Badge>

        <h1 className='typo-display-36 lg:typo-display-48 mb-5 text-balance md:mb-8'>
          쇼핑몰 리뷰 관리,
          <br />
          이제{' '}
          <span className='relative mx-1 inline-block'>
            <span className='from-primary to-brand-mint relative z-10 bg-gradient-to-r bg-clip-text text-transparent'>
              리플메이트 AI
            </span>
            <span className='bg-brand-yellow/80 animate-highlighter absolute bottom-2 left-0 z-0 h-4 w-0 -rotate-1 rounded-full md:h-5' />
          </span>
          에게 맡기세요
        </h1>
        <div className='typo-body-16 md:typo-body-18 text-muted-foreground mb-10 max-w-2xl text-balance'>
          <p>매일 쌓이는 리뷰, 언제까지 직접 쓰실 건가요?</p>
          <p>CS 담당자의 업무 시간을 80% 이상 단축시키세요.</p>
        </div>
        <div className='flex w-full flex-col items-center justify-center gap-x-4 gap-y-3 *:w-full sm:max-w-[280px] sm:flex-row'>
          {/* <Button
            size='lg'
            // variant='primary'
            onClick={() => router.push(ROUTES.LOGIN)}
            className='bg-primary/50 hover:bg-primary/30 from-primary to-primary/50 hover:from-brand-400 7/50 transition-color h-12 bg-gradient-to-r duration-500 md:h-14'
          >
            무료로 시작하기
          </Button> */}
          <Button
            size='lg'
            onClick={() => router.push(ROUTES.LOGIN)}
            className='group from-brand-600 to-brand-300 relative bg-gradient-to-r hover:bg-transparent'
          >
            {/* <div
              aria-hidden='true'
              className='pointer-events-none absolute inset-0 rounded-[inherit] border-r border-b border-l border-solid border-[#f3f7fe]'
            /> */}
            <div className='text-white transition-all duration-200 group-hover:text-shadow-[0px_0px_10px_#2effa7]'>
              무료로 시작하기
            </div>
            <div className='pointer-events-none absolute inset-0 rounded-[inherit] shadow-[inset_0px_0px_5px_0px_var(--color-brand-lilac)] group-active:shadow-[inset_0px_0px_10px_1px_var(--color-brand-lilac)]' />
          </Button>
          <Button
            size='lg'
            variant='outline'
            onClick={openReplmateSupportEmail}
          >
            도입 문의하기
          </Button>
        </div>

        {/* Hero Demo UI */}
        <div className='relative mx-auto mt-16 w-full max-w-4xl'>
          <div className='bg-brand-yellow/10 absolute top-1/2 left-1/2 -z-10 h-[120%] w-[120%] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[100px]'></div>
          <div className='animate-float-slow'>
            <HeroReplyCard replyStartDelay={2800} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

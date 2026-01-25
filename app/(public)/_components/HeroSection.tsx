'use client';

import { useRouter } from 'next/navigation';

import React, { useEffect, useRef, useState } from 'react';

import {
  RobotIcon,
  SparkleIcon,
  UserSoundIcon,
} from '@phosphor-icons/react/dist/ssr';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { openReplmateSupportEmail } from '@/lib/utils';

const MOCK_REPLY_TEXT =
  '안녕하세요 고객님! 상품과 배송에 만족해 주셔서 감사합니다. 😊 포장에 대한 소중한 의견 감사드리며, 다음에는 더 꼼꼼하게 신경 써서 보내드리겠습니다! 믿고 구매해 주셔서 감사드려요.';

interface TypewriterTextProps {
  text: string;
  startDelay?: number;
  textRef: React.RefObject<HTMLSpanElement | null>;
}

const TypewriterText = React.memo(
  ({ text, startDelay = 0, textRef }: TypewriterTextProps) => {
    const [displayedText, setDisplayedText] = useState('');
    const [started, setStarted] = useState(false);

    useEffect(() => {
      const timer = setTimeout(() => {
        setStarted(true);
      }, startDelay);
      return () => clearTimeout(timer);
    }, [startDelay]);

    useEffect(() => {
      if (!started) return;

      let currentIndex = 0;
      const intervalId = setInterval(() => {
        if (currentIndex < text.length) {
          setDisplayedText(text.slice(0, currentIndex + 1));
          currentIndex++;
        } else {
          clearInterval(intervalId);
        }
      }, 35); // Typing speed

      return () => clearInterval(intervalId);
    }, [started, text]);

    return (
      <span
        ref={textRef}
        contentEditable
        suppressContentEditableWarning={true}
        spellCheck={false}
        className='focus-visible:caret-brand-1 block focus-visible:outline-none'
      >
        {displayedText}
        {displayedText.length < text.length && (
          <span className='bg-brand-1 ml-1 inline-block h-4 w-0.5 animate-pulse align-middle'></span>
        )}
      </span>
    );
  }
);

const HeroSection = ({ id }: { id: string }) => {
  const router = useRouter();
  const textRef = useRef<HTMLSpanElement>(null);

  const handleCopy = async () => {
    try {
      // Use text content from the ref if available (handles user edits), otherwise fallback to mock text
      const textToCopy = textRef.current?.innerText || MOCK_REPLY_TEXT;
      await navigator.clipboard.writeText(textToCopy);

      toast('클립 보드에 복사되었습니다.');
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <section
      id={id}
      className='from-warmgray-100 relative bg-gradient-to-b to-white to-50% pt-33 pb-20 md:pt-37 md:pb-32'
    >
      <div className='wrapper relative flex flex-col items-center text-center'>
        <Badge className='text-brand-1 animate-bounce-slow typo-caption-14 border-border mb-4 border bg-white/90 px-3.5 py-3 shadow-xs'>
          ✨ AI 기반 스마트 리뷰 관리
        </Badge>

        <h1 className='typo-display-36 lg:typo-display-48 mb-5 text-balance md:mb-8'>
          쇼핑몰 리뷰 관리,
          <br />
          이제{' '}
          <span className='relative mx-1 inline-block'>
            <span className='from-primary to-brand-5 relative z-10 bg-gradient-to-r bg-clip-text text-transparent'>
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
            onClick={() => router.push('/login')}
            className='bg-primary/50 hover:bg-primary/30 from-primary to-primary/50 hover:from-brand-17/50 transition-color h-12 bg-gradient-to-r duration-500 md:h-14'
          >
            무료로 시작하기
          </Button> */}
          <Button
            size='lg'
            onClick={() => router.push('/login')}
            className='group from-brand-0 to-brand-2 relative bg-gradient-to-r hover:bg-transparent'
          >
            <div
              aria-hidden='true'
              className='pointer-events-none absolute inset-0 border-r border-b border-l border-solid border-[#f3f7fe]'
            />
            <div className='text-white transition-all duration-200 group-hover:text-shadow-[0px_0px_50px_#2effa7]'>
              무료로 시작하기
            </div>
            <div className='pointer-events-none absolute inset-0 rounded-[inherit] shadow-[inset_0px_0px_5px_0px_var(--color-brand-14)] group-active:shadow-[inset_0px_0px_5px_1px_var(--color-brand-14)]' />
          </Button>
          <Button
            size='lg'
            variant='outline'
            onClick={openReplmateSupportEmail}
          >
            도입 문의하기
          </Button>
        </div>

        {/* Abstract UI Representation */}
        {/* FIXME: 실제 내부 UI와 맞추기 작업 */}
        <div className='relative mx-auto mt-20 w-full max-w-4xl'>
          <div className='bg-brand-yellow/10 absolute top-1/2 left-1/2 -z-10 h-[120%] w-[120%] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[100px]'></div>
          <div className='animate-float-slow'>
            <Card className='border-0 bg-white/80 shadow-2xl backdrop-blur-xl'>
              <CardContent className='flex flex-col gap-6'>
                {/* Mock Chat UI */}
                <div className='animate-scale-in flex items-start gap-4 opacity-0 delay-75'>
                  <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-100'>
                    <UserSoundIcon size={24} className='text-brand-1' />
                  </div>
                  <div className='w-full rounded-2xl rounded-tl-none bg-gray-50 p-4 text-left'>
                    <div className='mb-1 flex items-center gap-2'>
                      <span className='typo-button-14'>구매자</span>
                      <div className='text-brand-yellow'>★★★★☆</div>
                    </div>
                    <p className='text-muted-foreground'>
                      배송도 빠르고 상품도 마음에 들어요! 다만 포장이 조금 더
                      꼼꼼했으면 좋겠어요.
                    </p>
                  </div>
                </div>

                <div className='animate-scale-in flex flex-row-reverse items-start gap-4 opacity-0 delay-[2200ms]'>
                  <div className='bg-brand-14 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-white text-xl shadow-sm'>
                    <RobotIcon size={24} className='text-brand-1' />
                  </div>
                  <div className='group relative w-full overflow-hidden rounded-xl rounded-tr-none border border-blue-100 bg-blue-50/50 p-4 text-left'>
                    <div className='mb-2 flex items-center justify-between'>
                      <span className='text-brand-0 flex items-center gap-1'>
                        <SparkleIcon size={14} />
                        <span>AI 추천 답글</span>
                      </span>
                      <Badge className='text-brand-1 border-blue-100'>
                        수정 / 복사 지원
                      </Badge>
                    </div>
                    <div className='text-foreground mb-1 min-h-[60px]'>
                      <TypewriterText
                        textRef={textRef}
                        text={MOCK_REPLY_TEXT}
                        startDelay={2800}
                      />
                    </div>
                    <Button
                      size='sm'
                      className='text-foreground h-8 w-full rounded-[10px] border border-gray-200 bg-white hover:bg-gray-50'
                      onClick={handleCopy}
                    >
                      복사하기
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

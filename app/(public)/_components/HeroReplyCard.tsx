'use client';

import { memo, useEffect, useRef, useState } from 'react';

import { SparkleIcon } from '@phosphor-icons/react/dist/ssr';
import { Check, Copy, Smile, Star, User } from 'lucide-react';
import { toast } from 'sonner';

const MOCK_DATA = {
  productId: '20260101',
  reviewer: '구매자',
  reviewedAt: '2026.01.01 14:23',
  productName: '[리플메이트] 인공지능 스마트 TV',
  rating: 4,
  reviewContent:
    '배송도 빠르고 상품도 마음에 들어요! 다만 포장이 조금 더 꼼꼼했으면 좋겠어요.',
  aiReply:
    '안녕하세요 고객님! 상품과 배송에 만족해 주셔서 감사합니다. 포장에 대한 소중한 의견 감사드리며, 다음에는 더 꼼꼼히 신경 써서 보내드리겠습니다! 믿고 구매해 주셔서 감사드려요.',
};

interface TypewriterTextProps {
  text: string;
  startDelay?: number;
  textRef: React.RefObject<HTMLSpanElement | null>;
}

const TypewriterText = memo(
  ({ text, startDelay = 0, textRef }: TypewriterTextProps) => {
    const [displayedText, setDisplayedText] = useState('');
    const [started, setStarted] = useState(false);

    useEffect(() => {
      const timer = setTimeout(() => setStarted(true), startDelay);
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
      }, 35);
      return () => clearInterval(intervalId);
    }, [started, text]);

    return (
      <span
        ref={textRef}
        contentEditable
        suppressContentEditableWarning
        spellCheck={false}
        className='focus-visible:caret-brand-400 block focus-visible:outline-none'
      >
        {displayedText}
        {displayedText.length < text.length && (
          <span className='bg-brand-400 ml-1 inline-block h-4 w-0.5 animate-pulse align-middle' />
        )}
      </span>
    );
  }
);

TypewriterText.displayName = 'TypewriterText';

const HeroReplyCard = ({
  replyStartDelay = 2800,
}: {
  replyStartDelay?: number;
}) => {
  const textRef = useRef<HTMLSpanElement>(null);
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    try {
      const text = textRef.current?.innerText || MOCK_DATA.aiReply;
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      toast.success('리플이 클립보드에 복사되었습니다.', {
        style: {
          background: 'var(--color-accent-foreground)',
          color: 'var(--color-background)',
          border: '1px solid var(--color-foreground-description)',
        },
      });
      setTimeout(() => setIsCopied(false), 2000);
    } catch {
      // clipboard 접근 실패 시 무시
    }
  };

  return (
    <div className='rounded-[20px] border border-[#eef0f3] bg-white/90 p-6 text-left shadow-[0_20px_60px_-10px_rgba(98,158,255,0.13),0_4px_16px_-2px_rgba(0,0,0,0.06)] backdrop-blur-xl'>
      {/* 헤더: 아바타 + 메타 + 뱃지 */}
      <div className='flex justify-between'>
        <div className='flex items-start gap-3'>
          {/* 아바타 */}
          <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#c7d9ff] to-[#e0f0ff]'>
            <User size={24} className='text-brand-400' />
          </div>
          {/* 메타 정보 — 내부 ReplyCard 스타일 */}
          <div className='ml-2 w-full space-y-1 pr-1'>
            {/*  <div className='typo-body-14 text-muted-foreground flex flex-wrap items-center gap-x-4'>
              <div>
                상품번호: <span>{MOCK_DATA.productId}</span>
              </div>
              <div>
                등록자: <span>{MOCK_DATA.reviewer}</span>
              </div>
              <div>
                리뷰 등록일: <span>{MOCK_DATA.reviewedAt}</span>
              </div>
              <div className='text-foreground -ml-1.5 flex items-center gap-0.5'>
                <Star className='fill-foreground mb-px' size={16} />
                <span className='typo-button-16 font-medium'>
                  {MOCK_DATA.rating}
                </span>
              </div>
            </div> */}
            <p className='typo-body-14 flex items-center gap-2 font-medium'>
              {MOCK_DATA.productName}
            </p>

            {/* 리뷰 본문 */}
            <p className='typo-body-14 text-muted-foreground mt-1 mb-2.5 whitespace-pre-line'>
              {MOCK_DATA.reviewContent}
            </p>
          </div>
        </div>
        {/* 감정 뱃지 — 신규 디자인 */}
        <div className='bg-success/10 flex h-fit shrink-0 flex-col items-center justify-between gap-0.5 rounded-[16px] p-3.5 py-2.5'>
          {/* <Smile size={20} className='text-success' /> */}
          <span className='typo-caption-12 text-success font-semibold tracking-wide'>
            긍정(5.0)
          </span>
        </div>
      </div>

      {/* AI 전환 인디케이터 */}
      <div className='mt-1 mb-4 flex items-center gap-2.5'>
        <div className='h-px flex-1 bg-gradient-to-r from-transparent to-blue-100' />
        <div className='flex shrink-0 items-center gap-1.5 rounded-full border border-blue-100 bg-blue-50 px-3 py-1'>
          <SparkleIcon size={13} weight='fill' className='text-brand-400' />
          <span className='typo-caption-12 text-brand-400 font-semibold'>
            AI가 최적의 답글을 생성했어요
          </span>
        </div>
        <div className='h-px flex-1 bg-gradient-to-l from-transparent to-blue-100' />
      </div>

      {/* AI 답글 박스 */}
      <div className='rounded-[14px] bg-gradient-to-br from-blue-50 to-purple-50/60 p-4'>
        <div className='mb-3 flex items-center justify-between'>
          <span className='typo-caption-12 text-slate-400'>AI 생성 리플</span>
          <span className='typo-caption-12 text-slate-400'>방금 생성됨</span>
        </div>
        <div className='typo-body-14 mb-3 leading-relaxed text-slate-800'>
          <TypewriterText
            textRef={textRef}
            text={MOCK_DATA.aiReply}
            startDelay={replyStartDelay}
          />
        </div>
        <div className='flex justify-end'>
          <button
            onClick={handleCopy}
            className='text-brand-400 flex items-center gap-1.5 rounded-lg border border-blue-100 bg-white px-3.5 py-1.5 transition-colors hover:bg-blue-50'
          >
            {isCopied ? <Check size={14} /> : <Copy size={14} />}
            <span className='typo-caption-12 font-semibold'>
              {isCopied ? '복사됨' : '답글 복사하기'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default HeroReplyCard;

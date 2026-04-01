import { useEffect, useRef, useState } from 'react';

import { Check, ChevronDown, ChevronUp, Copy } from 'lucide-react';
import { toast } from 'sonner';

import { cn, formatDate } from '@/lib/utils';

const ReplyTextBox = ({
  text,
  createdAt,
}: {
  text: string;
  createdAt: Date;
}) => {
  const [expanded, setExpanded] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isOverflow, setIsOverflow] = useState(false);
  const textRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const el = textRef.current;
    if (!el) return;
    const lineHeight = parseFloat(getComputedStyle(el).lineHeight);
    setIsOverflow(el.scrollHeight > lineHeight * 3 + 1);
  }, [text]);

  const handleCopy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setIsCopied(true);
      toast.success('리플이 클립보드에 복사되었습니다.', {
        style: {
          background: 'var(--color-accent-foreground)',
          color: 'var(--color-background)',
          border: '1px solid var(--color-foreground-description)',
        },
      });

      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  return (
    <div className='grid grid-cols-[auto_80px_80px] gap-2 *:rounded-[12px]'>
      {/* 리플 컨텐츠 */}
      <div className='flex-1 bg-blue-100/50 p-4'>
        <div className='relative'>
          <p className='typo-eyebrow-14 text-foreground-description-muted select-none'>
            AI 생성 리플
          </p>

          <p
            ref={textRef}
            className={cn(
              'typo-body-14 mt-1.5 whitespace-pre-line transition-all duration-300 select-all',
              !expanded && 'line-clamp-3'
            )}
          >
            {text}
          </p>

          <p className='text-brand-400 typo-caption-12 absolute top-0 right-0 ml-2'>
            {formatDate(createdAt)} 작성됨
          </p>
        </div>
      </div>

      {/* 펼치기/접기 버튼 */}
      <button
        onClick={() => setExpanded((expanded) => !expanded)}
        className='group text-muted-foreground *:group-hover:text-foreground typo-caption-12 relative grid bg-gray-900/5 p-1.5 transition-all *:absolute *:mx-auto *:flex *:flex-col *:items-center *:justify-center *:place-self-center *:transition-all *:duration-200 active:scale-85'
        aria-label={expanded ? '축소' : '확장'}
      >
        <div
          className={
            !expanded ? 'scale-100 opacity-100' : 'scale-10 opacity-10'
          }
        >
          <ChevronDown size={24} />
          <span className='-mt-1'>펼치기</span>
        </div>
        <div
          className={cn(
            'text-foreground',
            !expanded ? 'scale-10 opacity-10' : 'scale-100 opacity-100'
          )}
        >
          <ChevronUp size={24} />
          <span className='-mt-1'>접기</span>
        </div>
      </button>

      {/* 카피 버튼 */}
      <button
        onClick={handleCopy}
        className='group relative grid bg-gray-900/5 p-1.5 transition-all *:absolute *:mx-auto *:place-self-center *:transition-all *:duration-200 active:scale-85'
        aria-label='리플 복사'
      >
        <Copy
          className={cn(
            `text-muted-foreground group-hover:text-primary`,
            !isCopied ? 'scale-100 opacity-100' : 'scale-10 opacity-10'
          )}
          size={24}
        />
        <Check
          className={cn(
            `text-brand-sun`,
            !isCopied ? 'scale-0 opacity-0' : 'scale-100 opacity-100'
          )}
          size={24}
        />
      </button>
    </div>
  );
};

export default ReplyTextBox;

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
    <div className='rounded-lg bg-blue-100/50 p-4'>
      <div className='relative'>
        {/* 리플 컨텐츠 */}
        <p className='text-foreground-description-muted font-medium select-none'>
          AI 생성 리플
        </p>
        <p
          ref={textRef}
          className={cn(
            'typo-body-14 mt-2 whitespace-pre-line transition-all duration-300',
            !expanded && 'line-clamp-3'
          )}
        >
          {text}
        </p>

        {/* 36x64px */}
        <button
          onClick={handleCopy}
          className='hover:text-foreground absolute top-0 right-0 rounded-[8px] p-1.5 transition-all hover:bg-gray-900/5 active:scale-85'
          aria-label='리플 복사'
        >
          <div className='relative size-6 *:transition-all *:duration-200'>
            <Copy
              className={cn(
                `text-muted-foreground`,
                !isCopied ? 'scale-100 opacity-100' : 'scale-10 opacity-10'
              )}
              size={24}
            />
            <Check
              className={cn(
                `text-brand-sun absolute top-0`,
                !isCopied ? 'scale-0 opacity-0' : 'scale-100 opacity-100'
              )}
              size={24}
            />
          </div>
        </button>

        {isOverflow && (
          <button
            onClick={() => setExpanded((expanded) => !expanded)}
            className='text-foreground-description hover:text-brand-700 mt-1 flex h-9 select-none'
            aria-label={expanded ? '축소' : '확장'}
          >
            <div className='flex items-center'>
              {!expanded ? (
                <>
                  <ChevronDown size={20} />
                  <span>더보기</span>
                </>
              ) : (
                <>
                  <ChevronUp size={20} />
                  <span>접기</span>
                </>
              )}
            </div>
          </button>
        )}

        <p className='typo-caption-12 text-foreground-description absolute right-0 bottom-0 mt-2'>
          리플 작성일: {formatDate(createdAt)}
        </p>
      </div>
    </div>
  );
};

export default ReplyTextBox;

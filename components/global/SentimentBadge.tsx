import { Frown, Meh, Smile } from 'lucide-react';

import { cn } from '@/lib/utils';

import { Badge } from '../ui/badge';

/**
 * 감정 분석 배지 컴포넌트
 * (0~2.4: 부정 / 2.5~3.4: 중립 / 3.5~5.0: 긍정)
 */
const SentimentBadge = ({
  size = 'default',
  score,
}: {
  size?: 'default' | 'sm';
  score: number | null;
}) => {
  if (score === null || score === undefined) return null;

  const Config = (() => {
    if (score < 2.5)
      return {
        label: '부정',
        color: { text: 'text-destructive', bg: 'bg-destructive' },
        icon: Frown,
      };
    if (score < 3.5)
      return {
        label: '중립',
        color: { text: 'text-brand-sun', bg: 'bg-brand-sun' },
        icon: Meh,
      };
    return {
      label: '긍정',
      color: { text: 'text-success', bg: 'bg-success' },
      icon: Smile,
    };
  })();

  if (size === 'sm') {
    return (
      <Badge
        size='md'
        variant='ghost'
        className={cn(
          'bg-input/30 pointer-events-none rounded-full p-1',
          Config.color.text
        )}
      >
        <div className='flex items-center gap-0.5'>
          <Config.icon
            size={18}
            className={cn('rounded-full text-white', Config.color.bg)}
          />
          ({score.toFixed(1)})
        </div>
      </Badge>
    );
  }

  if (size === 'default') {
    return (
      <div className='typo-button-14 mt-3 flex h-fit shrink-0 items-center gap-1 rounded-[12px]'>
        <Config.icon
          size={28}
          className={cn('rounded-full text-white', Config.color.bg)}
        />
        <span className={Config.color.text}>
          {Config.label}({score.toFixed(1)})
        </span>
      </div>
    );
  }
};

export default SentimentBadge;

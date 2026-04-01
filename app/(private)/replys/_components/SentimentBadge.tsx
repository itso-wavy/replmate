import { Frown, Meh, Smile } from 'lucide-react';

import { cn } from '@/lib/utils';

/**
 * 감정 분석 배지 컴포넌트
 * (0~2.4: 부정 / 2.5~3.4: 중립 / 3.5~5.0: 긍정)
 */
const SentimentBadge = ({ score }: { score: number | null }) => {
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

  //
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
};

export default SentimentBadge;

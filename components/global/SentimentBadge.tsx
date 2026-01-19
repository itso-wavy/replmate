import { SentimentType } from '@/types';

import { Badge } from '../ui/badge';

const SentimentBadge = ({ sentiment }: { sentiment: SentimentType }) => {
  const config = {
    positive: {
      label: '긍정',
      variant: 'default' as const,
      className: 'bg-cyan-50 text-cyan-700 border-cyan-300',
    },
    negative: {
      label: '부정',
      variant: 'destructive' as const,
      className: 'bg-orange-50 text-orange-700 border-orange-300',
    },
    neutral: {
      label: '중립',
      variant: 'outline' as const,
      className: 'bg-neutral-50 text-neutral-700 border-neutral-300',
    },
  };

  const { variant, className, label } = config[sentiment];

  return (
    <Badge variant={variant} className={className}>
      {label}
    </Badge>
  );
};

export default SentimentBadge;

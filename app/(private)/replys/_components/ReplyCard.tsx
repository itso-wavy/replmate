import { Star } from 'lucide-react';

import { formatDate } from '@/lib/utils';
import { ReplyDomain } from '@/types';

import ReplyTextBox from './ReplyTextBox';
import SentimentBadge from './SentimentBadge';

const getItemsMetadata = (reply: ReplyDomain) => [
  { label: '상품 번호', value: reply.product.externalId },
  { label: '등록자', value: reply.review.reviewer },
  {
    label: '리뷰 등록일',
    value: formatDate(reply.review.reviewedAt, 'yyyy.MM.dd HH:mm'),
  },
];

const ReplyCard = ({ reply }: { reply: ReplyDomain }) => {
  const itemsMetadata = getItemsMetadata(reply);

  return (
    <div className='hover:border-primary h-full rounded-lg border bg-gray-50 p-6 transition-all duration-[120ms] select-text hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.1)]'>
      <div className='flex justify-between'>
        <div className='ml-2 w-full pr-1'>
          <div className='typo-body-14 text-muted-foreground flex flex-wrap items-center gap-x-4'>
            {itemsMetadata.map(({ label, value }) => (
              <div key={label}>
                {label}: <span className='select-all'>{value}</span>
              </div>
            ))}

            {reply.review.rating && (
              <div className='text-foreground -ml-1.5 flex items-center gap-0.5'>
                <Star className='fill-foreground mb-px' size={16} />
                <span className='typo-button-16 font-medium'>
                  {reply.review.rating}
                </span>
              </div>
            )}
          </div>

          <p className='typo-heading-16 mt-2 flex items-center gap-2 select-all'>
            {reply.product.name}
          </p>
        </div>

        <SentimentBadge score={reply.sentimentScore} />
      </div>

      <div className='typo-body-14 mt-2.5 mb-3 px-2 whitespace-pre-line select-all'>
        {reply.review.content}
      </div>

      <ReplyTextBox
        text={reply.editedText ?? reply.aiText}
        createdAt={reply.createdAt}
      />
    </div>
  );
};

export default ReplyCard;

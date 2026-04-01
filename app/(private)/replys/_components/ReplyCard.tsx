import { useEffect, useRef, useState } from 'react';

import { Check, ChevronDown, ChevronUp, Copy, Star } from 'lucide-react';
import { toast } from 'sonner';

import { cn, formatDate } from '@/lib/utils';
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

  /* 
  
  
  
  
  
  
  const FeatureCard: React.FC<{
    icon: React.ReactNode;
    title: string;
    description: string;
  }> = ({ icon, title, description }) => (
    <Card className='hover:border-brand-mint bg-accent/20 h-full border border-transparent transition-transform duration-300 hover:-translate-y-2 hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.08)]'>
      <CardContent>
        <div className='bg-warmgray-200/20 mb-3 grid size-14 place-content-center rounded-2xl'>
          {icon}
        </div>
      </CardContent>
      <CardHeader>
        <CardTitle className='typo-heading-20 mb-1'>{title}</CardTitle>
        <CardDescription className='typo-body-14'>{description}</CardDescription>
      </CardHeader>
    </Card>
  );
  */
  return (
    <div className='hover:border-primary h-full rounded-lg border bg-gray-50 p-6 transition-transform duration-300 select-text hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.1)]'>
      <div className='flex justify-between'>
        <div className='ml-2'>
          <div className='typo-body-14 text-muted-foreground mb-1.5 flex flex-wrap items-center gap-x-4'>
            {itemsMetadata.map(({ label, value }) => (
              <div key={label}>
                {label}: {value}
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

          <p className='typo-heading-16 flex items-center gap-2'>
            {reply.product.name}
          </p>
        </div>

        <SentimentBadge score={reply.sentimentScore} />
      </div>

      <div className='typo-body-14 my-4 px-2 whitespace-pre-line'>
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

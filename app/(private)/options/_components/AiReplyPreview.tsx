'use client';

import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { Textarea } from '@/components/ui/textarea';

const TEST_REVIEW_MAX = 100;

interface AiReplyPreviewProps {
  testReview: string;
  onTestReviewChange: (value: string) => void;
  generatedReply: string;
  isGenerating: boolean;
  onGenerate: () => void;
  dailyUsed: number;
  dailyLimit: number;
}

const AiReplyPreview = ({
  testReview,
  onTestReviewChange,
  generatedReply,
  isGenerating,
  onGenerate,
  dailyUsed,
  dailyLimit,
}: AiReplyPreviewProps) => {
  const isLimitReached = dailyUsed >= dailyLimit;

  return (
    <div className='flex flex-col gap-5'>
      <div className='flex items-center justify-between'>
        <span className='text-muted-foreground typo-body-14'>
          일일 {dailyUsed} / {dailyLimit}회 사용
        </span>
      </div>

      <div className='flex flex-col gap-3'>
        <span className='typo-body-16 font-medium'>
          테스트 리뷰 (최대 {TEST_REVIEW_MAX}자)
        </span>
        <div className='relative'>
          <Textarea
            placeholder='예: 배송 너무 느려서 불편했어요.'
            value={testReview}
            onChange={(e) => {
              if (e.target.value.length <= TEST_REVIEW_MAX) {
                onTestReviewChange(e.target.value);
              }
            }}
            className='min-h-[100px] resize-none text-sm'
          />
          <span className='text-muted-foreground typo-caption-12 absolute right-3 bottom-2'>
            {testReview.length} / {TEST_REVIEW_MAX}
          </span>
        </div>
      </div>

      <Button
        onClick={onGenerate}
        disabled={!testReview.trim() || isGenerating || isLimitReached}
        className='w-full'
        size='default'
      >
        {isGenerating ? (
          <>
            <Spinner className='size-4' />
            생성 중...
          </>
        ) : (
          'AI 리플 생성하기'
        )}
      </Button>

      <div className='flex flex-col gap-3'>
        <span className='typo-body-16 font-semibold'>AI 생성 리플</span>
        <div className='border-primary/20 bg-primary/5 min-h-[140px] rounded-xl border-2 p-5'>
          {isGenerating ? (
            <div className='flex items-center justify-center py-8'>
              <Spinner className='size-6' />
            </div>
          ) : generatedReply ? (
            <p className='typo-body-16 leading-relaxed whitespace-pre-wrap'>
              {generatedReply}
            </p>
          ) : (
            <p className='text-muted-foreground typo-body-14'>
              생성된 리플이 여기에 표시됩니다.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AiReplyPreview;

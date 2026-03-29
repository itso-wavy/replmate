'use client';

import { Save } from 'lucide-react';

import TextAreaWithCount from '@/components/global/TextAreaWithCount';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';

import { DashboardContentsTitle } from '../../_components';

const TEST_REVIEW_MAX = 100;

interface AiReplyPreviewProps {
  optionData: {
    lastSaved: Date;
    previewUsed: number;
    previewLimit: number;
  };
  testReview: string;
  setTestReview: (value: string) => void;
  testReviewPlaceholder: string;
  generatedReply: string;
  isGenerating: boolean;
  onGenerate: () => void;
  handleSave: () => void;
}

const AiReplyPreview = ({
  optionData,
  testReview,
  setTestReview,
  testReviewPlaceholder,
  generatedReply,
  isGenerating,
  onGenerate,
  handleSave,
}: AiReplyPreviewProps) => {
  const isLimitReached = optionData.previewUsed >= optionData.previewLimit;

  return (
    <div>
      <DashboardContentsTitle level='tertiary'>
        리플 미리보기
      </DashboardContentsTitle>
      <div className='flex flex-col'>
        <div className='flex flex-col gap-3'>
          <div className='flex items-center space-x-2'>
            <DashboardContentsTitle level='quaternary'>
              테스트 리뷰
            </DashboardContentsTitle>

            <p className='typo-caption-14 text-foreground-description'>
              일일{' '}
              <span className='text-primary font-medium'>
                {optionData.previewUsed}
              </span>
              <span className='mx-0.5'>/</span>
              <span className='text-primary font-medium'>
                {optionData.previewLimit}
              </span>
              회 사용
            </p>
          </div>
          <TextAreaWithCount
            value={testReview}
            onChange={setTestReview}
            maxLength={TEST_REVIEW_MAX}
            placeholder={`예: ${testReviewPlaceholder}`}
            className='min-h-[120px]'
          />
          <div className='mt-2 flex justify-end'>
            <Button
              isPending={isGenerating}
              onClick={onGenerate}
              disabled={!testReview.trim() || isGenerating || isLimitReached}
            >
              AI 리플 생성하기
            </Button>
          </div>
        </div>

        <div className='mt-1 flex flex-col gap-3'>
          <DashboardContentsTitle level='quaternary'>
            AI 생성 리플
          </DashboardContentsTitle>

          <div className='border-primary/20 bg-primary/5 flex field-sizing-content min-h-[120px] resize-none rounded-xl border-2 p-5 px-4 py-3 transition-colors'>
            {isGenerating ? (
              <div className='flex w-full items-center justify-center py-8'>
                <Spinner className='size-5' />
              </div>
            ) : generatedReply ? (
              <p className='typo-body-14 whitespace-pre-wrap'>
                {generatedReply}
              </p>
            ) : (
              <p className='typo-body-14 text-blue-500'>
                생성된 리플이 여기에 표시됩니다.
              </p>
            )}
          </div>

          <div className='mt-2 flex items-center justify-end'>
            <Button onClick={handleSave}>
              <Save />
              옵션 저장
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AiReplyPreview;

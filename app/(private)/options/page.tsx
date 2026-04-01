'use client';

import { UnsavedProductChangesModal } from '@/components/modal';
import { Card } from '@/components/ui/card';
import { formatDate } from '@/lib/utils';

import { DashboardLayout, StoreCombobox } from '../_components';
import { AiReplyPreview, OptionSettings } from './_components';
import { useOptionsPage } from './_hooks/useOptionsPage';

const OptionsPage = () => {
  const {
    handleStoreChange,
    replyTone,
    setReplyTone,
    length,
    setLength,
    includeEmoji,
    setIncludeEmoji,
    brandGuideline,
    setBrandGuideline,
    testReview,
    setTestReview,
    testReviewPlaceholder,
    generatedReply,
    isGenerating,
    previewRemaining,
    handleGenerate,
    lastSaved,
    isSaving,
    handleSave,
    activeModal,
    setActiveModal,
    handleLeaveWithoutSaving,
    handleSaveAndLeave,
  } = useOptionsPage();

  return (
    <DashboardLayout
      heading='리플 옵션'
      description='설정한 옵션은 다음 리플 생성 시점부터 적용됩니다.'
    >
      <Card className='flex flex-1 flex-col gap-0 overflow-visible px-0 py-0 *:px-4'>
        {/* Controls Bar */}
        <div className='bg-background sticky top-0 z-10 flex w-full items-center justify-start rounded-t-2xl py-4 shadow-[0_3px_5px_0_rgba(0,0,0,0.05)]'>
          <StoreCombobox onStoreChange={handleStoreChange} />

          {lastSaved && (
            <p className='typo-caption-14 text-foreground-description ml-2.5'>
              <span>마지막 저장:</span>{' '}
              <span className='font-medium'>
                {formatDate(lastSaved, 'yyyy.MM.dd HH:mm')}
              </span>
            </p>
          )}
        </div>

        {/* 2컬럼: 좌(옵션 설정) / 우(AI 미리보기) */}
        <div className='grid grid-cols-1 py-4 *:my-2 *:px-4 *:py-2 *:first:border-b *:first:pb-8 lg:grid-cols-[2fr_3fr] lg:py-0 lg:*:my-6 lg:*:first:border-r lg:*:first:border-b-0 lg:*:first:pb-0'>
          <OptionSettings
            replyTone={replyTone}
            setReplyTone={setReplyTone}
            length={length}
            setLength={setLength}
            includeEmoji={includeEmoji}
            setIncludeEmoji={setIncludeEmoji}
            brandGuideline={brandGuideline}
            setBrandGuideline={setBrandGuideline}
          />

          <AiReplyPreview
            previewRemaining={previewRemaining}
            testReview={testReview}
            setTestReview={setTestReview}
            testReviewPlaceholder={testReviewPlaceholder}
            generatedReply={generatedReply}
            isGenerating={isGenerating}
            onGenerate={handleGenerate}
            isSaving={isSaving}
            handleSave={handleSave}
          />
        </div>
      </Card>

      <UnsavedProductChangesModal
        open={activeModal === 'unsavedChanges'}
        onOpenChange={(open) => !open && setActiveModal(null)}
        title='옵션 설정 저장'
        description={`저장하지 않은 변경 사항이 있습니다.\n저장하지 않고 이동하시겠습니까?`}
        onLeaveWithoutSaving={handleLeaveWithoutSaving}
        onSaveAndLeave={handleSaveAndLeave}
      />
    </DashboardLayout>
  );
};

export default OptionsPage;

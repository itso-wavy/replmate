'use client';

import { useState } from 'react';

import { Save } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { formatDate } from '@/lib/utils';
import { ReplyLength, ReplyTone } from '@/types';

import {
  DashboardContentsTitle,
  DashboardLayout,
  StoreCombobox,
} from '../_components';
import { AiReplyPreview, OptionSettings } from './_components';

const DEFAULT_OPTIONS = {
  replyTone: ReplyTone.AUTO,
  replyLength: ReplyLength.AUTO,
  includeEmoji: false,
  brandGuideline: '',
  testReviewPlaceholder: '배송 너무 느려서 불편했어요.',
};

const dummyOptionData = {
  lastSaved: new Date(`2026.03.24 14:30`),
  previewUsed: 0,
  previewLimit: 5,
  options: {
    replyTone: undefined,
    replyLength: undefined,
    includeEmoji: undefined,
    brandGuideline: '',
  },
};

const options = dummyOptionData.options;

const OptionsPage = () => {
  // 옵션 설정
  const [replyTone, setReplyTone] = useState<ReplyTone>(
    options?.replyTone || DEFAULT_OPTIONS.replyTone
  );
  const [length, setLength] = useState<ReplyLength>(
    options?.replyLength || DEFAULT_OPTIONS.replyLength
  );
  const [includeEmoji, setIncludeEmoji] = useState<boolean>(
    options?.includeEmoji ?? DEFAULT_OPTIONS.includeEmoji
  );
  const [brandGuideline, setBrandGuideline] = useState<string>(
    options?.brandGuideline || DEFAULT_OPTIONS.brandGuideline
  );

  // AI 미리보기 상태
  const [testReview, setTestReview] = useState('');
  const [generatedReply, setGeneratedReply] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    // TODO: 버튼 클릭 가능 여부 재체크하기

    setIsGenerating(true);
    setGeneratedReply('');
    // TODO: API 연동 (POST /replies/test)
    setTimeout(() => {
      setGeneratedReply(
        '안녕하세요! 배송이 늦어 불편을 드려 정말 죄송합니다. 빠르게 개선하도록 하겠습니다. 구매해주셔서 감사합니다, 다음에 또 이용해주세요 :)'
      );
      setIsGenerating(false);
    }, 2000);
  };

  const handleSave = () => {
    // TODO: API 연동 (PUT /stores/{storeId}/reply-options)
  };

  return (
    <DashboardLayout
      heading='리플 옵션'
      description='설정한 옵션은 다음 리플 생성 시점부터 적용됩니다.'
      alerts={alerts}
    >
      <Card className='flex flex-1 flex-col gap-0 overflow-visible px-0 py-0 *:px-4'>
        {/* Controls Bar */}
        <div className='bg-background sticky top-0 z-10 flex w-full items-center justify-start rounded-t-2xl py-4 shadow-[0_3px_5px_0_rgba(0,0,0,0.05)]'>
          <StoreCombobox
          // onStoreChange={handleStoreChange}
          />

          {dummyOptionData.lastSaved && (
            <p className='typo-caption-14 text-foreground-description ml-2.5'>
              <span>마지막 저장:</span>{' '}
              <span className='font-medium'>
                {formatDate(dummyOptionData.lastSaved, 'yyyy.MM.dd HH:mm')}
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
            optionData={dummyOptionData}
            testReview={testReview}
            setTestReview={setTestReview}
            testReviewPlaceholder={DEFAULT_OPTIONS.testReviewPlaceholder}
            generatedReply={generatedReply}
            isGenerating={isGenerating}
            onGenerate={handleGenerate}
            handleSave={handleSave}
          />
        </div>
      </Card>
    </DashboardLayout>
  );
};

export default OptionsPage;

/* TODO:
1. 테스트 리뷰 항목 미입력 상태로 'ai 리플 생성하기'시에 플레이스 홀더로 사용하던 값(배송 너무 느려서 불편했어요.)으로 리뷰 생성하기

2. 'ai 리플 생성하기' 버튼 활성화 조건
  * 일일 잔여 횟수 남아있음
  * 현재 ai 리플 생성 중이 아님
  * 일일 잔여 횟수 전부 소진 상태이면 토스트 띄우기 ('일일 테스트 횟수 N회를 모두 소진했습니다.')
  * 버튼 클릭 핸들러 내에서도 위 조건을 재차 확인해야 함
  * 버튼 클릭 후 리플 생성 성공시 잔여 리플 수 업데이트 
  * 리플 생성 실패시 토스트 노출('일시적인 오류로 생성에 실패했습니다. 잠시 후 다시 시도해 주세요.)
3. '저장하기' 버튼
  * 클릭 후 저장 완료시 토스트 노출('저장이 완료되었습니다.') 및 마지막 저장 일시 업데이트
  * 클릭 후 저장 실패 시 에러 토스트 노출('저장에 실패했습니다. 잠시 후 다시 시도해 주세요.)
  * 저장하지 않고 이탈 시도시 팝업 등장. 아래 코드 참고
    <UnsavedProductChangesModal
      open={activeModal === 'unsavedChanges'}
      onOpenChange={(open) => !open && setActiveModal(null)}
      title='옵션 설정 저장'
      description={`저장하지 않은 변경 사항이 있습니다.\n저장하지 않고 이동하시겠습니까?`}
      onLeaveWithoutSaving={handleLeaveWithoutSaving}
      onSaveAndLeave={handleSaveAndLeave}
    />
4. 연동된 쇼핑몰이 없을시 쇼핑몰 연동 필요 Alert이 뜸
*/

'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ReplyLength, ReplyTone } from '@/types/enums';

import { DashboardLayout, StoreCombobox } from '../_components';
import {
  AiReplyPreview,
  BrandGuidelineInput,
  OptionToggleGroup,
} from './_components';

const TONE_OPTIONS = [
  { label: '친근하게', value: ReplyTone.FRIENDLY },
  { label: '정중하게', value: ReplyTone.FORMAL },
  { label: '자동(맞춤)', value: ReplyTone.AUTO },
];

const LENGTH_OPTIONS = [
  { label: '짧게', value: ReplyLength.SHORT },
  { label: '길게', value: ReplyLength.LONG },
  { label: '자동(맞춤)', value: ReplyLength.AUTO },
];

const EMOJI_OPTIONS = [
  { label: '포함', value: true },
  { label: '미포함', value: false },
];

const OptionsPage = () => {
  // 옵션 상태 (추후 useOptionsPage 훅으로 이동)
  const [tone, setTone] = useState<ReplyTone>(ReplyTone.AUTO);
  const [length, setLength] = useState<ReplyLength>(ReplyLength.AUTO);
  const [includeEmoji, setIncludeEmoji] = useState(false);
  const [brandGuideline, setBrandGuideline] = useState('');

  // AI 미리보기 상태
  const [testReview, setTestReview] = useState('');
  const [generatedReply, setGeneratedReply] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
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
    >
      <Card className='flex flex-1 flex-col gap-0 overflow-visible px-0 py-0 *:px-4'>
        {/* Controls Bar */}
        <div className='bg-background sticky top-0 z-10 flex w-full items-center justify-between rounded-t-2xl py-4 shadow-[0_3px_5px_0_rgba(0,0,0,0.05)]'>
          <StoreCombobox
          // onStoreChange={handleStoreChange}
          />

          {/* TODO: */}
          <div className='flex items-center gap-3'>
            <span className='text-muted-foreground typo-caption-12'>
              {/* 마지막 저장: 2026.03.24 14:30 */}
            </span>
            <Button variant={'primary'} onClick={handleSave}>
              저장하기
            </Button>
          </div>
        </div>

        {/* 2컬럼: 좌(옵션 설정) / 우(AI 미리보기) */}
        <div className='grid h-[500px] grid-cols-[2fr_3fr] *:my-6'>
          <div className='border-r px-4 py-2'>
            <p className='typo-heading-18 mb-2 py-4'>옵션 설정</p>

            <div className='flex flex-col gap-4'>
              <OptionToggleGroup
                label='톤앤매너'
                tooltip={`생성될 리플의 말투를 결정합니다.\n * 친근하게: 부드러운 구어체 위주\n * 정중하게: 격식 있고 객관적인 사실 위주\n * 자동(맞춤): 리뷰 분위기에 맞춰 AI가 적절한 톤을 판단`}
                options={TONE_OPTIONS}
                defaultValue={ReplyTone.AUTO}
                value={tone}
                onChange={setTone}
              />
              <OptionToggleGroup
                label='리플 길이'
                tooltip={`생성될 리플의 분량을 결정합니다.\n * 짧게: 핵심만 간결하게 (1~2줄)\n * 길게: 풍성하고 자세하게 (3~5줄)\n * 자동(맞춤): 리뷰 내용에 맞춰 적절한 길이로 생성`}
                options={LENGTH_OPTIONS}
                defaultValue={ReplyLength.AUTO}
                value={length}
                onChange={setLength}
              />
              <OptionToggleGroup
                label='이모지 사용'
                tooltip={`포함 선택 시, 문맥에 어울리는 이모지를\n최대 2개까지 문장에 자동으로 추가합니다.`}
                options={EMOJI_OPTIONS}
                defaultValue={false}
                value={includeEmoji}
                onChange={setIncludeEmoji}
              />
              <BrandGuidelineInput
                label='브랜드 가이드라인'
                tooltip={`AI가 리플 생성 시 참고해야 할 사항을 적어주세요.\n * 예: "친절하게 응대해줘", "마지막엔 꼭 '감사합니다'를 붙여줘" 등`}
                value={brandGuideline}
                onChange={setBrandGuideline}
              />
            </div>
          </div>

          <div className='px-4 py-2'>
            <p className='typo-heading-18 mb-2 py-4'>AI 리플 미리보기</p>

            <AiReplyPreview
              testReview={testReview}
              onTestReviewChange={setTestReview}
              generatedReply={generatedReply}
              isGenerating={isGenerating}
              onGenerate={handleGenerate}
              dailyUsed={0}
              dailyLimit={5}
            />
          </div>
        </div>
      </Card>
    </DashboardLayout>
  );
};

export default OptionsPage;

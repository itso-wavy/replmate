import TextAreaWithCount from '@/components/global/TextAreaWithCount';
import {
  ReplyLength,
  ReplyTone,
  replyEmojiOptions,
  replyToneLabelMap,
} from '@/types';

import { RadioButtonGroup, SliderWithLabels } from '.';
import { DashboardContentsTitle, SubtitleWithTooltip } from '../../_components';

const BRAND_GUIDELINE_MAX = 500;

interface OptionSettingsProps {
  replyTone: ReplyTone;
  setReplyTone: (value: ReplyTone) => void;
  length: ReplyLength;
  setLength: (value: ReplyLength) => void;
  includeEmoji: boolean;
  setIncludeEmoji: (value: boolean) => void;
  brandGuideline: string;
  setBrandGuideline: (value: string) => void;
}

const OptionSettings = ({
  replyTone,
  setReplyTone,
  length,
  setLength,
  includeEmoji,
  setIncludeEmoji,
  brandGuideline,
  setBrandGuideline,
}: OptionSettingsProps) => {
  return (
    <div>
      <DashboardContentsTitle level='tertiary'>
        리플 스타일 옵션 설정
      </DashboardContentsTitle>

      <div className='flex flex-col gap-8'>
        <div className='flex flex-col'>
          <SubtitleWithTooltip
            title='톤앤매너'
            tooltip={`생성될 리플의 말투를 결정합니다.
                ㆍ친근하게: 부드러운 구어체 위주
                ㆍ정중하게: 격식 있고 객관적인 사실 위주
                ㆍ자동(맞춤): 리뷰 분위기에 맞춰 AI가 적절한 톤을 판단`}
          />
          <RadioButtonGroup
            options={Object.values(ReplyTone)}
            optionsMap={replyToneLabelMap}
            value={replyTone}
            onValueChange={setReplyTone}
          />
        </div>

        <div className='flex flex-col'>
          <SubtitleWithTooltip
            title='리플 길이'
            tooltip={`생성될 리플의 분량을 결정합니다.
                 ㆍ짧게: 핵심만 간결하게 (1~2줄)
                 ㆍ길게: 풍성하고 자세하게 (3~5줄)
                 ㆍ자동(맞춤): 리뷰 내용에 맞춰 적절한 길이로 생성`}
          />
          <SliderWithLabels value={length} onChange={setLength} />
        </div>

        <div className='flex flex-col'>
          <SubtitleWithTooltip
            title='이모지 사용'
            tooltip={`포함 선택 시, 문맥에 어울리는 이모지를\n최대 2개까지 문장에 자동으로 추가합니다.`}
          />
          <RadioButtonGroup
            options={replyEmojiOptions.map((o) => String(o.value))}
            optionsMap={Object.fromEntries(
              replyEmojiOptions.map((o) => [String(o.value), o.label])
            )}
            value={String(includeEmoji)}
            onValueChange={(v) => setIncludeEmoji(v === 'true')}
          />
        </div>

        <div className='flex flex-col gap-3'>
          <SubtitleWithTooltip
            title='브랜드 가이드라인'
            tooltip={`AI가 리플 생성 시 참고해야 할 사항을 적어주세요.
            ㆍ예: '친절하게 응대해줘', '마지막엔 꼭 "감사합니다"를 붙여줘' 등`}
          />
          <TextAreaWithCount
            value={brandGuideline}
            onChange={setBrandGuideline}
            maxLength={BRAND_GUIDELINE_MAX}
            placeholder='예: 응답 시, 우리 브랜드가 강조하는 포인트를 고려하면서 응답해줘. 그리고, 마지막엔 꼭 "구매해주셔서 감사합니다. 다음에 또 이용해주세요 :)"를 붙여줘.'
            className='min-h-[140px]'
          />
        </div>
      </div>
    </div>
  );
};

export default OptionSettings;

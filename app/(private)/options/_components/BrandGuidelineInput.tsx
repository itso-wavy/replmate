'use client';

import { AlertCircle } from 'lucide-react';

import { Textarea } from '@/components/ui/textarea';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const MAX_LENGTH = 500;

interface BrandGuidelineInputProps {
  value: string;
  label: string;
  tooltip: string;
  onChange: (value: string) => void;
}

const BrandGuidelineInput = ({
  label,
  tooltip,
  value,
  onChange,
}: BrandGuidelineInputProps) => {
  return (
    <div className='flex flex-col gap-3'>
      <div className='flex items-center gap-1.5'>
        <span className='typo-body-16 font-medium'>{label}</span>
        <Tooltip>
          <TooltipTrigger className='cursor-help'>
            <AlertCircle size={14} className='text-primary' />
          </TooltipTrigger>
          <TooltipContent
            side='bottom'
            className='bg-brand-800 *:bg-brand-800 max-w-[280px] px-4 whitespace-pre-line'
          >
            {tooltip}
          </TooltipContent>
        </Tooltip>
        <span className='text-muted-foreground typo-body-14 ml-auto'>
          (최대 {MAX_LENGTH}자)
        </span>
      </div>

      <div className='relative'>
        <Textarea
          placeholder='예: 응답 시, 우리 브랜드가 강조하는 포인트를 고려하면서 응답해줘. 그리고, 마지막엔 꼭 "구매해주셔서 감사합니다. 다음에 또 이용해주세요 :)"를 붙여줘.'
          value={value}
          onChange={(e) => {
            if (e.target.value.length <= MAX_LENGTH) {
              onChange(e.target.value);
            }
          }}
          className='min-h-[140px] resize-none text-sm'
        />
        <span className='text-muted-foreground typo-caption-12 absolute right-3 bottom-2'>
          {value.length} / {MAX_LENGTH}
        </span>
      </div>
    </div>
  );
};

export default BrandGuidelineInput;

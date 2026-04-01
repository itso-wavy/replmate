'use client';

import { CaretDownIcon } from '@phosphor-icons/react/dist/ssr';

import { Checkbox } from '@/components/ui/checkbox';
import { Spinner } from '@/components/ui/spinner';
import { cn } from '@/lib/utils';

interface TermsAccordionItemProps {
  label: string;
  content?: string | null;
  isExpanded: boolean;
  onToggleExpand: () => void;
  // 체크박스 모드 (온보딩)
  isChecked?: boolean;
  onToggleCheck?: () => void;
  // 필수/선택 배지
  required?: boolean;
  showRequiredBadge?: boolean;
  isLoadingContent?: boolean;
}

export const TermsAccordionItem = ({
  label,
  content,
  isExpanded,
  onToggleExpand,
  isChecked,
  onToggleCheck,
  required,
  showRequiredBadge,
  isLoadingContent,
}: TermsAccordionItemProps) => {
  const hasCheckbox = onToggleCheck !== undefined;

  return (
    <div>
      <div
        className='flex cursor-pointer items-center'
        onClick={onToggleExpand}
      >
        {hasCheckbox && (
          <div
            className='flex items-center gap-3 py-4 pr-4'
            onClick={(e) => {
              e.stopPropagation();
              onToggleCheck();
            }}
          >
            <Checkbox
              checked={isChecked}
              onCheckedChange={onToggleCheck}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        )}

        <div
          className={cn(
            'typo-body-15 flex flex-1 items-center gap-2',
            !hasCheckbox && 'py-4'
          )}
        >
          <span>{label}</span>
          {showRequiredBadge && required !== undefined && (
            <span
              className={cn(
                'typo-caption-12 rounded-full px-2 py-0.5',
                required
                  ? 'bg-brand-50 text-brand-500'
                  : 'text-muted-foreground bg-muted'
              )}
            >
              {required ? '필수' : '선택'}
            </span>
          )}
        </div>

        <button
          type='button'
          aria-label={isExpanded ? '약관 접기' : '약관 펼치기'}
          onClick={(e) => {
            e.stopPropagation();
            onToggleExpand();
          }}
          className='text-muted-foreground hover:text-foreground p-1 transition-colors'
        >
          <CaretDownIcon
            size={16}
            className={cn(
              'transition-transform duration-200',
              isExpanded && 'rotate-180'
            )}
          />
        </button>
      </div>

      {isExpanded && (
        <div className='bg-muted/50 typo-body-14 text-muted-foreground mb-4 max-h-[240px] overflow-y-auto rounded-lg px-4 py-3 leading-relaxed whitespace-pre-wrap'>
          {isLoadingContent ? <Spinner className='size-4' /> : content}
        </div>
      )}
    </div>
  );
};

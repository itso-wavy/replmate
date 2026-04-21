'use client';

import ReactMarkdown from 'react-markdown';

import { CaretDownIcon } from '@phosphor-icons/react/dist/ssr';
import remarkGfm from 'remark-gfm';

import { Checkbox } from '@/components/ui/checkbox';
import { Spinner } from '@/components/ui/spinner';
import { cn } from '@/lib/utils';

interface TermsAccordionItemProps {
  size?: 'default' | 'sm';
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

const TermsAccordionItem = ({
  size = 'default',
  label,
  content: markdownContent,
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
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        )}

        <div
          className={cn(
            'flex-1',
            size === 'sm' ? 'typo-body-14' : 'typo-body-16',
            !hasCheckbox && 'py-4'
          )}
        >
          <div
            className='flex w-fit items-center gap-2'
            onClick={
              hasCheckbox
                ? (e) => {
                    e.stopPropagation();
                    onToggleCheck?.();
                  }
                : undefined
            }
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
        <div className='typo-body-14 text-muted-foreground bg-muted/50 mb-4 max-h-[240px] overflow-x-hidden overflow-y-auto rounded-lg px-4 py-3'>
          {isLoadingContent ? (
            <Spinner className='size-4' />
          ) : (
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h1: ({ children }) => (
                  <h1 className='typo-body-16 text-foreground mt-4 mb-2 font-semibold first:mt-0'>
                    {children}
                  </h1>
                ),
                h2: ({ children }) => (
                  <h2 className='typo-body-14 text-foreground mt-3 mb-1.5 font-semibold first:mt-0'>
                    {children}
                  </h2>
                ),
                h3: ({ children }) => (
                  <h3 className='typo-body-14 text-foreground mt-2 mb-1 font-medium first:mt-0'>
                    {children}
                  </h3>
                ),
                p: ({ children }) => (
                  <p className='mb-2 last:mb-4'>{children}</p>
                ),
                ul: ({ children }) => (
                  <ul className='mb-2 list-disc space-y-0.5 pl-4'>
                    {children}
                  </ul>
                ),
                ol: ({ children }) => (
                  <ol className='mb-2 list-decimal space-y-0.5 pl-4'>
                    {children}
                  </ol>
                ),
                li: ({ children }) => <li>{children}</li>,
                a: ({ href, children }) => (
                  <a
                    href={href}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='text-brand-500 underline underline-offset-2 hover:opacity-80'
                  >
                    {children}
                  </a>
                ),
                table: ({ children }) => (
                  <div className='mb-2 overflow-x-auto'>
                    <table className='w-full border-collapse text-left'>
                      {children}
                    </table>
                  </div>
                ),
                thead: ({ children }) => (
                  <thead className='bg-muted'>{children}</thead>
                ),
                th: ({ children }) => (
                  <th className='border-border border px-3 py-1.5 font-medium'>
                    {children}
                  </th>
                ),
                td: ({ children }) => (
                  <td className='border-border border px-3 py-1.5'>
                    {children}
                  </td>
                ),
                blockquote: ({ children }) => (
                  <blockquote className='border-muted-foreground/30 text-muted-foreground mb-2 border-l-2 pl-3 italic'>
                    {children}
                  </blockquote>
                ),
                strong: ({ children }) => (
                  <strong className='text-foreground font-semibold'>
                    {children}
                  </strong>
                ),
                em: ({ children }) => <em className='italic'>{children}</em>,
              }}
            >
              {markdownContent}
            </ReactMarkdown>
          )}
        </div>
      )}
    </div>
  );
};

export default TermsAccordionItem;

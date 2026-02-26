'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

import {
  CaretDoubleLeftIcon,
  CaretDoubleRightIcon,
  CaretDownIcon,
  CaretLeftIcon,
  CaretRightIcon,
  CaretUpIcon,
  CheckIcon,
  CopyIcon,
} from '@phosphor-icons/react';

import { Button } from '@/components/ui/button';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
} from '@/components/ui/pagination';
import { getRepliesByStoreId } from '@/dummy/replies';
import { StoreStore } from '@/store/storeStore';
import type { ReplyDomain } from '@/types';

interface StoreReplysTableProps {
  maxRows?: number;
}

const ITEMS_PER_PAGE = 20;
const PAGE_WINDOW = 3;

const formatDateTime = (date: Date | null) => {
  if (!date) return '';
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  const hh = String(date.getHours()).padStart(2, '0');
  const min = String(date.getMinutes()).padStart(2, '0');
  return `${yyyy}.${mm}.${dd} ${hh}:${min}`;
};

const formatDate = (date: Date | null) => {
  if (!date) return '';
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}.${mm}.${dd}`;
};

/** 감정 점수(0.0~5.0) → 라벨 + 색상 클래스 */
const getSentimentBadge = (score: number) => {
  if (score <= 2.4)
    return {
      label: '부정',
      className: 'bg-destructive/10 text-destructive border-destructive/30',
    };
  if (score <= 3.4)
    return {
      label: '중립',
      className: 'bg-muted text-muted-foreground border-border',
    };
  return {
    label: '긍정',
    className: 'bg-emerald-50 text-emerald-600 border-emerald-200',
  };
};

/** 리플 텍스트 박스: 복사 + 3줄 초과 시 확장/축소 */
const ReplyTextBox = ({
  text,
  createdAt,
}: {
  text: string;
  createdAt: Date;
}) => {
  const [expanded, setExpanded] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isOverflow, setIsOverflow] = useState(false);
  const textRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const el = textRef.current;
    if (!el) return;
    const lineHeight = parseFloat(getComputedStyle(el).lineHeight);
    setIsOverflow(el.scrollHeight > lineHeight * 3 + 1);
  }, [text]);

  const handleCopy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  return (
    <div className='bg-muted/50 border-border rounded-lg border p-5'>
      {/* 리플 텍스트 + 복사 버튼 */}
      <div className='relative pr-8'>
        <p
          ref={textRef}
          className={`typo-body-14 text-foreground whitespace-pre-line ${
            !expanded ? 'line-clamp-3' : ''
          }`}
        >
          {text}
        </p>

        {/* 복사 버튼 (우측 상단) */}
        <button
          onClick={handleCopy}
          className='text-muted-foreground hover:text-foreground absolute top-0 right-0 p-0.5 transition-colors'
          aria-label='리플 복사'
        >
          {isCopied ? (
            <CheckIcon className='text-emerald-500' size={18} />
          ) : (
            <CopyIcon size={18} />
          )}
        </button>
      </div>

      {/* 확장/축소 버튼 (3줄 초과 시, 우측 정렬) */}
      {isOverflow && (
        <div className='mt-2 flex justify-end'>
          <button
            onClick={() => setExpanded((v) => !v)}
            className='text-muted-foreground hover:text-foreground p-0.5 transition-colors'
            aria-label={expanded ? '축소' : '확장'}
          >
            {expanded ? <CaretUpIcon size={18} /> : <CaretDownIcon size={18} />}
          </button>
        </div>
      )}

      {/* 리플 작성일 (하단 우측) */}
      <p className='typo-caption-12 text-muted-foreground mt-2 text-right'>
        리플 작성일: {formatDate(createdAt)}
      </p>
    </div>
  );
};

const ReplyCard = ({ reply }: { reply: ReplyDomain }) => {
  const sentimentBadge =
    reply.sentimentScore !== null
      ? getSentimentBadge(reply.sentimentScore)
      : null;

  return (
    <div className='border-border bg-background rounded-xl border p-5'>
      {/* 헤더: 상품번호 · 등록자 · 리뷰 등록일 + 감정 뱃지 */}
      <div className='mb-2 flex items-start justify-between gap-2'>
        <p className='typo-caption-12 text-muted-foreground'>
          {reply.product.externalId && (
            <>
              <span>상품 번호: {reply.product.externalId}</span>
              <span className='mx-2'>·</span>
            </>
          )}
          {reply.review.reviewer && (
            <>
              <span>등록자: {reply.review.reviewer}</span>
              <span className='mx-2'>·</span>
            </>
          )}
          {reply.review.reviewedAt && (
            <span>리뷰 등록일: {formatDateTime(reply.review.reviewedAt)}</span>
          )}
        </p>

        {/* 감정 분석 뱃지 */}
        {sentimentBadge && (
          <span
            className={`typo-button-14 shrink-0 rounded border px-3 py-1 ${sentimentBadge.className}`}
          >
            {sentimentBadge.label}({reply.sentimentScore?.toFixed(1)})
          </span>
        )}
      </div>

      {/* 상품명 + 별점 */}
      <div className='mb-3 flex items-center gap-2'>
        <span className='typo-heading-16'>{reply.product.name}</span>
        {reply.review.rating !== null && (
          <span className='typo-body-16 flex items-center gap-1'>
            <span className='text-yellow-400'>★</span>
            <span>{reply.review.rating}</span>
          </span>
        )}
      </div>

      {/* 리뷰 내용 */}
      <p className='typo-body-14 text-foreground mb-3 whitespace-pre-line'>
        {reply.review.content}
      </p>

      {/* 리플 박스 */}
      <ReplyTextBox
        text={reply.editedText ?? reply.aiText}
        createdAt={reply.createdAt}
      />
    </div>
  );
};

const StoreReplysTable = ({ maxRows: _ }: StoreReplysTableProps) => {
  const selectedStoreId = StoreStore.useSelectedStoreId();
  const [currentPage, setCurrentPage] = useState(1);

  const replies = useMemo(() => {
    return getRepliesByStoreId(selectedStoreId);
  }, [selectedStoreId]);

  const totalPages = Math.ceil(replies.length / ITEMS_PER_PAGE);

  const paginatedReplies = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return replies.slice(start, start + ITEMS_PER_PAGE);
  }, [replies, currentPage]);

  /** 1 ... 4 5 6 ... 20 형태로 페이지 아이템 목록 생성 */
  const pageItems = useMemo((): (
    | number
    | 'ellipsis-start'
    | 'ellipsis-end'
  )[] => {
    if (totalPages <= PAGE_WINDOW + 2) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    const half = Math.floor(PAGE_WINDOW / 2);
    const rangeStart = Math.max(2, currentPage - half);
    const rangeEnd = Math.min(totalPages - 1, currentPage + half);
    const items: (number | 'ellipsis-start' | 'ellipsis-end')[] = [1];
    if (rangeStart > 2) items.push('ellipsis-start');
    for (let i = rangeStart; i <= rangeEnd; i++) items.push(i);
    if (rangeEnd < totalPages - 1) items.push('ellipsis-end');
    items.push(totalPages);
    return items;
  }, [currentPage, totalPages]);

  if (!selectedStoreId) {
    return (
      <div className='text-muted-foreground flex h-[400px] items-center justify-center text-sm'>
        쇼핑몰을 선택해 주세요.
      </div>
    );
  }

  if (replies.length === 0) {
    return (
      <div className='text-muted-foreground flex h-[400px] items-center justify-center text-sm'>
        조회할 수 있는 리플이 없습니다.
      </div>
    );
  }

  return (
    <div className='flex flex-col gap-4 py-4'>
      <div className='flex flex-col gap-4'>
        {paginatedReplies.map((reply) => (
          <ReplyCard key={reply.id} reply={reply} />
        ))}
      </div>

      {/* 페이지네이션 */}
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <Button
              variant='ghost'
              size='icon'
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(1)}
              aria-label='처음 페이지'
            >
              <CaretDoubleLeftIcon />
            </Button>
          </PaginationItem>

          <PaginationItem>
            <Button
              variant='ghost'
              size='icon'
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              aria-label='이전 페이지'
            >
              <CaretLeftIcon />
            </Button>
          </PaginationItem>

          {pageItems.map((item) =>
            item === 'ellipsis-start' || item === 'ellipsis-end' ? (
              <PaginationItem key={item}>
                <PaginationEllipsis />
              </PaginationItem>
            ) : (
              <PaginationItem key={item}>
                <PaginationLink
                  isActive={item === currentPage}
                  onClick={() => setCurrentPage(item)}
                  className='cursor-pointer'
                >
                  {item}
                </PaginationLink>
              </PaginationItem>
            )
          )}

          <PaginationItem>
            <Button
              variant='ghost'
              size='icon'
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              aria-label='다음 페이지'
            >
              <CaretRightIcon />
            </Button>
          </PaginationItem>

          <PaginationItem>
            <Button
              variant='ghost'
              size='icon'
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(totalPages)}
              aria-label='마지막 페이지'
            >
              <CaretDoubleRightIcon />
            </Button>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default StoreReplysTable;

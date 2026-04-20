import ReactMarkdown from 'react-markdown';

import remarkGfm from 'remark-gfm';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { useTermsByType } from '@/hooks/useTerms';
import { TermsType } from '@/types';

import { CommonModalProps } from './types';

type ModalProps = CommonModalProps & {
  id: TermsType;
};

const Modal = ({ id, open, onOpenChange }: ModalProps) => {
  const { data, isLoading } = useTermsByType(id);
  const markdownContent = data?.contentDetail;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='typo-body-14 text-foreground flex max-h-[80vh] flex-col'>
        <DialogHeader>
          <DialogClose />
          {/* <DialogTitle>
            {isLoading ? <Skeleton className='h-5 w-32' /> : data?.title}
          </DialogTitle> */}
        </DialogHeader>
        <div className='flex-1 overflow-y-auto'>
          {isLoading ? (
            <div className='space-y-2'>
              <Skeleton className='h-4 w-full' />
              <Skeleton className='h-4 w-full' />
              <Skeleton className='h-4 w-3/4' />
            </div>
          ) : (
            // data?.content
            // <div
            //   dangerouslySetInnerHTML={{ __html: data?.contentDetail ?? '' }}
            // />
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
                  <p className='mb-2 last:mb-0'>{children}</p>
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
      </DialogContent>
    </Dialog>
  );
};

export default Modal;

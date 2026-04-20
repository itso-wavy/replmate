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
            <div
              dangerouslySetInnerHTML={{ __html: data?.contentHtml ?? '' }}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Modal;

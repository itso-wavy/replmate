import { toast } from 'sonner';

import { useDeleteStore } from '@/hooks/useStores';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../ui/alert-dialog';
import { CommonModalProps } from './types';

interface UnlinkStoreConfirmModalProps extends CommonModalProps {
  storeId: number;
}

// 연동 해제 확인 alert 모달
const Modal = ({
  open,
  onOpenChange,
  storeId,
}: UnlinkStoreConfirmModalProps) => {
  const { mutateAsync: deleteStore, isPending } = useDeleteStore();

  const handleAction = async () => {
    try {
      await deleteStore(storeId);
      toast.success('쇼핑몰 연동이 해제되었습니다.');
      onOpenChange(false);
    } catch {
      toast.error('연동 해제에 실패했습니다. 잠시 후 다시 시도해 주세요.');
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className='sm:max-w-[425px]'>
        <AlertDialogHeader>
          <AlertDialogTitle>쇼핑몰 연동 해제</AlertDialogTitle>
          <AlertDialogDescription className='mx-auto text-center'>
            쇼핑몰 연동을 해제하시겠습니까?
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className='*:flex-1'>
          <AlertDialogCancel>취소</AlertDialogCancel>
          <AlertDialogAction onClick={handleAction} disabled={isPending}>
            해제
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default Modal;

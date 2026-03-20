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

interface ModalProps extends CommonModalProps {
  onConfirm: () => void | Promise<void>;
  isPending?: boolean;
}

// 상품 선택 저장 확인 모달
const Modal = ({ open, onOpenChange, onConfirm, isPending }: ModalProps) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className='sm:max-w-[425px]'>
        <AlertDialogHeader>
          <AlertDialogTitle>상품 선택 저장</AlertDialogTitle>
          <AlertDialogDescription className='mx-auto text-center'>
            저장된 상품은 자정에 리뷰가 수집되며, 이후 리플이 자동 생성됩니다.
            선택한 상품을 저장하시겠습니까?
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className='*:flex-1'>
          <AlertDialogCancel disabled={isPending}>취소</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} disabled={isPending}>
            저장하기
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default Modal;

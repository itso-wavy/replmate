import { useRouter } from 'next/navigation';

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

// 쇼핑몰 수 한도 초과 모달
const Modal = ({ open, onOpenChange }: CommonModalProps) => {
  const handleAction = () => {};

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className='sm:max-w-[425px]'>
        <AlertDialogHeader>
          <AlertDialogTitle>상품 선택 저장</AlertDialogTitle>
          <AlertDialogDescription className='mx-auto text-center'>
            저장하지 않은 변경 사항이 있습니다. 저장하지 않고 이동하시겠습니까?
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className='*:flex-1'>
          <AlertDialogCancel>취소</AlertDialogCancel>
          <AlertDialogAction onClick={handleAction}>확인</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default Modal;

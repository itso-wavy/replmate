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

// 연동 해제 확인 alert 모달
const Modal = ({ open, onOpenChange }: CommonModalProps) => {
  const handleAction = () => {
    // TODO: API 연동하기
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className='sm:max-w-[425px]'>
        <AlertDialogHeader>
          <AlertDialogTitle className='typo-heading-16 w-full text-center'>
            쇼핑몰 연동 해제
          </AlertDialogTitle>
          <AlertDialogDescription className='mx-auto text-center'>
            쇼핑몰 연동을 해제하시겠습니까?
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className='*:flex-1'>
          <AlertDialogCancel>취소</AlertDialogCancel>
          <AlertDialogAction onClick={handleAction}>해제</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default Modal;

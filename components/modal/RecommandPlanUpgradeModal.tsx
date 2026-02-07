'use client';

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

interface ModalProps extends CommonModalProps {
  title: string;
  description: string;
}

// 쇼핑몰 수 한도 초과 모달
const Modal = ({ title, description, open, onOpenChange }: ModalProps) => {
  const router = useRouter();

  const handleAction = () => {
    router.push('/subscribe');
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className='sm:max-w-[425px]'>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription className='mx-auto text-center'>
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className='*:flex-1'>
          <AlertDialogCancel>다음에 하기</AlertDialogCancel>
          <AlertDialogAction onClick={handleAction}>
            플랜 업그레이드
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default Modal;

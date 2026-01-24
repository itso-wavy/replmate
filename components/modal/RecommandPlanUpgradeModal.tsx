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

// 쇼핑몰 수 한도 초과 모달
const Modal = ({ open, onOpenChange }: CommonModalProps) => {
  const router = useRouter();

  const handleAction = () => {
    router.push('/subscribe');
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className='sm:max-w-[425px]'>
        <AlertDialogHeader>
          <AlertDialogTitle>쇼핑몰 등록</AlertDialogTitle>
          <AlertDialogDescription className='mx-auto text-center'>{`등록 가능한 쇼핑몰 한도를 초과했습니다.\n더 많은 쇼핑몰을 연동하려면 플랜을 업그레이드 해주세요.`}</AlertDialogDescription>
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

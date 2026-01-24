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

// 본인 인증 유도 모달
const Modal = ({ open, onOpenChange }: CommonModalProps) => {
  const router = useRouter();

  const handleAction = () => {
    router.push('/account');
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className='sm:max-w-[425px]'>
        <AlertDialogHeader>
          <AlertDialogTitle>쇼핑몰 등록</AlertDialogTitle>
          <AlertDialogDescription className='mx-auto text-center'>{`쇼핑몰 등록을 위해 본인 인증이 필요합니다.\n안전한 이용을 위해 인증을 진행해 주세요.`}</AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className='*:flex-1'>
          <AlertDialogCancel>다음에 하기</AlertDialogCancel>
          <AlertDialogAction onClick={handleAction}>
            본인 인증 바로가기
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default Modal;

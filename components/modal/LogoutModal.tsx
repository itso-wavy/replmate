import { useRouter } from 'next/navigation';

import { signOut } from 'next-auth/react';

import api from '@/lib/api';
import { ENDPOINTS } from '@/lib/endpoints';
import { AuthStore } from '@/store/authStore';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
} from '../ui/alert-dialog';
import { CommonModalProps } from './types';

const Modal = ({ open, onOpenChange }: CommonModalProps) => {
  const router = useRouter();
  const { clearAuth } = AuthStore.useActions();

  const handleLogout = async () => {
    try {
      await api.post(ENDPOINTS.SESSION.LOGOUT);
    } catch (_) {}

    clearAuth();

    await signOut({ callbackUrl: '/', redirect: false });
    router.push('/');
  };
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className='sm:max-w-[425px]'>
        <AlertDialogHeader>
          <p className='typo-heading-16 w-full text-center'>
            로그아웃 하시겠습니까?
          </p>
        </AlertDialogHeader>

        <AlertDialogFooter className='*:flex-1'>
          <AlertDialogCancel>취소</AlertDialogCancel>
          <AlertDialogAction onClick={handleLogout}>확인</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default Modal;

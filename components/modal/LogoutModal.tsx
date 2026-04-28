import { useRouter } from 'next/navigation';

import { useQueryClient } from '@tanstack/react-query';

import { signOut } from 'next-auth/react';

import { ROUTES } from '@/constants/nav-menu';
import api from '@/lib/api';
import { ENDPOINTS } from '@/lib/endpoints';
import { StoreStore } from '@/store/storeStore';
import { UserStore } from '@/store/userStore';

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
  const queryClient = useQueryClient();
  const { clearUser } = UserStore.useActions();
  const { reset: resetStoreStore } = StoreStore.useActions();

  const handleLogout = async () => {
    try {
      await api.post(ENDPOINTS.SESSION.LOGOUT);
    } catch (_) {}

    // 사용자 종속 클라이언트 상태 일괄 정리
    clearUser();
    resetStoreStore();
    queryClient.clear();
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('store-store');
    }

    await signOut({ callbackUrl: ROUTES.ROOT, redirect: false });
    router.push(ROUTES.ROOT);
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

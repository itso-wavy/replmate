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

// 영수증 요청 모달
const Modal = ({ open, onOpenChange, onConfirm, isPending }: ModalProps) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className='sm:max-w-[425px]'>
        <AlertDialogHeader>
          <AlertDialogTitle>영수증 요청</AlertDialogTitle>
          <AlertDialogDescription className='mx-auto text-center'>
            {`영수증은 등록된 이메일 주소로 발송됩니다.\n요청을 진행하시겠습니까?`}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className='*:flex-1'>
          <AlertDialogCancel disabled={isPending}>취소</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} disabled={isPending}>
            요청
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default Modal;

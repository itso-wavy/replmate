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
  description?: string;
  onLeaveWithoutSaving: () => void;
  onSaveAndLeave: () => void | Promise<void>;
  isPending?: boolean;
}

// 미저장 변경사항 이탈 확인 모달
const Modal = ({
  open,
  onOpenChange,
  title,
  description,
  onLeaveWithoutSaving,
  onSaveAndLeave,
  isPending,
}: ModalProps) => {
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
          <AlertDialogCancel
            disabled={isPending}
            onClick={onLeaveWithoutSaving}
          >
            저장 안 함
          </AlertDialogCancel>
          <AlertDialogAction disabled={isPending} onClick={onSaveAndLeave}>
            저장 후 이동
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default Modal;

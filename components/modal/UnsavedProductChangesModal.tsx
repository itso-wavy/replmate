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
  onLeaveWithoutSaving: () => void;
  onSaveAndLeave: () => void | Promise<void>;
  isPending?: boolean;
}

// 미저장 변경사항 이탈 확인 모달
const Modal = ({
  open,
  onOpenChange,
  onLeaveWithoutSaving,
  onSaveAndLeave,
  isPending,
}: ModalProps) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className='sm:max-w-[425px]'>
        <AlertDialogHeader>
          <AlertDialogTitle>저장하지 않은 변경 사항</AlertDialogTitle>
          <AlertDialogDescription className='mx-auto text-center'>
            저장하지 않은 변경 사항이 있습니다.
            {'\n'}저장하지 않고 이동하시겠습니까?
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className='*:flex-1'>
          <AlertDialogCancel disabled={isPending} onClick={onLeaveWithoutSaving}>
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

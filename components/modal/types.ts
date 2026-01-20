import { Dispatch, SetStateAction } from 'react';

export interface CommonModalProps {
  open: boolean;
  onOpenChange: Dispatch<SetStateAction<boolean>>;
}

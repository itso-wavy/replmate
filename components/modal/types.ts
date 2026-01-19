import { Dispatch, SetStateAction } from 'react';

export interface DialogProps {
  open: boolean;
  onOpenChange: Dispatch<SetStateAction<boolean>>;
}

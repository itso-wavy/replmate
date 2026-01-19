import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { TermsType } from '@/types';

import { DialogProps } from './types';

type TermDialogProps = DialogProps & {
  id: TermsType;
};

const TermDialog = ({ id, open, onOpenChange }: TermDialogProps) => {
  // TODO: id를 이용해 백엔드에서 약관 내용 불러오기
  const dummyTerms = {
    terms: {
      title: `이용 약관`,
      content: '이용 약관이용 약관이용 약관이용 약관이용 약관',
    },
    privacy: {
      title: `개인정보 처리방침`,
      content:
        '개인정보 처리방침개인정보 처리방침개인정보 처리방침개인정보 처리방침개인정보 처리방침',
    },
    marketing: {
      title: `광고성 수신 동의`,
      content:
        '광고성 수신 동의광고성 수신 동의광고성 수신 동의광고성 수신 동의광고성 수신 동의',
    },
  };
  const term = dummyTerms[id];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{term.title}</DialogTitle>
        </DialogHeader>
        <div>{term.content}</div>
      </DialogContent>
    </Dialog>
  );
};

export default TermDialog;

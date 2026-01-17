import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface TermDialogProps {
  id: 'terms' | 'privacy' | 'marketing';
  trigger: React.ReactNode;
}
const TermDialog = ({ id, trigger }: TermDialogProps) => {
  // TODO: id를 이용해 백엔드에서 약관 내용 불러오기
  const dummyTerms = {
    title: `이용 약관`,
    content: '약관....',
  };

  return (
    <Dialog>
      <DialogTrigger>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{dummyTerms.title}</DialogTitle>
        </DialogHeader>
        <div>{dummyTerms.content}</div>
      </DialogContent>
    </Dialog>
  );
};

export default TermDialog;

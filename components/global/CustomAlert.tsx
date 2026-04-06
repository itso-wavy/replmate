'use client';

import { useRouter } from 'next/navigation';

import {
  BadgeCheck,
  CircleX,
  Info,
  MoveRight,
  TriangleAlert,
} from 'lucide-react';

import { ReminderEvent, ReminderLevel } from '@/types';

import { Alert, AlertAction, AlertDescription, AlertTitle } from '../ui/alert';
import { Button } from '../ui/button';

export interface CustomAlertProps {
  id: string;
  variant: ReminderLevel;
  type: ReminderEvent;
  title: string;
  description?: string;
  href?: string;
  // action?: {
  //   label: string;
  //   onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  // };
}

type AlertVariants =
  | 'success'
  | 'info'
  | 'warning'
  | 'error'
  | null
  | undefined;

/** variant별 스타일링은 Alert 컴포넌트단에서 확인 */
const CustomAlert = ({
  variant,
  title,
  description,
  href,
  // action,
  className,
  ...props
}: CustomAlertProps & { className?: string }) => {
  const router = useRouter();
  const action = href && {
    label: '이동',
    onClick: () => router.push(href),
  };

  return (
    <Alert
      variant={variant.toLowerCase() as AlertVariants}
      className={className}
      {...props}
    >
      {variant === ReminderLevel.SUCCESS && <BadgeCheck />}
      {variant === ReminderLevel.INFO && <Info />}
      {variant === ReminderLevel.WARNING && <TriangleAlert />}
      {variant === ReminderLevel.ERROR && <CircleX />}

      <AlertTitle>{title}</AlertTitle>
      {description && (
        <AlertDescription className='whitespace-pre-line'>
          {description}
        </AlertDescription>
      )}
      {action && (
        <AlertAction className={!description ? 'top-1.5' : ''}>
          <Button size='sm' onClick={action.onClick}>
            {action.label}
            <MoveRight />
          </Button>
        </AlertAction>
      )}
    </Alert>
  );
};

export default CustomAlert;

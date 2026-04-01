'use client';

import { useRouter } from 'next/navigation';

import {
  BadgeCheck,
  CircleX,
  Info,
  MoveRight,
  TriangleAlert,
} from 'lucide-react';

import { AlertType, AlertVariant } from '@/types';

import { Alert, AlertAction, AlertDescription, AlertTitle } from '../ui/alert';
import { Button } from '../ui/button';

export interface CustomAlertProps {
  id: string;
  variant: AlertVariant;
  type: AlertType;
  title: string;
  description?: string;
  href?: string;
  // action?: {
  //   label: string;
  //   onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  // };
}

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
    <Alert variant={variant} className={className} {...props}>
      {variant === 'success' && <BadgeCheck />}
      {variant === 'info' && <Info />}
      {variant === 'warning' && <TriangleAlert />}
      {variant === 'error' && <CircleX />}

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

'use client';

import { PropsWithChildren } from 'react';

import { AlertCircle } from 'lucide-react';

import { CustomAlert } from '@/components/global';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useAlerts } from '@/hooks';
import { cn } from '@/lib/utils';
interface DashboardLayoutProps {
  heading?: string;
  description?: string | React.ReactNode;
  className?: string;
}

export const DashboardLayout = ({
  heading,
  description,
  className,
  children,
}: PropsWithChildren<DashboardLayoutProps>) => {
  const alerts = useAlerts();

  return (
    <div className={cn('text-foreground relative mx-auto py-5', className)}>
      <div className='border-border w-full space-y-2 border-b px-7 py-5'>
        {heading && <h1 className='typo-display-36'>{heading}</h1>}
        {description && (
          <p className='typo-body-16 text-gray-600'>{description}</p>
        )}
      </div>

      <div className='flex flex-col gap-4 px-4 py-4'>
        {alerts?.length > 0 && (
          <div className='flex flex-col space-y-1'>
            {alerts.map((alert) => {
              const { createdAt, ...rest } = alert;

              return <CustomAlert key={alert.id} {...rest} />;
            })}
          </div>
        )}
        {children}
      </div>
    </div>
  );
};

export const SubtitleWithTooltip = ({
  title,
  tooltip,
}: {
  title: string;
  tooltip?: string;
}) => {
  return (
    <div className='flex items-center gap-1.5'>
      <p className='typo-body-16 font-medium'>{title}</p>
      {tooltip && (
        <Tooltip>
          <TooltipTrigger>
            <AlertCircle size={14} className='text-primary' />
          </TooltipTrigger>
          <TooltipContent>{tooltip}</TooltipContent>
        </Tooltip>
      )}
    </div>
  );
};

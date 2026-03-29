import { PropsWithChildren } from 'react';

import { AlertCircle } from 'lucide-react';

import CustomAlert from '@/components/global/CustomAlert';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { Alert } from '@/types';

interface DashboardLayoutProps {
  heading?: string;
  description?: string | React.ReactNode;
  alerts?: Alert[];
  className?: string;
}

export const DashboardLayout = ({
  heading,
  description,
  alerts,
  className,
  children,
}: PropsWithChildren<DashboardLayoutProps>) => {
  return (
    <div className={cn('text-foreground relative mx-auto py-5', className)}>
      <div className='border-border w-full space-y-2 border-b px-7 py-5'>
        {heading && (
          <h1>
            <DashboardContentsTitle level='primary'>
              {heading}
            </DashboardContentsTitle>
          </h1>
        )}
        {description && (
          <p className='typo-body-16 text-gray-600'>{description}</p>
        )}
      </div>

      <div className='flex flex-col gap-4 px-4 py-4'>
        {alerts && (
          <div className='flex flex-col gap-1'>
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

interface DashboardInnerPageLayoutProps {
  heading: string;
}

export const DashboardInnerPageLayout = ({
  heading,
  children,
}: PropsWithChildren<DashboardInnerPageLayoutProps>) => {
  return (
    <div className='bg-brand-50 p-1'>
      <DashboardContentsTitle level='secondary'>
        {heading}
      </DashboardContentsTitle>

      <div>{children}</div>
    </div>
  );
};

interface DashboardContentsTitleProps {
  level: 'primary' | 'secondary' | 'tertiary' | 'quaternary';
  className?: string;
}

export const DashboardContentsTitle = ({
  level,
  children,
  className,
}: PropsWithChildren<DashboardContentsTitleProps>) => {
  if (level === 'primary')
    return <div className={cn('typo-display-36', className)}>{children}</div>;

  if (level === 'secondary')
    return (
      <div className={cn('typo-heading-24 mb-4', className)}>{children}</div>
    );

  if (level === 'tertiary')
    return (
      <div className={cn('typo-heading-18 mb-4', className)}>{children}</div>
    );

  return (
    <div className={cn('typo-body-16 font-medium', className)}>{children}</div>
  );
};

export const SubtitleWithTooltip = ({
  title,
  tooltip,
}: {
  title: string;
  tooltip: string;
}) => {
  return (
    <div className='flex items-center gap-1.5'>
      <DashboardContentsTitle level='quaternary'>
        {title}
      </DashboardContentsTitle>
      <Tooltip>
        <TooltipTrigger>
          <AlertCircle size={14} className='text-primary' />
        </TooltipTrigger>
        <TooltipContent>{tooltip}</TooltipContent>
      </Tooltip>
    </div>
  );
};

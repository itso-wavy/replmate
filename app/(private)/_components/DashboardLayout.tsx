import { PropsWithChildren } from 'react';

import CustomAlert from '@/components/global/CustomAlert';
import { Alert } from '@/types';

interface DashboardLayoutProps {
  heading?: string;
  description?: string | React.ReactNode;
  alerts?: Alert[];
}

const DashboardLayout = ({
  heading,
  description,
  alerts,
  children,
}: PropsWithChildren<DashboardLayoutProps>) => {
  return (
    <div className='text-foreground relative mx-auto py-5'>
      <div className='border-border w-full space-y-2 border-b px-7 py-5'>
        {heading && <h1 className='typo-display-36'>{heading}</h1>}
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

export default DashboardLayout;

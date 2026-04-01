import { PropsWithChildren } from 'react';

import { cn } from '@/lib/utils';

interface SettingsLayoutProps {
  heading: string;
  description?: string;
}

export const InnerPageLayout = ({
  heading,
  children,
}: PropsWithChildren<SettingsLayoutProps>) => {
  return (
    <div className='my-4 p-1'>
      <h2 className='typo-heading-24 mb-6'>{heading}</h2>

      {children}
    </div>
  );
};

export const InnerPageSection = ({
  heading,
  description,
  children,
}: PropsWithChildren<SettingsLayoutProps>) => {
  return (
    <section className='mb-8 border-b-[1px] pb-8 last:!border-b-0'>
      <div className='mb-6'>
        <h3 className='typo-heading-18 mb-2'>{heading}</h3>
        {description && (
          <p className='typo-body-14 text-muted-foreground'>{description}</p>
        )}
      </div>

      <div className='space-y-4'>{children}</div>
    </section>
  );
};

export const InnerPageRow = ({
  label,
  className,
  children,
}: PropsWithChildren<{
  label: string;
  className?: string;
}>) => (
  <div className={cn('typo-body-14 flex gap-1.5', className)}>
    <div className='min-w-[80px] shrink-0'>{label}</div>
    {children}
  </div>
);

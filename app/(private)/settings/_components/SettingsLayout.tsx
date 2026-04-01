import { PropsWithChildren } from 'react';

interface SettingsLayoutProps {
  heading: string;
}

export const InnerPageLayout = ({
  heading,
  children,
}: PropsWithChildren<SettingsLayoutProps>) => {
  return (
    <div className='p-1'>
      <h2 className='typo-heading-24 mb-4'>{heading}</h2>

      {children}
    </div>
  );
};

export const InnerPageSection = ({
  heading,
  children,
}: PropsWithChildren<SettingsLayoutProps>) => {
  return (
    <section className='border-b-0.5 mb-8 flex flex-col pb-8 last:!border-b-0'>
      <h3 className='typo-heading-18 mb-6'>{heading}</h3>

      <div className='space-y-4'>{children}</div>
    </section>
  );
};

'use client';

import {
  CheckCircleIcon,
  InfoIcon,
  SpinnerIcon,
  WarningCircleIcon,
  WarningIcon,
  // XCircleIcon,
} from '@phosphor-icons/react';
import { useTheme } from 'next-themes';
import { Toaster as Sonner, type ToasterProps } from 'sonner';

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = 'system' } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps['theme']}
      className='toaster group'
      closeButton
      icons={{
        success: <CheckCircleIcon weight='fill' className='size-4' />,
        info: <InfoIcon weight='fill' className='size-4' />,
        warning: <WarningCircleIcon weight='fill' className='size-4' />,
        error: <WarningIcon weight='fill' className='size-4' />,
        loading: <SpinnerIcon className='size-4 animate-spin' />,
      }}
      style={
        {
          '--normal-bg': 'var(--popover)',
          '--normal-text': 'var(--popover-foreground)',
          '--normal-border': 'var(--border)',
          '--border-radius': 'var(--radius)',
        } as React.CSSProperties
      }
      toastOptions={{
        // unstyled: true,
        classNames: {
          toast:
            'relative w-full flex items-center border border-border rounded-[var(--radius)] p-2 font-sans',
          // default: 'bg-gray-100',
          icon: 'mx-2',
          closeButton:
            'absolute top-0 -right-2 p-1 rounded-full border border-border bg-gray-100',
          title:
            'mt-px whitespace-pre-line text-foreground typo-caption-14 text-[13px] font-medium!',
          description:
            'whitespace-pre-line text-sm text-muted-foreground typo-caption-14! text-[13px]!',
          actionButton: 'ml-2 rounded-full! p-2.5! typo-button-12 text-[13px]',
          cancelButton: 'ml-2 rounded-full! p-2.5! typo-button-12 text-[13px]',
        },
      }}
      {...props}
    />
  );
};

export { Toaster };

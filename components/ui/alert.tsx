import * as React from 'react';

import { type VariantProps, cva } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const alertVariants = cva(
  "grid rounded-lg border px-4 py-3 text-left text-sm has-data-[slot=alert-action]:relative has-data-[slot=alert-action]:pr-18 has-[>svg]:grid-cols-[auto_1fr] has-[>svg]:gap-x-2.5 *:[svg]:row-span-2 *:[svg]:translate-y-0.5 *:[svg]:text-current *:[svg:not([class*='size-'])]:size-4 w-full relative group/alert",
  // gap-0.5
  {
    variants: {
      variant: {
        // default: 'bg-card text-card-foreground',
        // destructive:
        //   'text-destructive bg-card *:data-[slot=alert-description]:text-destructive/90 *:[svg]:text-current',
        success:
          'bg-green-50 [&>*]:data-[slot=alert-title]:text-green-800 [&>*]:data-[slot=alert-description]:text-green-700 [&_button]:bg-green-200 [&>svg]:text-green-500 [&_button]:text-green-800 [&_button]:hover:bg-green-200/60',
        info: 'bg-blue-50 [&>*]:data-[slot=alert-title]:text-blue-800 [&>*]:data-[slot=alert-description]:text-blue-700 [&_button]:bg-blue-200 [&>svg]:text-blue-500 [&_button]:text-blue-800 [&_button]:hover:bg-blue-200/60',
        warning:
          'bg-yellow-50 [&>*]:data-[slot=alert-title]:text-yellow-800 [&>*]:data-[slot=alert-description]:text-yellow-700 [&_button]:bg-yellow-200 [&>svg]:text-yellow-500 [&_button]:text-yellow-800 [&_button]:hover:bg-yellow-200/60',
        error:
          'bg-rose-50 [&>*]:data-[slot=alert-title]:text-rose-800 [&>*]:data-[slot=alert-description]:text-rose-700 [&_button]:bg-rose-200 [&>svg]:text-rose-500 [&_button]:text-rose-800 [&_button]:hover:bg-rose-200/60',
      },
    },
    defaultVariants: {
      variant: 'info',
    },
  }
);

function Alert({
  className,
  variant,
  ...props
}: React.ComponentProps<'div'> & VariantProps<typeof alertVariants>) {
  return (
    <div
      data-slot='alert'
      role='alert'
      className={cn(alertVariants({ variant }), className)}
      {...props}
    />
  );
}

function AlertTitle({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot='alert-title'
      className={cn(
        '[&_a]:hover:text-foreground font-medium group-has-[>svg]/alert:col-start-2 [&_a]:underline [&_a]:underline-offset-3',
        className
      )}
      {...props}
    />
  );
}

function AlertDescription({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot='alert-description'
      className={cn(
        'text-muted-foreground [&_a]:hover:text-foreground text-sm text-balance md:text-pretty [&_a]:underline [&_a]:underline-offset-3 [&_p:not(:last-child)]:mb-4',
        className
      )}
      {...props}
    />
  );
}

function AlertAction({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot='alert-action'
      className={cn('absolute top-2.5 right-3', className)}
      {...props}
    />
  );
}

export { Alert, AlertTitle, AlertDescription, AlertAction };

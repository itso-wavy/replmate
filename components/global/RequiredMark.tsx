import { type ComponentProps } from 'react';

import { cn } from '@/lib/utils';

type RequiredMarkProps = ComponentProps<'span'> & {
  label?: string;
};

const RequiredMark = ({
  className,
  label = 'Required',
  ...props
}: RequiredMarkProps) => {
  return (
    <span
      className={cn(
        'typo-caption-12 text-brand-sun relative bottom-1 -left-1',
        className
      )}
      {...props}
    >
      <span aria-hidden='true'>*</span>
      <span className='sr-only'>{label}</span>
    </span>
  );
};

export default RequiredMark;

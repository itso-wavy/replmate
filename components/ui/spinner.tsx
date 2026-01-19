import { Loader } from 'lucide-react';

import { cn } from '@/lib/utils';

function Spinner({ className, ...props }: React.ComponentProps<'svg'>) {
  return (
    <Loader
      role='status'
      aria-label='Loading'
      className={cn('text-warmgray-500 size-5 animate-spin', className)}
      {...props}
    />
  );
}

export { Spinner };

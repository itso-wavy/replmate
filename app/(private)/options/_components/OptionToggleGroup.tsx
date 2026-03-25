'use client';

import { AlertCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface OptionToggleGroupProps<T> {
  label: string;
  tooltip: string;
  options: { label: string; value: T }[];
  defaultValue: T;
  value: T;
  onChange: (value: T) => void;
}

function OptionToggleGroup<T>({
  label,
  tooltip,
  options,
  defaultValue,
  value,
  onChange,
}: OptionToggleGroupProps<T>) {
  return (
    <div className='flex items-center gap-4'>
      <div className='flex w-[100px] items-center gap-1.5'>
        <span className='typo-body-16 font-medium'>{label}</span>
        <Tooltip>
          <TooltipTrigger className='cursor-help'>
            <AlertCircle size={14} className='text-primary' />
          </TooltipTrigger>
          <TooltipContent
            side='bottom'
            className='bg-brand-800 *:bg-brand-800 max-w-[280px] px-4 whitespace-pre-line'
          >
            <p className='text-sm leading-relaxed'>{tooltip}</p>
          </TooltipContent>
        </Tooltip>
      </div>

      <div className='flex gap-1.5'>
        {options.map((opt) => (
          <Button
            key={opt.value}
            variant={value === opt.value ? 'default' : 'outline'}
            size='sm'
            className={cn(
              'h-9 rounded-full px-4 text-sm',
              value === opt.value && 'pointer-events-none'
            )}
            onClick={() => onChange(opt.value)}
          >
            {opt.label}
          </Button>
        ))}
      </div>
    </div>
  );
}

export default OptionToggleGroup;

import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

const TextAreaWithCount = ({
  value,
  onChange,
  maxLength,
  placeholder,
  className,
}: {
  value: string;
  onChange: (value: string) => void;
  maxLength: number;
  placeholder?: string;
  className?: string;
}) => {
  return (
    <div className='relative'>
      <Textarea
        placeholder={placeholder}
        value={value}
        onChange={(e) => {
          if (e.target.value.length <= maxLength) onChange(e.target.value);
        }}
        className={cn('resize-none px-4 py-3', className)}
      />
      <span className='text-muted-foreground typo-caption-12 absolute right-4 bottom-3'>
        {value.length}
        <span className='mx-0.5'>/</span>
        {maxLength}
      </span>
    </div>
  );
};

export default TextAreaWithCount;

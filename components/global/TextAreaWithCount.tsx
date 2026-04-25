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
          const v = e.target.value;
          onChange(v.length <= maxLength ? v : v.slice(0, maxLength));
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

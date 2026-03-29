import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { cn } from '@/lib/utils';

const RadioButtonGroup = <T extends string | number>({
  options,
  optionsMap,
  value,
  onValueChange,
}: {
  options: T[];
  optionsMap: Record<string, string>;
  value: T;
  onValueChange: (value: T) => void;
}) => {
  // const vals = Object.values<T>(options);

  return (
    <RadioGroup
      value={String(value)}
      onValueChange={onValueChange}
      className='flex gap-1.5'
    >
      {options.map((val) => (
        <div key={String(val)}>
          <RadioGroupItem
            value={String(val)}
            id={`radio-${val}`}
            className='sr-only'
          />
          <Label
            htmlFor={`radio-${val}`}
            className={cn(
              'flex h-9 cursor-pointer items-center rounded-full px-4 text-sm font-medium transition-colors',
              'border-input hover:bg-accent hover:text-accent-foreground border',
              value === val &&
                'bg-primary border-primary text-primary-foreground pointer-events-none'
            )}
          >
            {optionsMap[String(val)]}
          </Label>
        </div>
      ))}
    </RadioGroup>
  );
};

export default RadioButtonGroup;

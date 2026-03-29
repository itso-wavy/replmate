import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';
import { ReplyLength, replyLengthLabelMap, replyLengthSteps } from '@/types';

interface SliderWithLabelsProps {
  value: ReplyLength;
  onChange: (value: ReplyLength) => void;
}

const SliderWithLabels = ({ value, onChange }: SliderWithLabelsProps) => {
  const index = replyLengthSteps.indexOf(value);

  return (
    <div className='flex flex-col px-1'>
      <Slider
        value={[index]}
        onValueChange={(index) => onChange(replyLengthSteps[index as number])}
        min={0}
        max={replyLengthSteps.length - 1}
        step={1}
        className='my-3'
      />
      <div className='flex justify-between'>
        {replyLengthSteps.map((step) => (
          <span
            key={step}
            onClick={() => onChange(step)}
            className={cn(
              'typo-caption-12 cursor-pointer transition-colors',
              value === step
                ? 'text-primary font-medium'
                : 'text-muted-foreground'
            )}
          >
            {replyLengthLabelMap[step]}
          </span>
        ))}
      </div>
    </div>
  );
};

export default SliderWithLabels;

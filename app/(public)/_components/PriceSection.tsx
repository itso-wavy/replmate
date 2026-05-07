'use client';

import { useRouter } from 'next/navigation';

import { CheckIcon, SparkleIcon } from '@phosphor-icons/react/dist/ssr';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ROUTES } from '@/constants/nav-menu';
import { usePlans } from '@/hooks/usePlans';
import { cn } from '@/lib/utils';
import type { PlanDomain } from '@/types';

const PriceSection = ({ id }: { id: string }) => {
  const router = useRouter();
  const { data: plans, isLoading } = usePlans(true);

  return (
    <section id={id} className='pt-[80px] pb-[150px]'>
      <div className='wrapper'>
        <div className='mb-16 text-center *:text-balance'>
          <p className='typo-eyebrow-14 text-brand-violet mb-2'>요금제</p>
          <h2 className='typo-display-36'>합리적인 가격으로 시작하세요</h2>
          <p className='text-muted-foreground typo-body-16 mt-3'>
            초기 비용 없이 무료로 시작하고, 매출 규모에 맞춰 업그레이드하세요.
          </p>
        </div>

        <div className='mx-auto grid gap-6 sm:grid-cols-2 lg:grid-cols-4'>
          {isLoading || !plans
            ? Array.from({ length: 4 }).map((_, idx) => (
                <PriceCardSkeleton key={idx} />
              ))
            : plans.map((plan) => <PriceCard key={plan.id} plan={plan} />)}
        </div>
        <p className='typo-caption-14 text-muted-foreground mt-8 text-center'>
          아직 확신이 안 서시나요? 카드 등록 없이{' '}
          <button
            onClick={() => router.push(ROUTES.LOGIN)}
            className='text-brand-500 font-medium'
          >
            [평생 무료 플랜]
          </button>
          으로 먼저 기능을 경험해보세요.
        </p>
      </div>
    </section>
  );
};

const PriceCard = ({ plan }: { plan: PlanDomain }) => {
  const POPULAR_PLAN_NAME = 'Premium';

  const router = useRouter();
  const isFree = plan.monthlyPrice === 0;
  // TODO: 현재는 POPULAR 플랜을 프론트에서 직접 선택하고 있음
  const isPopular = plan.name.toLowerCase() === POPULAR_PLAN_NAME.toLowerCase();

  return (
    <Card
      className={cn(
        'bg-accent/20 relative flex h-full flex-col overflow-visible transition-all lg:py-8',
        isPopular
          ? 'border-brand-violet shadow-primary/10 ring-brand-violet z-10 bg-white shadow-xl ring-2 md:scale-105'
          : 'hover:border-brand-mint border border-transparent'
      )}
    >
      {isPopular && (
        <div className='typo-caption-12 bg-brand-violet text-primary-foreground absolute top-0 left-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center rounded-full px-3 py-1.5 whitespace-nowrap shadow-lg'>
          <SparkleIcon size={10} className='mr-1' />
          MOST POPULAR
        </div>
      )}

      <CardHeader>
        <CardTitle>{plan.name}</CardTitle>
        <CardDescription className='text-balance'>
          {plan.title ?? ' '}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className='mb-8 flex items-baseline'>
          <span className='text-foreground typo-heading-28'>
            {isFree ? '평생 무료' : plan.monthlyPrice.toLocaleString()}
          </span>
          {!isFree && (
            <span className='ml-1'>
              <span className='mr-0.5'>원 /월</span>
              <span className='text-muted-foreground'>(VAT 포함)</span>
            </span>
          )}
        </div>

        <div className='flex flex-grow flex-col space-y-2'>
          {[...plan.summary, ...plan.contents].map((feature) => (
            <div key={feature} className='flex items-center'>
              <div className='bg-brand-green/20 mr-3 flex flex-shrink-0 rounded-full p-1'>
                <CheckIcon size={10} className='text-muted-foreground' />
              </div>
              <span className='text-foreground typo-body-14'>{feature}</span>
            </div>
          ))}
        </div>

        <Button
          size='default'
          variant='outline'
          onClick={() => router.push(ROUTES.LOGIN)}
          className={cn(
            'hover:bg-foreground hover:text-primary-foreground mt-6 w-full',
            isPopular && 'bg-brand-violet text-primary-foreground',
            isFree && 'bg-brand-400 text-primary-foreground'
          )}
        >
          {isFree ? '무료로 시작하기' : '플랜 시작하기'}
        </Button>
      </CardContent>
    </Card>
  );
};

const PriceCardSkeleton = () => (
  <Card className='bg-accent/20 relative flex h-full flex-col overflow-visible lg:py-8'>
    <CardHeader>
      <Skeleton className='h-6 w-24' />
      <Skeleton className='mt-2 h-4 w-40' />
    </CardHeader>
    <CardContent>
      <Skeleton className='mb-8 h-8 w-32' />
      <div className='flex flex-grow flex-col space-y-3'>
        <Skeleton className='h-4 w-full' />
        <Skeleton className='h-4 w-full' />
        <Skeleton className='h-4 w-full' />
      </div>
      <Skeleton className='mt-6 h-10 w-full' />
    </CardContent>
  </Card>
);

export default PriceSection;

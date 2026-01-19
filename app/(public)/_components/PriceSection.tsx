'use client';

import { useRouter } from 'next/navigation';

import { CheckIcon, SparkleIcon } from '@phosphor-icons/react/dist/ssr';

// import { Check, Sparkles } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';

const plans = [
  {
    recommand: true,
    name: 'Free',
    price: '평생 무료',
    description: '리플메이트를 경험해보고 싶은 셀러',
    features: ['월 30건 답글 생성', '상품 1개 집중 관리', '쇼핑몰 1개 연동'],
    cta: '무료로 시작하기',
  },
  {
    name: 'Basic',
    price: '39,000',
    description: '혼자서도 완벽한 1인 셀러',
    features: ['월 180건 답글 생성', '상품 20개 집중 관리', '쇼핑몰 1개 연동'],
    cta: '플랜 시작하기',
  },
  {
    popular: true,
    name: 'Premium',
    price: '99,000',
    description: '급성장하는 파워 셀러',
    features: [
      '월 800건 답글 생성',
      '상품 50개 확장 관리',
      '쇼핑몰 2개 동시 운영',
    ],
    cta: '플랜 시작하기',
  },
  {
    name: 'Enterprise',
    price: '198,000',
    description: '다점포 운영 브랜드',
    features: [
      '월 1,800건 답변 생성',
      '상품 100개 대량 관리',
      '쇼핑몰 4개 통합 운영',
    ],
    cta: '플랜 시작하기',
  },
];

const PriceSection = ({ id }: { id: string }) => {
  const router = useRouter();

  return (
    <section id={id} className='pt-[80px] pb-[150px]'>
      <div className='wrapper'>
        <div className='mb-16 text-center *:text-balance'>
          <p className='typo-eyebrow-14 text-brand-12 mb-2'>요금제</p>
          <h2 className='typo-display-36'>합리적인 가격으로 시작하세요</h2>
          <p className='text-muted-foreground typo-body-16 mt-3'>
            초기 비용 없이 무료로 시작하고, 매출 규모에 맞춰 업그레이드하세요.
          </p>
        </div>

        <div className='mx-auto grid gap-6 sm:grid-cols-2 lg:grid-cols-4'>
          {plans.map((plan, index) => (
            <PriceCard key={index} plan={plan} />
          ))}
        </div>
        <p className='typo-caption-14 text-muted-foreground mt-8 text-center'>
          아직 확신이 안 서시나요? 카드 등록 없이{' '}
          <button
            onClick={() => router.push('/login')}
            className='text-brand-0 font-medium'
          >
            [평생 무료 플랜]
          </button>
          으로 먼저 기능을 경험해보세요.
        </p>
      </div>
    </section>
  );
};

const PriceCard = ({ plan }: any) => {
  const router = useRouter();

  return (
    <Card
      className={cn(
        'bg-accent/20 relative flex h-full flex-col overflow-visible transition-all lg:py-8',
        plan.popular
          ? 'border-brand-12 shadow-primary/10 ring-brand-12 z-10 bg-white shadow-xl ring-2 md:scale-105'
          : 'hover:border-brand-5 border border-transparent'
      )}
    >
      {plan.popular && (
        <div className='typo-caption-12 bg-brand-12 text-primary-foreground absolute top-0 left-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center rounded-full px-3 py-1.5 whitespace-nowrap shadow-lg'>
          <SparkleIcon size={10} className='mr-1' />
          MOST POPULAR
        </div>
      )}

      <CardHeader>
        <CardTitle>{plan.name}</CardTitle>
        <CardDescription className='text-balance'>
          {plan.description}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className='mb-8 flex items-baseline'>
          <span className='text-foreground typo-heading-28'>{plan.price}</span>
          {!plan.recommand && (
            <span className='ml-1'>
              <span className='mr-0.5'>원 /월</span>
              <span className='text-muted-foreground'>(VAT 포함)</span>
            </span>
          )}
        </div>

        <div className='flex flex-grow flex-col space-y-2'>
          {plan.features.map((feature: string) => (
            <div key={feature} className='flex items-center'>
              <div
                className={`bg-brand-9/20 mr-3 flex flex-shrink-0 rounded-full p-1`}
              >
                <CheckIcon size={10} className='text-muted-foreground' />
              </div>
              <span className='text-foreground typo-body-14'>{feature}</span>
            </div>
          ))}
        </div>

        <Button
          size='default'
          variant='outline'
          onClick={() => router.push('/login')}
          className={cn(
            'hover:bg-foreground hover:text-primary-foreground mt-6 w-full',
            plan.popular && 'bg-brand-12 text-primary-foreground',
            plan.recommand && 'bg-brand-1 text-primary-foreground'
          )}
        >
          {plan.cta}
        </Button>
      </CardContent>
    </Card>
  );
};

export default PriceSection;

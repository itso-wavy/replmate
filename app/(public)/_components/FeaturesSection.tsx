// import { Clock, Smile, TrendingUp } from 'lucide-react';
import {
  HourglassHighIcon,
  SmileyIcon,
  TrendUpIcon,
} from '@phosphor-icons/react/dist/ssr';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

const FeaturesSection = ({ id }: { id: string }) => {
  return (
    <section id={id} className='pt-[80px] pb-[120px]'>
      <div className='wrapper'>
        <div className='mb-16 text-center *:text-balance'>
          <p className='typo-eyebrow-14 text-brand-9 mb-2'>서비스 소개</p>
          <h2 className='typo-display-36'>왜 리플메이트인가요?</h2>
          <p className='text-muted-foreground typo-body-16 mt-3'>
            단순 반복 업무는 AI에게 맡기고, 사장님은 매출 상승에만 집중하세요.
          </p>
        </div>

        <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
          <FeatureCard
            icon={<HourglassHighIcon className='text-brand-1' size={32} />}
            title='시간 절약 90%'
            description='하루 1시간 걸리던 리뷰 관리, 5분이면 충분합니다. 클릭 한 번으로 최적의 답글을 생성하세요.'
          />
          <FeatureCard
            icon={<SmileyIcon className='text-brand-sun' size={32} />}
            title='감정 노동 ZERO'
            description='악성 리뷰에 스트레스 받지 마세요. AI가 감정을 배제하고 가장 정중하고 적절한 대응을 해드립니다.'
          />
          <FeatureCard
            icon={<TrendUpIcon className='text-brand-9' size={32} />}
            title='구매 전환율 상승'
            description='친절하고 빠른 소통은 신규 고객의 구매를 유도합니다. 리뷰 관리는 최고의 마케팅입니다.'
          />
        </div>
      </div>
    </section>
  );
};

const FeatureCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
}> = ({ icon, title, description }) => (
  <Card className='hover:border-brand-5 bg-accent/20 h-full border border-transparent transition-transform duration-300 hover:-translate-y-2 hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.08)]'>
    <CardContent>
      <div className='bg-warmgray-200/20 mb-3 grid size-14 place-content-center rounded-2xl'>
        {icon}
      </div>
    </CardContent>
    <CardHeader>
      <CardTitle className='typo-heading-20 mb-1'>{title}</CardTitle>
      <CardDescription className='typo-body-14'>{description}</CardDescription>
    </CardHeader>
  </Card>
);

export default FeaturesSection;

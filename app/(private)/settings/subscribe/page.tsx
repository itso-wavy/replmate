import { Button } from '@/components/ui/button';

import { InnerPageLayout, InnerPageSection } from '../_components';

const SubscribePage = () => {
  return (
    <InnerPageLayout heading='구독 관리'>
      <InnerPageSection heading='구독 정보'></InnerPageSection>
      <InnerPageSection heading='이용량 모니터링'></InnerPageSection>
      <InnerPageSection heading='결제 내역 요청'> </InnerPageSection>
      <InnerPageSection heading='리플 사용 이력'> </InnerPageSection>
    </InnerPageLayout>
  );
};

export default SubscribePage;

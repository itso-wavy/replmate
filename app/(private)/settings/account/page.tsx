import { Button } from '@/components/ui/button';

import { InnerPageLayout, InnerPageSection } from '../_components';

const AccountPage = () => {
  return (
    <InnerPageLayout heading='계정 관리'>
      <InnerPageSection heading='계정 정보'>
        <div>이메일</div>
        <div>가입일</div>
        <div>로그인 방식</div>
      </InnerPageSection>

      <InnerPageSection heading='본인인증 정보'>
        <div className='flex'>
          <div>미인증</div>
          <Button>본인인증</Button>
        </div>
      </InnerPageSection>

      <InnerPageSection heading='마케팅 및 알림 설정'></InnerPageSection>

      <InnerPageSection heading='약관'></InnerPageSection>
    </InnerPageLayout>
  );
};

export default AccountPage;

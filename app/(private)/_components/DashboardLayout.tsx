import { PropsWithChildren } from 'react';

import CustomAlert from '@/components/global/CustomAlert';
import { Alert } from '@/types';

interface DashboardLayoutProps {
  heading?: string;
  description?: string | React.ReactNode;
  alerts?: Alert[];
}

const DashboardLayout = ({
  heading,
  description,
  alerts,
  children,
}: PropsWithChildren<DashboardLayoutProps>) => {
  // 대시보드 진입 시 플랜 정보 조회
  // useEffect(() => {
  //   const fetchPlanInfo = async () => {
  //     try {
  //       const response = await api.get<UserPlanResponseData>(
  //         ENDPOINTS.USER.GET_USER_PLAN
  //       );
  //       setPlanInfo({
  //         plan: response.data.plan,
  //         subscription: response.data.subscription,
  //       });
  //     } catch (error) {
  //       console.error('Failed to fetch plan info:', error);
  //     }
  //   };

  //   fetchPlanInfo();
  // }, [setPlanInfo]);

  return (
    <div className='text-foreground relative mx-auto py-5'>
      <div className='border-border w-full space-y-2 border-b px-7 py-5'>
        {heading && <h1 className='typo-display-36'>{heading}</h1>}
        {description && (
          <p className='typo-body-16 text-gray-600'>{description}</p>
        )}
      </div>

      <div className='flex flex-col gap-4 px-4 py-4'>
        {alerts && (
          <div className='flex flex-col gap-1'>
            {alerts.map((alert) => {
              const { createdAt, ...rest } = alert;

              return <CustomAlert key={alert.id} {...rest} />;
            })}
          </div>
        )}
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;

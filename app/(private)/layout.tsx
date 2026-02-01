import Logo from '@/components/global/Logo';
import { DASHBOARD_MENU } from '@/constants/nav-menu';

import { PrivateHeader } from './_components';

const PrivateLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      {/* md 사이즈 미만 대체 화면 */}
      <div className='wrapper'>
        <div className='typo-body-16 text-foreground grid h-svh place-content-center text-center md:hidden'>
          <Logo className='pointer-events-none mx-auto' />
          <p className='mt-6 text-balance break-keep'>
            리플메이트는 더 나은 사용 경험을 위해 데스크톱 환경에서 지원됩니다.
          </p>
          <p>PC 또는 태블릿(가로 모드)에서 이용해 주세요.</p>
          <p className='text-muted-foreground typo-caption-12 mt-2'>
            (권장 해상도: 1280×720 이상)
          </p>
        </div>
      </div>

      {/* md 사이즈 이상 정상 화면 */}
      <div className='relative hidden min-h-svh flex-col md:flex'>
        <PrivateHeader
          navMenu={DASHBOARD_MENU}
          className='from-brand-500/15 to-brand-400/10 bg-radial'
        />

        <main className='from-brand-400/10 mx-auto flex w-full max-w-[1900px] flex-1 flex-col overflow-hidden bg-linear-180 from-0% to-white to-10% px-[20px]'>
          <div className='flex flex-1 flex-row gap-2 pt-2 pb-6'>
            {/* <div className='bg-blue-100'>sidebar left</div> */}
            <div
              id='dashboard'
              className='relative mx-auto flex w-full flex-1 flex-col rounded-2xl'
            >
              {/* ring-1 ring-foreground/15 bg-white */}
              <div className='bg-background-muted/30 absolute inset-0 overflow-y-auto rounded-2xl shadow-[inset_0_3px_10px_-11px_var(--color-brand-900)]'>
                {/* <div className='absolute inset-0 overflow-y-auto rounded-2xl '> */}
                {children}
              </div>
            </div>
            {/* <div className='bg-blue-100'>sidebar right</div> */}
          </div>
        </main>
      </div>
    </>
  );
};

export default PrivateLayout;

import { GNB_MENU } from '@/constants/nav-menu';

import { Footer, PublicHeader } from './_components';

const PublicLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className='relative flex min-h-svh flex-col overflow-hidden scroll-smooth'>
      <PublicHeader navMenu={GNB_MENU} />

      <main className='flex flex-1 flex-col before:block before:h-[64px]'>
        {children}
      </main>

      <Footer />
    </div>
  );
};

export default PublicLayout;

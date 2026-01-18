import { GNB_MENU, SECTION_ID } from '@/constants/nav-menu';

import {
  FeaturesSection,
  Footer,
  HeroSection,
  PriceSection,
  PublicHeader,
  SupportSection,
} from './_components';

const LandingPage = () => {
  // TODO: Auth 상태에 따른 CTA 경로 처리 (PUB-LAND-CTA-001)

  return (
    <>
      <PublicHeader navMenu={GNB_MENU} />

      <main className='flex flex-1 flex-col'>
        <HeroSection id={SECTION_ID.HERO} />
        <FeaturesSection id={SECTION_ID.FEATURES} />
        <PriceSection id={SECTION_ID.PRICE} />
        <SupportSection id={SECTION_ID.SUPPORT} />
      </main>
      <Footer />
    </>
  );
};

export default LandingPage;

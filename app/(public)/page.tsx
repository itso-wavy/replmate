import { LANDING_GNB_MENU, LANDING_SECTIONS } from '@/constants/nav-menu';

import {
  FeaturesSection,
  Footer,
  HeroSection,
  PriceSection,
  PublicHeader,
  SupportSection,
} from './_components';

const LandingPage = () => {
  return (
    <>
      <PublicHeader navMenu={[...LANDING_GNB_MENU]} />

      <main className='flex flex-1 flex-col'>
        <HeroSection id={LANDING_SECTIONS.HERO} />
        <FeaturesSection id={LANDING_SECTIONS.FEATURES} />
        <PriceSection id={LANDING_SECTIONS.PRICE} />
        <SupportSection id={LANDING_SECTIONS.SUPPORT} />
      </main>
      <Footer />
    </>
  );
};

export default LandingPage;

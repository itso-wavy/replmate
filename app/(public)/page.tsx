import { SECTION_ID } from '@/constants/nav-menu';

import {
  FeaturesSection,
  HeroSection,
  PriceSection,
  SupportSection,
} from './_components';

const LandingPage = () => {
  // TODO: Auth 상태에 따른 CTA 경로 처리 (PUB-LAND-CTA-001)

  return (
    <>
      <HeroSection id={SECTION_ID.HERO} />
      <FeaturesSection id={SECTION_ID.FEATURES} />
      <PriceSection id={SECTION_ID.PRICE} />
      <SupportSection id={SECTION_ID.SUPPORT} />
    </>
  );
};

export default LandingPage;

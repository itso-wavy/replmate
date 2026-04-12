import { PlatformType } from '@/types/enums';

export interface PlatformTypeConfig {
  platform: string;
  baseUrl: string;
  label: string;
  itemStyle: string;
  triggerStyle: string;
  platformStyle: string;
}

export const PLATFORM_TYPE_CONFIG: Record<PlatformType, PlatformTypeConfig> = {
  [PlatformType.SMARTSTORE]: {
    platform: 'naver',
    baseUrl: 'https://smartstore.naver.com/',
    label: '네이버 스마트스토어',
    itemStyle: 'text-smart-store-theme focus:*:text-smart-store-theme!',
    triggerStyle: 'bg-smart-store-theme/8',
    platformStyle: 'text-smart-store-theme/90',
  },
  [PlatformType.BRANDSTORE]: {
    platform: 'naver',
    baseUrl: 'https://brand.naver.com/',
    label: '네이버 브랜드스토어',
    itemStyle: 'text-brand-store-theme focus:*:text-brand-store-theme!',
    triggerStyle: 'bg-brand-store-theme/8',
    platformStyle: 'text-brand-store-theme/90',
  },
};

import { redirect } from 'next/navigation';

import { ROUTES } from '@/constants/nav-menu';

const SettingsPage = () => {
  redirect(ROUTES.SUBSCRIBE);
};

export default SettingsPage;

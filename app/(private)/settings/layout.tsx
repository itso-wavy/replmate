'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { PropsWithChildren } from 'react';

import { SETTINGS_MENU } from '@/constants/nav-menu';
import { cn } from '@/lib/utils';

import { DashboardLayout } from '../_components';

const SettingsLayout = ({ children }: PropsWithChildren) => {
  const pathname = usePathname();

  const isLinkActive = (href: string) => pathname.startsWith(href);

  return (
    <DashboardLayout heading='설정'>
      <div className='mx-auto flex w-full max-w-6xl gap-8'>
        <nav className='sticky top-6 m-1 flex w-[180px] flex-col gap-1 self-start pt-1'>
          {SETTINGS_MENU.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'typo-body-14 text-foreground/60 hover:bg-brand-600/10 hover:text-foreground rounded-lg px-3 py-2.5 transition-all duration-200',
                isLinkActive(item.href) &&
                  'bg-brand-600/15 text-foreground hover:bg-brand-600/15 font-medium'
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <main className='flex-1'>{children} </main>
      </div>
    </DashboardLayout>
  );
};

export default SettingsLayout;

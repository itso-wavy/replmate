'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { useState } from 'react';

import { ListIcon } from '@phosphor-icons/react/dist/ssr';

import Logo from '@/components/global/Logo';
import { Button } from '@/components/ui/button';
import { SECTION_ID } from '@/constants/nav-menu';
import { useActiveSection } from '@/hooks/useActiveSection';
import { cn } from '@/lib/utils';

interface PublicHeaderProps {
  navMenu: {
    label: string;
    href: string;
  }[];
}

const PublicHeader = ({ navMenu }: PublicHeaderProps) => {
  const [openSideNav, setOpenSideNav] = useState(false);

  const router = useRouter();
  const toLogin = () => router.push('/login');

  const sectionIds = Object.values(SECTION_ID);
  const activeId = useActiveSection({
    sectionIds,
    headerHeight: 64,
    syncHash: true,
  });

  return (
    <header className='border-border fixed top-0 right-0 left-0 z-50 h-[64px] w-full border-b bg-white/30 backdrop-blur-[8px] backdrop-saturate-180'>
      <div className='container-wrapper flex h-full items-center justify-between'>
        <Logo />

        {/* Navigation */}
        <nav className='hidden items-center space-x-4 md:flex'>
          {navMenu.map((menu) => (
            <Link
              key={menu.label}
              href={menu.href}
              className={cn(
                'typo-button-14 text-foreground/80 hover:bg-accent hover:text-foreground rounded-[8px] px-3 py-2 transition-all duration-200 hover:font-medium',
                menu.href === `/#${activeId}` &&
                  'bg-accent text-foreground font-medium'
              )}
            >
              {menu.label}
            </Link>
          ))}
        </nav>

        {/* Login Button Group with Arrow */}
        <svg className='absolute inset-0 h-0 w-0'>
          <defs>
            <filter
              id='glass-effect'
              x='-50%'
              y='-50%'
              width='200%'
              height='200%'
            >
              <feTurbulence
                baseFrequency='0.005'
                numOctaves='1'
                result='noise'
              ></feTurbulence>
              <feDisplacementMap
                in='SourceGraphic'
                in2='noise'
                scale='0.3'
              ></feDisplacementMap>
              <feColorMatrix
                type='matrix'
                values='1 0 0 0 0.02
                      0 1 0 0 0.02
                      0 0 1 0 0.05
                      0 0 0 0.9 0'
                result='tint'
              ></feColorMatrix>
            </filter>
            <filter
              id='gooey-filter'
              x='-50%'
              y='-50%'
              width='200%'
              height='200%'
            >
              <feGaussianBlur
                in='SourceGraphic'
                stdDeviation='4'
                result='blur'
              ></feGaussianBlur>
              <feColorMatrix
                in='blur'
                mode='matrix'
                values='1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9'
                result='gooey'
              ></feColorMatrix>
              <feComposite
                in='SourceGraphic'
                in2='gooey'
                operator='atop'
              ></feComposite>
            </filter>
          </defs>
        </svg>

        <div
          id='gooey-btn'
          className='group relative flex items-center'
          style={{ filter: 'url("#gooey-filter")' }}
        >
          <Button
            size='sm'
            onClick={toLogin}
            className='bg-foreground text-background hover:bg-foreground/90 absolute right-0 hidden -translate-x-13 cursor-pointer rounded-full transition-all duration-300 group-hover:-translate-x-15 md:block'
          >
            <svg
              className='h-3 w-3'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M7 17L17 7M17 7H7M17 7V17'
              ></path>
            </svg>
          </Button>
          <Button
            size='default'
            onClick={toLogin}
            className='bg-brand-lightblue hover:bg-brand-lightblue/90 md:bg-foreground md:text-background md:hover:bg-foreground/90 z-10 h-9 cursor-pointer rounded-full px-4 text-center transition-all duration-300 md:h-8 md:px-3 md:pl-4 md:text-xs'
          >
            로그인
          </Button>

          <div className='relative'>
            <Button
              size='icon'
              onClick={() => setOpenSideNav((prev) => !prev)}
              className='bg-foreground text-background hover:bg-foreground/90 ml-2 md:hidden'
            >
              <ListIcon />
            </Button>
            <nav
              className={cn(
                'absolute top-12 -right-1 flex flex-col items-end space-y-[4px] md:hidden',
                openSideNav ? 'opacity-100' : 'pointer-events-none opacity-0'
              )}
            >
              {navMenu.map((menu, index) => (
                <Link
                  key={menu.label}
                  href={menu.href}
                  className={cn(
                    'bg-foreground text-background hover:bg-foreground/90 typo-button-16 block w-fit rounded-full px-4.5 py-3 whitespace-nowrap transition-all duration-300 hover:font-medium',
                    openSideNav
                      ? 'translate-y-0 opacity-100'
                      : 'translate-y-[-20px] opacity-0'
                  )}
                  style={{
                    transitionDelay: openSideNav ? `${index * 120}ms` : '0ms',
                  }}
                  onClick={() => setOpenSideNav(false)}
                >
                  {menu.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
};

export default PublicHeader;

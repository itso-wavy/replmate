'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

import { useState } from 'react';

import { LogOut, Settings } from 'lucide-react';

import { ProfileSvg } from '@/assets/svg';
import Logo from '@/components/global/Logo';
import { LogoutModal } from '@/components/modal';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { UserStore } from '@/store/userStore';

interface HeaderProps {
  navMenu: {
    label: string;
    href: string;
  }[];
  className?: string;
}
const PrivateHeader = ({ navMenu, className }: HeaderProps) => {
  const user = UserStore.useUser();
  const router = useRouter();
  const pathname = usePathname();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const handleLogoutModal = () => setShowLogoutModal(true);

  return (
    <header
      className={cn(
        'sticky top-0 right-0 left-0 z-50 h-[64px] bg-white/30 backdrop-blur-[8px] backdrop-saturate-180',
        className
      )}
    >
      <div className='wrapper flex h-full items-center justify-between'>
        <Logo href='/dashboard' />
        {/* Navigation */}
        <nav className='hidden items-center space-x-4 md:flex'>
          {navMenu.map((menu) => (
            <Link
              key={menu.label}
              href={menu.href}
              className={cn(
                'typo-button-14 text-foreground/80 hover:bg-brand-600/10 hover:text-foreground active:bg-brand-700/18 rounded-[8px] px-3 py-2 transition-all duration-200 hover:font-medium',
                pathname === menu.href &&
                  'bg-brand-600/15 text-foreground font-medium'
              )}
            >
              {menu.label}
            </Link>
          ))}
        </nav>

        <DropdownMenu modal={false}>
          <DropdownMenuTrigger>
            <div className='text-foreground/80 hover:text-foreground rounded-[8px] bg-white/70 p-2 transition-all duration-200 hover:bg-white'>
              <ProfileSvg className='h-[22px] w-[22px]' />
            </div>
          </DropdownMenuTrigger>

          <DropdownMenuContent className='w-fit'>
            <DropdownMenuGroup>
              <DropdownMenuLabel className='pb-1.5'>Email</DropdownMenuLabel>
              <div className='typo-link-14 text-primary px-3 pb-2 wrap-break-word'>
                {user?.email ?? ''}
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push('/account')}>
                <Settings className='text-muted-foreground size-4' />
                <span>계정 관리</span>
              </DropdownMenuItem>

              <DropdownMenuItem onClick={handleLogoutModal}>
                <LogOut className='text-muted-foreground size-4' />
                <span>로그아웃</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <LogoutModal open={showLogoutModal} onOpenChange={setShowLogoutModal} />
      </div>
    </header>
  );
};

export default PrivateHeader;

'use client';

import Image from 'next/image';
import Link from 'next/link';

import LogoIcon from '@/assets/png/logo-icon.png';
import LogoText from '@/assets/png/logo-text.png';
import { ROUTES } from '@/constants/nav-menu';
import { cn } from '@/lib/utils';

interface LogoProps {
  href?: string;
  showIcon?: boolean;
  showText?: boolean;
  className?: string;
  iconClassName?: string;
  textClassName?: string;
}

const Logo = ({
  href = ROUTES.ROOT,
  showIcon = false,
  showText = true,
  className,
  iconClassName,
  textClassName,
}: LogoProps) => {
  const handleLogoClick = () => {
    window.scrollTo({ top: 0 });
  };

  return (
    <Link
      href={href}
      onClick={handleLogoClick}
      className={cn('group mr-2 flex shrink-0 items-center pt-2', className)}
    >
      {showIcon && (
        <Image
          src={LogoIcon}
          alt='Replmate icon'
          width={40}
          height={40}
          className={cn(
            'duration-200 group-hover:opacity-75',
            showIcon && showText && 'mr-3',
            iconClassName
          )}
        />
      )}
      {showText && (
        <Image
          src={LogoText}
          alt='Replmate'
          width={99}
          height={22}
          className={cn('duration-200 group-hover:opacity-75', textClassName)}
        />
      )}
    </Link>
  );
};

export default Logo;

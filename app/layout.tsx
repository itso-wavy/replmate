import type { Metadata } from 'next';
import localFont from 'next/font/local';

import { Toaster } from '@/components/ui/sonner';

import Providers from './_providers';
import './globals.css';

const pretendard = localFont({
  src: '../public/PretendardVariable.woff2',
  preload: true,
  weight: '400 600',
  display: 'fallback',
  variable: '--font-pretendard',
});

export const metadata: Metadata = {
  title: {
    default: 'ReplMate',
    template: '%s | ReplMate',
  },
  description: '',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='ko' className='scroll-smooth'>
      <body
        className={`${pretendard.variable} selection:bg-primary/40 selection:text-foreground antialiased select-none`}
      >
        <Providers>{children}</Providers>

        <Toaster position='bottom-center' expand={false} closeButton={false} />
      </body>
    </html>
  );
}

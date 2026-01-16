import type { Metadata } from 'next';
import localFont from 'next/font/local';

import './globals.css';

const pretendard = localFont({
  src: '/PretendardVariable.woff2',
  preload: true,
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
    <html lang='ko'>
      <body className={`${pretendard.variable} antialiased`}>{children}</body>
    </html>
  );
}

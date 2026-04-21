import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: 'https://6f99012b30b2471db3768b4973bbb190@glitchtip.sp-podpod.com/6',
  tracesSampleRate: 0.01,
});

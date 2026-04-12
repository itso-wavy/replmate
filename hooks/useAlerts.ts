import { usePathname } from 'next/navigation';

import { useMemo } from 'react';

import { ROUTES } from '@/constants/nav-menu';
import { formatDate } from '@/lib/utils';
import {
  AdjustmentRequiredMeta,
  AdjustmentScheduledMeta,
  Alert,
  PaymentFailedMeta,
  ReminderDomain,
  ReminderEvent,
} from '@/types';

import { useReminders } from './useReminders';

function toAlert(reminder: ReminderDomain, pathname: string): Alert | null {
  const base = {
    id: String(reminder.id),
    createdAt: reminder.createdAt,
    variant: reminder.level,
    category: reminder.category,
    type: reminder.event,
  };

  const isDashboard = pathname.startsWith(ROUTES.DASHBOARD);

  switch (reminder.event) {
    case ReminderEvent.PAYMENT_FAILED: {
      const meta = reminder.meta as PaymentFailedMeta;
      return {
        ...base,
        title: `정기 결제에 실패했습니다. D-${meta.daysUntilDowngrade} 후 무료 플랜으로 전환됩니다.\n원활한 서비스 이용을 위해 결제 정보를 확인해 주세요.`,
        href: ROUTES.SUBSCRIBE,
      };
    }

    case ReminderEvent.STORE_VERIFICATION_REJECTED: {
      return {
        ...base,
        title: '쇼핑몰 관리자 인증이 반려되었습니다.',
        href: ROUTES.STORES,
      };
    }

    case ReminderEvent.STORE_CONNECTION_REQUIRED: {
      return {
        ...base,
        title: '쇼핑몰 연동이 필요합니다.',
        description:
          '현재 사용 가능한 쇼핑몰이 없어 서비스 이용이 제한됩니다. 쇼핑몰 상태를 확인해 주세요.',
        href: ROUTES.STORES,
      };
    }

    case ReminderEvent.STORE_ADJUSTMENT_REQUIRED: {
      const meta = reminder.meta as AdjustmentRequiredMeta;
      if (isDashboard) {
        return {
          ...base,
          title: '구독 플랜 변경으로 쇼핑몰 수 조정이 필요합니다.',
          href: ROUTES.STORES,
        };
      }
      return {
        ...base,
        title: '구독 플랜 변경으로 쇼핑몰 조정이 필요합니다.',
        description: `${formatDate(meta.dueDate)}부터 ${meta.planName}(쇼핑몰 최대 ${meta.maxStoreCount}개 · 상품 최대 ${meta.maxProductCount}개)이 적용됩니다.\n현재 쇼핑몰 ${meta.currentStoreCount}개, 상품 ${meta.currentProductCount}개가 등록되어 있어 조정이 필요합니다. 기한 내 조정하지 않으실 경우, 최근 등록된 순서대로 자동 비활성화 처리됩니다.`,
      };
    }

    case ReminderEvent.PRODUCT_ADJUSTMENT_REQUIRED: {
      const meta = reminder.meta as AdjustmentRequiredMeta;
      if (isDashboard) {
        return {
          ...base,
          title: '구독 플랜 변경으로 상품 수 조정이 필요합니다.',
          href: ROUTES.PRODUCTS,
        };
      }
      return {
        ...base,
        title: '구독 플랜 변경으로 상품 조정이 필요합니다.',
        description: `${formatDate(meta.dueDate)}부터 ${meta.planName}(쇼핑몰 최대 ${meta.maxStoreCount}개 · 상품 최대 ${meta.maxProductCount}개)이 적용됩니다.\n현재 쇼핑몰 ${meta.currentStoreCount}개, 상품 ${meta.currentProductCount}개가 등록되어 있어 조정이 필요합니다. 기한 내 조정하지 않으실 경우, 최근 등록된 순서대로 자동 비활성화 처리됩니다.`,
      };
    }

    case ReminderEvent.STORE_ADJUSTMENT_SCHEDULED: {
      const meta = reminder.meta as AdjustmentScheduledMeta;
      return {
        ...base,
        title: '구독 플랜 변경으로 쇼핑몰이 조정될 예정입니다.',
        description: `${formatDate(meta.effectiveDate)}부터 ${meta.planName}(쇼핑몰 최대 ${meta.maxStoreCount}개 · 상품 최대 ${meta.maxProductCount}개)이 적용됩니다.`,
      };
    }

    case ReminderEvent.PRODUCT_ADJUSTMENT_SCHEDULED: {
      const meta = reminder.meta as AdjustmentScheduledMeta;
      return {
        ...base,
        title: '구독 플랜 변경으로 상품이 조정될 예정입니다.',
        description: `${formatDate(meta.effectiveDate)}부터 ${meta.planName}(쇼핑몰 최대 ${meta.maxStoreCount}개 · 상품 최대 ${meta.maxProductCount}개)이 적용됩니다.`,
      };
    }

    default:
      return null;
  }
}

const PAGE_EVENTS: Partial<Record<string, ReminderEvent[]>> = {
  [ROUTES.DASHBOARD]: [
    ReminderEvent.PAYMENT_FAILED,
    ReminderEvent.STORE_VERIFICATION_REJECTED,
    ReminderEvent.STORE_ADJUSTMENT_REQUIRED,
    ReminderEvent.PRODUCT_ADJUSTMENT_REQUIRED,
  ],
  [ROUTES.STORES]: [
    ReminderEvent.STORE_ADJUSTMENT_REQUIRED,
    ReminderEvent.STORE_ADJUSTMENT_SCHEDULED,
  ],
  [ROUTES.PRODUCTS]: [
    ReminderEvent.STORE_CONNECTION_REQUIRED,
    ReminderEvent.PRODUCT_ADJUSTMENT_REQUIRED,
    ReminderEvent.PRODUCT_ADJUSTMENT_SCHEDULED,
  ],
  [ROUTES.OPTIONS]: [ReminderEvent.STORE_CONNECTION_REQUIRED],
  [ROUTES.REPLYS]: [ReminderEvent.STORE_CONNECTION_REQUIRED],
};

export function useAlerts(): Alert[] {
  const pathname = usePathname();
  const { data: reminders = [] } = useReminders();

  return useMemo<Alert[]>(() => {
    const allowedEvents =
      Object.entries(PAGE_EVENTS).find(([route]) =>
        pathname.startsWith(route)
      )?.[1] ?? [];

    const alerts = reminders
      .filter((r) => allowedEvents.includes(r.event))
      .flatMap((r) => {
        const alert = toAlert(r, pathname);
        return alert ? [alert] : [];
      });

    if (pathname.startsWith(ROUTES.DASHBOARD)) {
      const sorted = [...alerts].sort(
        (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
      );
      const payment = sorted.filter((a) => a.type === ReminderEvent.PAYMENT_FAILED);
      const others = sorted.filter((a) => a.type !== ReminderEvent.PAYMENT_FAILED);
      return [...payment, ...others].slice(0, 3);
    }

    return alerts;
  }, [reminders, pathname]);
}

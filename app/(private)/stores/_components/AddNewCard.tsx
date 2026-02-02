'use client';

import { useState } from 'react';

import { Plus } from 'lucide-react';

import {
  AddNewStoreFormModal,
  RecommandPlanUpgradeModal,
  VerificationRequiredModal,
} from '@/components/modal';
import { Card } from '@/components/ui/card';
import { dummySubscription } from '@/dummy/subscription';
import { UserStore } from '@/store/userStore';

type ActiveModal = 'verification' | 'limitExceeded' | 'addNewStore' | null;

const AddNewCard = () => {
  const [activeModal, setActiveModal] = useState<ActiveModal>(null);
  const user = UserStore.useUser();

  const handleNewCardClick = () => {
    const isVerified = user?.isVerified;
    const storeLimitExceeded =
      dummySubscription.storeQuotaUsed >= dummySubscription.storeQuotaTotal;

    if (!isVerified) {
      // 본인 인증 미완료시
      setActiveModal('verification');
    } else if (storeLimitExceeded) {
      // 쇼핑몰 수 한도 초과시
      setActiveModal('limitExceeded');
    } else {
      // 그렇지 않으면 새 쇼핑몰 등록 팝업
      setActiveModal('addNewStore');
    }
  };

  return (
    <Card className='group outline-border bg-zinc-300/10 ring-0 outline-[1.5px] transition-all duration-200 ease-out outline-dashed hover:rotate-1 hover:shadow-lg active:rotate-3'>
      <button
        onClick={handleNewCardClick}
        className='flex h-full w-full items-center justify-center'
      >
        <div className='flex h-16 w-16 items-center justify-center rounded-full border border-gray-200 bg-white/50'>
          <Plus className='h-6 w-6 text-gray-400' />
        </div>
      </button>

      <VerificationRequiredModal
        open={activeModal === 'verification'}
        onOpenChange={(open) => !open && setActiveModal(null)}
      />
      <RecommandPlanUpgradeModal
        open={activeModal === 'limitExceeded'}
        onOpenChange={(open) => !open && setActiveModal(null)}
      />
      <AddNewStoreFormModal
        open={activeModal === 'addNewStore'}
        onOpenChange={(open) => !open && setActiveModal(null)}
      />
    </Card>
  );
};

export default AddNewCard;

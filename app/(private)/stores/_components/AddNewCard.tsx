'use client';

import { useState } from 'react';

import { Plus } from 'lucide-react';

import {
  AddNewStoreFormModal,
  RecommandPlanUpgradeModal,
  VerificationRequiredModal,
} from '@/components/modal';
import { Card } from '@/components/ui/card';
import { useUser } from '@/hooks/useUser';

type ActiveModal = 'verification' | 'limitExceeded' | 'addNewStore' | null;

interface AddNewCardProps {
  storeLimitExceeded: boolean;
}

const AddNewCard = ({ storeLimitExceeded }: AddNewCardProps) => {
  const [activeModal, setActiveModal] = useState<ActiveModal>(null);
  const { data: user } = useUser();

  const handleNewCardClick = () => {
    const isVerified = user?.isVerified;

    if (!isVerified) {
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
        title='쇼핑몰 등록'
        description={`등록 가능한 쇼핑몰 한도를 초과했습니다.\n더 많은 쇼핑몰을 연동하려면 플랜을 업그레이드 해주세요.`}
        open={activeModal === 'limitExceeded'}
        onOpenChange={(open) => !open && setActiveModal(null)}
      />
      {activeModal === 'addNewStore' && (
        <AddNewStoreFormModal
          open={activeModal === 'addNewStore'}
          onOpenChange={(open) => !open && setActiveModal(null)}
        />
      )}
    </Card>
  );
};

export default AddNewCard;

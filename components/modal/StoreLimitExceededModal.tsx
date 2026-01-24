// 쇼핑몰 수 강제 조정 모달
import { Controller } from 'react-hook-form';
import { useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { StoreLimitedFormData, storeLimitedSchema } from '@/lib/validation';
import { StoreDto } from '@/types';

import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import { Field, FieldGroup, FieldLabel } from '../ui/field';
import { CommonModalProps } from './types';

interface ModalProps extends CommonModalProps {
  stores: StoreDto[]; // 현재 연동 중인 쇼핑몰 목록
  maxAllowed: number; // 변경될 플랜의 최대 허용 개수
}

const Modal = ({ open, onOpenChange, stores, maxAllowed }: ModalProps) => {
  const form = useForm<StoreLimitedFormData>({
    resolver: zodResolver(storeLimitedSchema(maxAllowed)),
    defaultValues: {
      storeIds: [],
    },
  });

  const selectedStoreIds = form.watch('storeIds');

  const handleCheckboxChange = (storeId: string, checked: boolean) => {
    const currentIds = selectedStoreIds;

    if (checked) {
      // 체크 시도
      if (currentIds.length >= maxAllowed) {
        // 한도 초과 - 토스트 표시 및 체크 차단
        toast.error(`최대 ${maxAllowed}개까지만 선택 가능합니다.`);
        return;
      }
      form.setValue('storeIds', [...currentIds, storeId]);
    } else {
      // 체크 해제
      form.setValue(
        'storeIds',
        currentIds.filter((id) => id !== storeId)
      );
    }
  };

  const handleSaveSelection = (data: StoreLimitedFormData) => {
    console.log('data: ', data);
    // TODO: API 호출로 선택된 쇼핑몰만 활성 상태 유지
    console.log('Selected store IDs:', data.storeIds);
    toast.success('선택한 쇼핑몰이 유지됩니다.');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* <form onSubmit={form.handleSubmit(handleSaveSelection)}> */}
      <DialogContent className='p-0'>
        <form
          onSubmit={form.handleSubmit(handleSaveSelection)}
          className='flex flex-col gap-6 p-6'
        >
          <DialogHeader>
            <DialogTitle className='typo-heading-20!'>쇼핑몰 선택</DialogTitle>
            <DialogDescription className='mx-auto text-center'>{`구독 플랜 변경으로 연동 가능한 쇼핑몰 수를 초과했습니다.\n계속해서 관리할 쇼핑몰을 선택해 주세요.`}</DialogDescription>
          </DialogHeader>

          <div className='max-h-[400px] overflow-y-auto'>
            <FieldGroup data-slot='checkbox-group' className='rounded-xl p-3'>
              {stores.map((store) => {
                const storeId = store.id.toString();

                return (
                  <Field key={storeId} orientation='horizontal'>
                    <Checkbox
                      id={'checkbox_' + storeId}
                      checked={selectedStoreIds.includes(storeId)}
                      onCheckedChange={(checked) =>
                        handleCheckboxChange(storeId, checked)
                      }
                    />

                    <FieldLabel
                      htmlFor={'checkbox_' + storeId}
                      className='ml-1.5'
                    >
                      <div className='flex flex-col'>
                        <span className='typo-body-16 text-warmgray-900 font-medium'>
                          {store.name}
                        </span>
                        <span className='typo-body-14 text-warmgray-600'>
                          {store.url}
                        </span>
                      </div>
                    </FieldLabel>
                  </Field>
                );
              })}
            </FieldGroup>
          </div>

          <DialogFooter>
            <Button
              disabled={
                // selectedStoreIds.length === 0 ||
                selectedStoreIds.length > maxAllowed
              }
              className='w-full'
            >
              선택한 쇼핑몰 유지하기
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default Modal;

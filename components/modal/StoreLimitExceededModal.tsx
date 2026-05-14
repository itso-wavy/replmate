// 쇼핑몰 수 강제 조정 모달
import { useForm } from 'react-hook-form';

import { Dialog as DialogPrimitive } from '@base-ui/react/dialog';
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
import { useUpdateStoresBulk } from '@/hooks/useStores';
import { cn } from '@/lib/utils';
import { StoreLimitedFormData, storeLimitedSchema } from '@/lib/validation';
import { StoreDomain } from '@/types';

import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import { Field, FieldGroup, FieldLabel } from '../ui/field';
import { CommonModalProps } from './types';

interface ModalProps extends CommonModalProps {
  stores: StoreDomain[]; // 현재 연동 중인 쇼핑몰 목록
  maxAllowed: number; // 변경될 플랜의 최대 허용 개수
}

const Modal = ({ open, onOpenChange, stores, maxAllowed }: ModalProps) => {
  const { mutateAsync: updateStoresBulk, isPending } = useUpdateStoresBulk();

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

  const handleSaveSelection = async (data: StoreLimitedFormData) => {
    // 미선택된 쇼핑몰을 비활성화 예정으로 업데이트
    const selectedIds = data.storeIds.map(Number);
    const unselectedIds = stores
      .map((s) => s.id)
      .filter((id) => !selectedIds.includes(id));

    try {
      await updateStoresBulk({
        storeIds: unselectedIds,
        status: 'deactivating',
      });
      toast.success('선택한 쇼핑몰이 유지됩니다.');
      onOpenChange(false);
    } catch {
      toast.error('저장에 실패했습니다. 잠시 후 다시 시도해 주세요.');
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen, eventDetails) => {
        // isOpen: 열릴 때, !isOpen: 닫힐 때
        if (eventDetails.reason !== 'close-press') return;
        onOpenChange(isOpen);
      }}
    >
      <DialogContent className='p-0'>
        <form
          onSubmit={form.handleSubmit(handleSaveSelection)}
          className='flex flex-col gap-6 p-6'
        >
          <DialogHeader>
            <DialogTitle className='typo-heading-20!'>쇼핑몰 선택</DialogTitle>
            <DialogDescription className='mx-auto text-center'>{`구독 플랜 변경으로 연동 가능한 쇼핑몰 수를 초과했습니다.\n계속해서 관리할 쇼핑몰을 선택해 주세요.\n(승인 대기 중인 쇼핑몰은 자동으로 유지됩니다.)`}</DialogDescription>
          </DialogHeader>

          <div className='max-h-[80vh] overflow-y-auto md:max-h-[400px]'>
            <FieldGroup
              data-slot='checkbox-group'
              className='gap-y-3! rounded-xl p-3'
            >
              {stores.map((store) => {
                const storeId = store.id.toString();

                return (
                  <Field
                    key={storeId}
                    orientation='horizontal'
                    className={cn(
                      'rounded-sm border border-gray-200 bg-white p-3',
                      selectedStoreIds.includes(storeId) && 'border-brand-200'
                    )}
                  >
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
                        <span className='truncate'>{store.name}</span>
                        <span className='text-foreground-description-muted'>
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
              disabled={selectedStoreIds.length > maxAllowed || isPending}
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

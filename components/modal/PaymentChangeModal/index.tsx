'use client';

import { Controller } from 'react-hook-form';

import { CreditCard, Info } from 'lucide-react';

import { RequiredMark } from '@/components/global';
import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldMessage,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { formatCardNumber, formatExpiry } from '@/lib/utils';

import { CommonModalProps } from '../types';
import { usePaymentChangeForm } from './hook';

const Modal = ({ open, onOpenChange }: CommonModalProps) => {
  const {
    form,
    handleClose,
    handleCardNumberChange,
    handleExpiryChange,
    handleCvcChange,
    handleCardHolderChange,
    onSubmit,
  } = usePaymentChangeForm({
    onClose: () => onOpenChange(false),
  });

  return (
    <Dialog
      open={open}
      onOpenChange={(_, eventDetails) => {
        if (eventDetails.reason !== 'close-press') return;
        handleClose();
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle className='typo-heading-20!'>결제 정보 변경</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            {/* 안내 배너 */}
            <Alert className='border-brand-100 bg-gray-50 whitespace-pre-line'>
              <Info />
              {`결제 정보를 변경하면 즉시 재결제됩니다.\n잔액이 충분한지 미리 확인해 주세요.`}
            </Alert>

            {/* 카드 번호 */}
            <Controller
              name='cardNumber'
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel htmlFor={field.name}>
                    카드 번호
                    <RequiredMark />
                  </FieldLabel>
                  <div className='relative flex items-center'>
                    <span className='text-muted-foreground absolute left-3 flex items-center'>
                      <CreditCard className='size-4 shrink-0' />
                    </span>
                    <Input
                      id={field.name}
                      name={field.name}
                      className='pl-9'
                      aria-invalid={fieldState.invalid}
                      placeholder='0000 0000 0000 0000'
                      autoComplete='cc-number'
                      inputMode='numeric'
                      value={formatCardNumber(field.value)}
                      onChange={handleCardNumberChange}
                      onBlur={field.onBlur}
                    />
                  </div>
                  <FieldMessage variant='error' messages={[fieldState.error]} />
                </Field>
              )}
            />

            {/* 유효기간 + CVC */}
            <div className='grid grid-cols-2 gap-4'>
              {/* 유효기간 */}
              <Controller
                name='expiry'
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel htmlFor={field.name}>
                      유효기간 (MM/YY)
                      <RequiredMark />
                    </FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      aria-invalid={fieldState.invalid}
                      placeholder='MM/YY'
                      autoComplete='cc-exp'
                      inputMode='numeric'
                      value={formatExpiry(field.value)}
                      onChange={handleExpiryChange}
                      onBlur={field.onBlur}
                    />
                    <FieldMessage
                      variant='error'
                      messages={[fieldState.error]}
                    />
                  </Field>
                )}
              />

              {/* CVC */}
              <Controller
                name='cvc'
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel htmlFor={field.name}>
                      CVC
                      <RequiredMark />
                    </FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      type='password'
                      aria-invalid={fieldState.invalid}
                      placeholder='123'
                      autoComplete='cc-csc'
                      inputMode='numeric'
                      value={field.value}
                      onChange={handleCvcChange}
                      onBlur={field.onBlur}
                    />
                    <FieldMessage
                      variant='error'
                      messages={[fieldState.error]}
                    />
                  </Field>
                )}
              />
            </div>

            {/* 카드 소유주 이름 */}
            <Controller
              name='cardHolder'
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel htmlFor={field.name}>
                    카드 소유주 이름
                    <RequiredMark />
                  </FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    placeholder='HONG GILDONG'
                    autoComplete='cc-name'
                    onChange={handleCardHolderChange}
                  />
                  <FieldMessage variant='error' messages={[fieldState.error]} />
                </Field>
              )}
            />

            {/* 안내 메시지 */}
            <FieldDescription className='text-foreground border-t pt-3 text-center whitespace-pre-line'>
              {`입력하신 정보는 암호화되어 안전하게 처리되며,\n서버에 저장되지 않습니다.`}
            </FieldDescription>

            <DialogFooter>
              <Button
                type='button'
                variant='outline'
                className='flex-1'
                disabled={form.formState.isSubmitting}
                onClick={handleClose}
              >
                취소
              </Button>
              <Button
                type='submit'
                className='flex-1'
                disabled={!form.formState.isValid || form.formState.isSubmitting}
              >
                변경하기
              </Button>
            </DialogFooter>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default Modal;

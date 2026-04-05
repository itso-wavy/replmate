'use client';

import { Controller } from 'react-hook-form';

import { RequiredMark } from '@/components/global';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { usePlatforms } from '@/hooks/useStores';
import { PlatformType } from '@/types';

import { CommonModalProps } from '../types';
import { FileUploadField } from './components';
import { useAddNewStoreForm } from './hook';

const getPlatformUiConfig = (value: string) => {
  switch (value) {
    case PlatformType.NAVER_SMART_STORE:
      return {
        label: '네이버 스마트스토어',
        itemStyle: 'text-smart-store-theme focus:*:text-smart-store-theme!',
        triggerStyle: 'bg-smart-store-theme/8',
      };
    case PlatformType.NAVER_BRAND_STORE:
      return {
        label: '네이버 브랜드스토어',
        itemStyle: 'text-brand-store-theme focus:*:text-brand-store-theme!',
        triggerStyle: 'bg-brand-store-theme/8',
      };
    default:
      return { label: value, itemStyle: '', triggerStyle: '' };
  }
};

const Modal = ({ open, onOpenChange }: CommonModalProps) => {
  const { data: platforms = [] } = usePlatforms();
  const {
    form,
    uploadedFiles,
    fileInputRef,
    handleNameInputChange,
    handleUrlChange,
    handleDuplicateCheck,
    handleUploadCertification,
    handleFileDrop,
    handleFileChange,
    handleRemoveFile,
    onInvalid,
    onSubmit,
  } = useAddNewStoreForm({
    closeModal: () => onOpenChange(false), // 모달 닫기
  });

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen, eventDetails) => {
        // isOpen: 열릴 때, !isOpen: 닫힐 때
        if (eventDetails.reason !== 'close-press') return;
        onOpenChange(isOpen);
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle className='typo-heading-20!'>쇼핑몰 등록</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit, onInvalid)}>
          <FieldGroup>
            {/* 별칭 입력 필드 */}
            <Controller
              name='name'
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel htmlFor={field.name}>
                    별칭(2-15자)
                    <RequiredMark />
                  </FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    maxLength={15}
                    autoComplete='off'
                    placeholder='예: 메인 쇼핑몰'
                    onChange={handleNameInputChange}
                  />
                  <FieldMessage variant='error' messages={[fieldState.error]} />
                </Field>
              )}
            />

            {/* 플랫폼 선택 필드 */}
            <Controller
              name='platform'
              control={form.control}
              render={({ field, fieldState }) => {
                const selectedConfig = field.value
                  ? getPlatformUiConfig(field.value)
                  : null;

                return (
                  <Field>
                    <FieldLabel htmlFor={field.name}>
                      플랫폼
                      <RequiredMark />
                    </FieldLabel>

                    <Select
                      {...field}
                      name={field.name}
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger
                        id={field.name}
                        aria-invalid={fieldState.invalid}
                        className={field.value && selectedConfig?.triggerStyle}
                      >
                        <SelectValue placeholder='쇼핑몰을 선택해 주세요'>
                          {!field.value
                            ? '쇼핑몰을 선택해 주세요'
                            : selectedConfig?.label}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {platforms.map((platformValue) => {
                          const config = getPlatformUiConfig(platformValue);
                          return (
                            <SelectItem
                              key={platformValue}
                              value={platformValue}
                              className={config.itemStyle}
                            >
                              {config.label}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                    <FieldMessage
                      variant='error'
                      messages={[fieldState.error]}
                    />
                  </Field>
                );
              }}
            />

            {/* URL 입력 필드 + 중복 확인 버튼 */}
            <Controller
              name='url'
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel htmlFor={field.name}>
                    URL
                    <RequiredMark />
                  </FieldLabel>
                  <div className='flex items-center gap-2'>
                    <Input
                      {...field}
                      id={field.name}
                      aria-invalid={fieldState.invalid}
                      maxLength={100}
                      placeholder='/ 이후 주소를 입력해 주세요'
                      onChange={handleUrlChange}
                    />
                    <Button
                      type='button'
                      variant='secondary'
                      className='h-9!'
                      disabled={fieldState.invalid}
                      onClick={handleDuplicateCheck}
                    >
                      {form.watch('isUrlAvailable') ? '확인 완료' : '중복 확인'}
                    </Button>
                  </div>
                  <FieldMessage variant='error' messages={[fieldState.error]} />
                  {form.watch('isUrlAvailable') !== undefined && (
                    <FieldMessage
                      variant={
                        form.watch('isUrlAvailable') ? 'success' : 'error'
                      }
                      messages={[
                        form.formState.errors.isUrlAvailable || {
                          message: '사용 가능한 URL 입니다',
                        },
                      ]}
                    />
                  )}
                </Field>
              )}
            />

            {/* 파일 업로드 필드 */}
            <Controller
              name='certification'
              control={form.control}
              render={({
                // field: { value, onChange, ...fieldProps },
                field,
                fieldState,
              }) => (
                <FileUploadField
                  field={field}
                  fieldState={fieldState}
                  fileInputRef={fileInputRef}
                  uploadedFiles={uploadedFiles}
                  onUploadClick={handleUploadCertification}
                  onFileDrop={handleFileDrop}
                  onFileChange={handleFileChange}
                  onRemoveFile={handleRemoveFile}
                />
              )}
            />

            {/* 안내 메시지 */}
            <FieldDescription className='text-foreground text-center'>
              제출하신 정보와 인증 파일은 검토 후 최대 24시간 내 승인됩니다.
            </FieldDescription>

            {/* 제출 버튼 */}
            <Button type='submit' disabled={form.formState.isSubmitting}>
              등록하기
            </Button>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default Modal;

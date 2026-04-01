import { ControllerRenderProps, FieldError } from 'react-hook-form';

import { CloudUpload, X } from 'lucide-react';

import { RequiredMark } from '@/components/global';
import {
  Field,
  FieldDescription,
  FieldLabel,
  FieldMessage,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { AddNewStoreFormData } from '@/lib/validation';

interface FileUploadFieldProps {
  field: ControllerRenderProps<AddNewStoreFormData, 'certification'>;
  fieldState: { invalid: boolean; error?: FieldError };
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  uploadedFiles: File[];
  onUploadClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onFileDrop: (e: React.DragEvent<HTMLButtonElement>) => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveFile: (index: number) => void;
}

export const FileUploadField = ({
  field,
  fieldState,
  fileInputRef,
  uploadedFiles,
  onUploadClick,
  onFileDrop,
  onFileChange,
  onRemoveFile,
}: FileUploadFieldProps) => {
  return (
    <Field>
      <FieldLabel htmlFor={field.name} onClick={(e) => e.preventDefault()}>
        관리자 인증 파일
        <RequiredMark />
      </FieldLabel>
      <FieldDescription className='-mt-2'>
        (사업자 등록증 또는 관리자 화면 캡처)
      </FieldDescription>

      {/* 파일 업로드 버튼 영역 */}
      <button
        type='button'
        onClick={onUploadClick}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => onFileDrop(e)}
        className='w-full rounded-sm border border-dashed border-gray-300 bg-gray-50 p-6 text-center transition hover:bg-gray-100'
      >
        <div className='typo-body-14 flex items-center justify-center text-gray-700'>
          <CloudUpload className='mr-1.5 size-4 text-gray-400' />
          파일을 업로드 해주세요
        </div>
        <div className='typo-caption-12 mt-1 text-gray-400'>
          최대 5MB, JPEG/PNG/PDF
        </div>
      </button>

      {/* Hidden file input */}
      <Input
        ref={fileInputRef}
        type='file'
        id={field.name}
        accept='image/jpeg,image/png,application/pdf'
        multiple
        onChange={onFileChange}
        className='hidden'
      />

      {/* 업로드된 파일 목록 */}
      {uploadedFiles.length > 0 && (
        <div className='mt-2 space-y-2'>
          {uploadedFiles.map((file, index) => (
            <div
              key={index}
              className='flex items-center justify-between rounded-sm border border-gray-200 bg-white p-3'
            >
              <span className='typo-body-14 flex-1 truncate text-gray-800'>
                {file.name}
              </span>
              <button
                type='button'
                onClick={() => onRemoveFile(index)}
                className='hover:text-brand-sun ml-2 p-0.5 text-gray-400'
              >
                <X className='size-4.5' />
              </button>
            </div>
          ))}
        </div>
      )}

      <FieldMessage variant='error' messages={[fieldState.error]} />
    </Field>
  );
};

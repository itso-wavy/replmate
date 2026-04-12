import { useRef, useState } from 'react';

import { FieldErrors, useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

import { PLATFORM_TYPE_CONFIG } from '@/constants/platform';
import {
  useCheckStoreUrl,
  useCreateStore,
  useGetPresignedUrl,
} from '@/hooks/useStores';
import { AddNewStoreFormData, addNewStoreSchema } from '@/lib/validation';
import { PlatformType } from '@/types';

interface UseAddNewStoreFormProps {
  closeModal: () => void; // 모달을 닫는 콜백
}

export const useAddNewStoreForm = ({ closeModal }: UseAddNewStoreFormProps) => {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const checkUrlMutation = useCheckStoreUrl();
  const getPresignedUrlMutation = useGetPresignedUrl();
  const createStoreMutation = useCreateStore();

  const form = useForm<AddNewStoreFormData>({
    resolver: zodResolver(addNewStoreSchema),
    mode: 'onBlur',
    reValidateMode: 'onChange',
    defaultValues: {
      name: '',
      platformType: undefined,
      url: '',
      isUrlAvailable: undefined,
      certification: [],
    },
  });

  /**
   * 별칭(name) 입력 핸들러
   * 한글, 영문, 숫자, 하이픈(-), 언더스코어(_), 괄호, 공백만 입력 가능
   * 그 외 문자 키 입력 시 화면에 입력되지 않음
   */
  const handleNameInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const filtered = value.replace(/[^가-힣ㄱ-ㅎㅏ-ㅣa-zA-Z0-9\-_() ]/g, '');

    form.setValue('name', filtered, { shouldValidate: true });
  };

  /**
   * URL 입력 핸들러
   * 영문, 숫자, 하이픈(-), 언더스코어(_)만 입력 가능
   * 그 외 문자 키 입력 시 화면에 입력되지 않음
   * URL 변경 시 중복 확인 상태 초기화
   */
  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^a-zA-Z0-9\-_]/g, '');

    form.setValue('url', value, { shouldValidate: true });
    form.setValue('isUrlAvailable', undefined);
    form.clearErrors('isUrlAvailable');
  };

  /**
   * URL 중복 확인 핸들러
   * 클릭 시 입력된 URL의 유효성 및 시스템 내 중복 여부 검증
   * 검증 결과를 입력창 하단 텍스트로 노출
   * - 사용 가능한 URL입니다(초록 글씨)
   * - 이미 등록된 URL입니다(빨간 글씨)
   */
  const getPlatformConfig = (platformType: PlatformType) =>
    PLATFORM_TYPE_CONFIG[platformType] ?? null;

  const handleDuplicateCheck = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();

    // URL 필드가 유효하지 않다면 리턴
    if (form.getFieldState('url').invalid) return;

    const baseUrl =
      getPlatformConfig(form.getValues('platformType') as PlatformType)
        ?.baseUrl ?? '';
    const url = baseUrl + form.getValues('url');

    form.clearErrors('isUrlAvailable');

    try {
      const result = await checkUrlMutation.mutateAsync(url);
      // exists: true → 이미 등록된 URL
      form.setValue('isUrlAvailable', !result.exists, { shouldValidate: true });
      if (result.exists) {
        form.setError('isUrlAvailable', { message: '이미 등록된 URL입니다' });
      }
    } catch {
      toast.error('중복 확인 중 오류가 발생했습니다.');
    }
  };

  /**
   * 파일 업로드 버튼 클릭 핸들러
   * hidden file input을 트리거하여 파일 탐색기 호출
   */
  const handleUploadCertification = (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();

    fileInputRef.current?.click();
  };

  /**
   * 파일 검증 및 추가 공통 로직
   * JPEG/PNG/PDF, 건당 5MB 이하, 최대 3개까지 업로드 가능
   * 규격 위반 시 업로드 차단 및 에러 토스트 표시
   */
  const validateAndAddFiles = (files: File[]) => {
    // 파일 개수 검증
    if (uploadedFiles.length + files.length > 3) {
      toast.error('최대 3개까지만 등록 가능합니다.');
      return;
    }

    // 각 파일 검증
    for (const file of files) {
      // 형식 검증
      const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        toast.error('지원하지 않는 파일 형식입니다. (JPEG, PNG, PDF만 가능)');
        return;
      }

      // 용량 검증 (5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('파일 용량이 5MB를 초과했습니다.');
        return;
      }

      const isDuplicate = uploadedFiles.some(
        (uploaded) => uploaded.name === file.name && uploaded.size === file.size
      );
      if (isDuplicate) {
        toast.error('이미 등록된 파일입니다.');
        return;
      }
    }

    // 검증 통과 시 파일 추가
    const newFiles = [...uploadedFiles, ...files];
    setUploadedFiles(newFiles);
    form.setValue('certification', newFiles, { shouldValidate: true });
  };

  /**
   * 파일 드래그 앤 드롭 핸들러
   */
  const handleFileDrop = (e: React.DragEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const files = Array.from(e.dataTransfer.files);
    validateAndAddFiles(files);
  };

  /**
   * 파일 선택 핸들러 (input change)
   */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    validateAndAddFiles(files);

    // input 초기화
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  /**
   * 파일 삭제 핸들러
   * X 버튼 클릭 시 해당 파일을 업로드 목록에서 제거
   */
  const handleRemoveFile = (index: number) => {
    const newFiles = uploadedFiles.filter((_, i) => i !== index);
    setUploadedFiles(newFiles);
    form.setValue('certification', newFiles, { shouldValidate: true });
  };

  /**
   * 폼 유효성 검증 실패 핸들러
   * - 서버측 유효성 에러(maxLength, regex)와 필수 항목 누락을 구분하여 토스트 노출
   */
  const onInvalid = (errors: FieldErrors<AddNewStoreFormData>) => {
    // 서버측 유효성 에러 우선 확인
    if (errors.name?.type === 'too_big') {
      toast.error('최대 15자까지 입력 가능합니다.');
      return;
    }
    if (
      errors.name?.type === 'invalid_string' ||
      errors.url?.type === 'invalid_string'
    ) {
      toast.error('허용되지 않은 문자가 포함되어 있습니다.');
      return;
    }
  };

  /**
   * 폼 제출 핸들러
   * 1. presigned URL 발급 → S3 직접 업로드 → imageKey 획득
   * 2. 스토어 생성 API 호출 (verificationImageKey 포함)
   * 3. 성공 시: '쇼핑몰 등록이 완료되었습니다.' 토스트 + 모달 닫기 + 폼 초기화
   * 4. 실패 시: 토스트
   */
  const onSubmit = async (data: AddNewStoreFormData) => {
    if (data.isUrlAvailable !== true) {
      form.setError('isUrlAvailable', {
        message: 'URL 중복 확인이 필요합니다',
      });
      return;
    }

    try {
      // 1. presigned URL 발급 + S3 직접 업로드
      const file = uploadedFiles[0];
      const { uploadUrl, imageKey } = await getPresignedUrlMutation.mutateAsync(
        {
          filename: file.name,
          contentType: file.type,
        }
      );

      // S3에 직접 PUT (Axios 인터셉터 제외)
      await fetch(uploadUrl, {
        method: 'PUT',
        body: file,
        headers: { 'Content-Type': file.type },
      });

      const config = getPlatformConfig(data.platformType as PlatformType);

      // 2. 스토어 생성
      await createStoreMutation.mutateAsync({
        name: data.name,
        url: (config?.baseUrl ?? '') + data.url,
        platform: config?.platform ?? '',
        platformType: data.platformType,
        verificationImageKey: imageKey,
      });

      // 3. 성공 처리
      toast.success('쇼핑몰 등록이 완료되었습니다.');
      closeModal();
      form.reset();
      setUploadedFiles([]);
    } catch {
      toast.error(
        '일시적인 오류로 등록에 실패했습니다.\n잠시 후 다시 시도해 주세요.'
      );
    }
  };

  return {
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
  };
};

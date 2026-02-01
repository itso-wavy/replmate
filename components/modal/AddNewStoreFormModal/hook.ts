import { useRef, useState } from 'react';

import { FieldErrors, useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { z } from 'zod';

import api from '@/lib/api';
import { ENDPOINTS } from '@/lib/endpoints';
import { AddNewStoreFormData, addNewStoreSchema } from '@/lib/validation';

interface UseAddNewStoreFormProps {
  closeModal: () => void; // 모달을 닫는 콜백
}

export const useAddNewStoreForm = ({ closeModal }: UseAddNewStoreFormProps) => {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<AddNewStoreFormData>({
    resolver: zodResolver(addNewStoreSchema),
    mode: 'onBlur',
    reValidateMode: 'onChange',
    defaultValues: {
      name: '',
      platform: '',
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

    form.setValue('name', filtered);
  };

  /**
   * URL 입력 핸들러
   * 영문, 숫자, 하이픈(-), 언더스코어(_)만 입력 가능
   * 그 외 문자 키 입력 시 화면에 입력되지 않음
   * URL 변경 시 중복 확인 상태 초기화
   */
  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^a-zA-Z0-9\-_]/g, '');

    form.setValue('url', value);
    form.setValue('isUrlAvailable', undefined);
    form.setError('isUrlAvailable', { message: '' });
  };

  /**
   * URL 중복 확인 핸들러
   * 클릭 시 입력된 URL의 유효성 및 시스템 내 중복 여부 검증
   * 검증 결과를 입력창 하단 텍스트로 노출
   * - 사용 가능한 URL입니다(초록 글씨)
   * - 이미 등록된 URL입니다(빨간 글씨)
   */
  const handleDuplicateCheck = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();

    // URL 필드가 유효하지 않다면 리턴
    if (form.getFieldState('url').invalid) return;

    const platform = form.getValues('platform');
    const url = form.getValues('url');

    // TODO: API 통신 임시 주석 처리 (테스트용)
    form.setValue('isUrlAvailable', true, { shouldValidate: true });

    // try {
    //   // API 호출: 중복 확인
    //   const response = await api.post(ENDPOINTS.STORE.CHECK_STORE_URL, {
    //     platform,
    //     url,
    //   });

    //   if (response.data.available) {
    // form.setValue('isUrlAvailable', true, { shouldValidate: true });
    //   } else {
    // form.setValue('isUrlAvailable', false, { shouldValidate: true });
    //   }
    // } catch (error: any) {
    //   toast(
    //     error.response?.data?.message || '중복 확인 중 에러가 발생했습니다'
    //   );
    // }
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
   * 1. 스토어 생성 API 호출
   * 2. 인증 파일 업로드 (있을 경우)
   * 3. 성공 시: '쇼핑몰 등록이 완료되었습니다.' 토스트 + 모달 닫기 + 폼 초기화
   * 4. 실패 시: '일시적인 오류로 등록에 실패했습니다.\n잠시 후 다시 시도해주세요.' 토스트
   */
  const onSubmit = async (data: AddNewStoreFormData) => {
    try {
      // TODO: API 통신 임시 주석 처리 (테스트용)
      // // 1. 스토어 아이템 생성 API 호출
      // const response = await api.post(ENDPOINTS.STORE.CREATE_STORE, {
      //   name: data.name,
      //   platform: data.platform,
      //   url: data.url,
      // });

      // const storeId = response.data.id;

      // // 2. 인증 파일 업로드 (있을 경우)
      // if (uploadedFiles.length > 0) {
      //   const formData = new FormData();
      //   uploadedFiles.forEach((file) => {
      //     formData.append('files', file);
      //   });

      //   await api.post(
      //     ENDPOINTS.STORE.UPLOAD_VERIFICATION_IMAGE(storeId),
      //     formData,
      //     {
      //       headers: {
      //         'Content-Type': 'multipart/form-data',
      //       },
      //     }
      //   );
      // }

      // 3. 성공 처리
      toast.success('쇼핑몰 등록이 완료되었습니다.');
      closeModal();
      form.reset(); // 폼 초기화
      setUploadedFiles([]); // 파일 초기화
    } catch (error: any) {
      // 4. 실패 처리 - 모달 유지
      console.error('스토어 등록 실패:', error);

      const serverMessage = error.response?.data?.message;

      if (serverMessage?.includes('자까지')) {
        toast.error(serverMessage);
      } else if (serverMessage?.includes('허용되지 않은')) {
        toast.error(serverMessage);
      } else {
        toast.error(
          '일시적인 오류로 등록에 실패했습니다.\n잠시 후 다시 시도해주세요.'
        );
      }
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

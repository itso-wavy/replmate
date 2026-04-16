import { useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { z } from 'zod';

const now = new Date();
const currentYear = now.getFullYear() % 100; // 2자리 연도
const currentMonth = now.getMonth() + 1;

export const paymentChangeSchema = z.object({
  // 카드 번호: 숫자만, 16자
  cardNumber: z
    .string()
    .min(16, '숫자 16자리를 입력해 주세요')
    .max(16, '숫자 16자리를 입력해 주세요')
    .regex(/^\d{16}$/, '허용되지 않은 문자가 포함되어 있습니다'),

  // 유효기간: MMYY 형식 (내부 저장값)
  expiry: z
    .string()
    .min(4, '숫자 4자리를 입력해 주세요')
    .max(4, '숫자 4자리를 입력해 주세요')
    .regex(/^\d{4}$/, '허용되지 않은 문자가 포함되어 있습니다')
    .refine((val) => {
      const month = parseInt(val.slice(0, 2), 10);
      const year = parseInt(val.slice(2, 4), 10);
      if (month < 1 || month > 12) return false;
      if (year > currentYear) return true;
      if (year === currentYear && month >= currentMonth) return true;
      return false;
    }, '유효하지 않은 유효기간입니다'),

  // CVC: 숫자만, 3-4자
  cvc: z
    .string()
    .min(3, '숫자 3자리 이상 입력해 주세요')
    .max(4, '최대 4자까지 입력 가능합니다')
    .regex(/^\d{3,4}$/, '허용되지 않은 문자가 포함되어 있습니다'),

  // 카드 소유주 이름: 영문만, 2-50자
  cardHolder: z
    .string()
    .trim()
    .min(2, '2자 이상 입력해 주세요')
    .max(50, '최대 50자까지 입력 가능합니다')
    .regex(/^[a-zA-Z ]+$/, '허용되지 않은 문자가 포함되어 있습니다'),
});

export type PaymentChangeFormData = z.infer<typeof paymentChangeSchema>;

interface UsePaymentChangeFormProps {
  onClose: () => void;
}

export const usePaymentChangeForm = ({ onClose }: UsePaymentChangeFormProps) => {
  const form = useForm<PaymentChangeFormData>({
    resolver: zodResolver(paymentChangeSchema),
    mode: 'onBlur',
    reValidateMode: 'onChange',
    defaultValues: {
      cardNumber: '',
      expiry: '',
      cvc: '',
      cardHolder: '',
    },
  });

  const handleClose = () => {
    onClose();
    form.reset();
  };

  /**
   * 카드 번호 입력 핸들러
   * 숫자만 허용, 최대 16자, 4자리마다 공백 표시 (표시용 변환은 컴포넌트에서 처리)
   */
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, '').slice(0, 16);
    form.setValue('cardNumber', digits);
  };

  /**
   * 유효기간 입력 핸들러
   * 숫자만 허용, MM/YY 자동 포맷 (표시용), 내부값은 MMYY
   */
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, '').slice(0, 4);
    form.setValue('expiry', digits, { shouldValidate: true });
  };

  /**
   * CVC 입력 핸들러
   * 숫자만 허용, 최대 4자
   */
  const handleCvcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, '').slice(0, 4);
    form.setValue('cvc', digits);
  };

  /**
   * 카드 소유주 이름 입력 핸들러
   * 영문만 허용, 자동 대문자 변환
   */
  const handleCardHolderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
      .replace(/[^a-zA-Z ]/g, '')
      .toUpperCase()
      .slice(0, 50);
    form.setValue('cardHolder', value, { shouldValidate: true });
  };

  /**
   * 폼 제출 핸들러
   * TODO: 결제 정보 변경 API 연동 (API 개발 후 구현)
   * 1. 카드 정보를 PG사로 전송 → 빌링키 발급 → 서버 저장
   * 2. 결제 정보 변경 안내 토스트 노출
   */
  const onSubmit = async (_data: PaymentChangeFormData) => {
    try {
      // TODO: API 연동
      // await changePaymentMethod({ cardNumber, expiry, cvc, cardHolder });

      handleClose();
      toast.success(
        '결제 정보 변경이 완료되었습니다.\n다음 결제일부터 적용됩니다.'
      );
    } catch {
      toast.error(
        '일시적인 오류로 변경에 실패했습니다. 잠시 후 다시 시도해주세요.'
      );
    }
  };

  return {
    form,
    handleClose,
    handleCardNumberChange,
    handleExpiryChange,
    handleCvcChange,
    handleCardHolderChange,
    onSubmit,
  };
};

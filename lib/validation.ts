import { z } from 'zod';

import { PlatformType } from '@/types/enums';

export const addNewStoreSchema = z.object({
  // 한글, 영문, 숫자, 하이픈(-), 언더스코어(_), 괄호, 공백만 입력 가능
  name: z
    .string()
    .trim()
    .min(2, '2자 이상 입력해 주세요')
    .max(15, '15자 이내로 입력해 주세요')
    .regex(
      /^[가-힣ㄱ-ㅎㅏ-ㅣa-zA-Z0-9\-_() ]+$/,
      '한글, 영문, 숫자, -, _, 괄호, 공백만 입력 가능합니다'
    ),

  platformType: z.nativeEnum(PlatformType, {
    message: '플랫폼을 선택해 주세요',
  }),

  // 영문, 숫자, 하이픈(-), 언더스코어(_)만 입력 가능
  url: z
    .string()
    .trim()
    .min(5, '5자 이상 입력해 주세요')
    .regex(/^[a-zA-Z0-9\-_]+$/, '영문, 숫자, -, _만 입력 가능합니다'),

  // URL 중복 확인 여부
  // undefined: 미확인, false: 중복됨, true: 사용 가능
  isUrlAvailable: z
    .boolean()
    .refine((val) => val === true, { message: '이미 등록된 URL입니다' })
    .optional(),

  // 파일 업로드 (optional, 클라이언트에서 검증)
  certification: z
    .array(z.any())
    .min(1, '파일을 업로드 해주세요')
    .max(3, '최대 3개까지만 등록 가능합니다'),
});

export type AddNewStoreFormData = z.infer<typeof addNewStoreSchema>;

export const storeLimitedSchema = (maxAllowed: number) =>
  z.object({
    storeIds: z
      .array(z.string())
      // .min(1, '최소 1개 이상의 쇼핑몰을 선택해 주세요.')
      .max(maxAllowed, `최대 ${maxAllowed}개까지만 선택 가능합니다.`),
  });

export type StoreLimitedFormData = z.infer<
  ReturnType<typeof storeLimitedSchema>
>;

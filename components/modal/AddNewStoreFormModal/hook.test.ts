import { act, renderHook } from '@testing-library/react';
import { toast } from 'sonner';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { PlatformType } from '@/types';

import { useAddNewStoreForm } from './hook';

// 외부 의존성 mock
vi.mock('sonner', () => ({ toast: { error: vi.fn(), success: vi.fn() } }));

const mockCheckUrl = vi.fn();
vi.mock('@/hooks/useStores', () => ({
  useCheckStoreUrl: () => ({ mutateAsync: mockCheckUrl }),
  useCreateStore: () => ({ mutateAsync: vi.fn() }),
  useGetPresignedUrl: () => ({ mutateAsync: vi.fn() }),
}));

const makeFile = (name: string, type = 'image/jpeg', sizeBytes = 100) =>
  new File([new ArrayBuffer(sizeBytes)], name, { type });

const makeInputEvent = (value: string) =>
  ({
    target: { value },
    nativeEvent: { isComposing: false },
  }) as unknown as React.ChangeEvent<HTMLInputElement>;

describe('useAddNewStoreForm', () => {
  const closeModal = vi.fn();
  const setup = () => renderHook(() => useAddNewStoreForm({ closeModal }));

  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ──────────────────────────────────────────────
  // 1. 별칭(name) 입력 필터링
  // ──────────────────────────────────────────────
  describe('별칭 입력 필터링', () => {
    it('허용 문자만 통과', () => {
      const { result } = setup();
      act(() => result.current.handleNameInputChange(makeInputEvent('테스트 Store-1_(A)')));
      expect(result.current.form.getValues('name')).toBe('테스트 Store-1_(A)');
    });

    it('특수문자 필터링', () => {
      const { result } = setup();
      act(() => result.current.handleNameInputChange(makeInputEvent('test@#!')));
      expect(result.current.form.getValues('name')).toBe('test');
    });
  });

  // ──────────────────────────────────────────────
  // 2. 플랫폼 변경 → 중복확인 초기화
  // ──────────────────────────────────────────────
  describe('플랫폼 변경 시 중복확인 초기화', () => {
    it('플랫폼 변경 → isUrlAvailable undefined로 초기화', () => {
      const { result } = setup();

      // 초기 URL 설정 후 중복확인 완료 시뮬레이션
      act(() => {
        result.current.form.setValue('isUrlAvailable', true);
      });
      expect(result.current.form.getValues('isUrlAvailable')).toBe(true);

      // 플랫폼 변경
      act(() => result.current.handlePlatformChange(PlatformType.SMARTSTORE));
      expect(result.current.form.getValues('isUrlAvailable')).toBeUndefined();
    });

    it('플랫폼 변경 → URL 입력값은 유지', () => {
      const { result } = setup();

      act(() => {
        result.current.form.setValue('url', 'my-store');
        result.current.handlePlatformChange(PlatformType.SMARTSTORE);
      });
      expect(result.current.form.getValues('url')).toBe('my-store');
    });
  });

  // ──────────────────────────────────────────────
  // 3. URL 입력 필터링 + 중복확인 초기화
  // ──────────────────────────────────────────────
  describe('URL 입력', () => {
    it('영문/숫자/하이픈/언더스코어만 통과', () => {
      const { result } = setup();
      act(() => result.current.handleUrlChange(makeInputEvent('Cat-Store_01')));
      expect(result.current.form.getValues('url')).toBe('Cat-Store_01');
    });

    it('한글/특수문자 필터링', () => {
      const { result } = setup();
      act(() => result.current.handleUrlChange(makeInputEvent('스토어@test')));
      expect(result.current.form.getValues('url')).toBe('test');
    });

    it('URL 변경 → 중복확인 상태 초기화', () => {
      const { result } = setup();
      act(() => {
        result.current.form.setValue('isUrlAvailable', true);
      });
      act(() => result.current.handleUrlChange(makeInputEvent('new-url')));
      expect(result.current.form.getValues('isUrlAvailable')).toBeUndefined();
    });
  });

  // ──────────────────────────────────────────────
  // 4. URL blur 에러 우선순위
  // ──────────────────────────────────────────────
  describe('URL blur 에러 우선순위', () => {
    it('플랫폼 미선택 + URL 입력됨 → "플랫폼을 먼저 선택해 주세요"', async () => {
      const { result } = setup();
      act(() => result.current.form.setValue('url', 'test-url'));
      await act(async () => result.current.handleUrlBlur());
      expect(result.current.form.getFieldState('url').error?.message).toBe(
        '플랫폼을 먼저 선택해 주세요'
      );
    });

    it('플랫폼 미선택 + URL 비어있음 → "플랫폼을 먼저 선택해 주세요"', async () => {
      const { result } = setup();
      await act(async () => result.current.handleUrlBlur());
      expect(result.current.form.getFieldState('url').error?.message).toBe(
        '플랫폼을 먼저 선택해 주세요'
      );
    });

    it('플랫폼 선택됨 + URL 비어있음 → "URL을 입력해 주세요"', async () => {
      const { result } = setup();
      act(() => result.current.handlePlatformChange(PlatformType.SMARTSTORE));
      await act(async () => result.current.handleUrlBlur());
      expect(result.current.form.getFieldState('url').error?.message).toBe(
        'URL을 입력해 주세요'
      );
    });

    it('플랫폼 선택됨 + URL 3자 → "5자 이상 입력해 주세요"', async () => {
      const { result } = setup();
      act(() => {
        result.current.handlePlatformChange(PlatformType.SMARTSTORE);
        result.current.form.setValue('url', 'abc');
      });
      await act(async () => result.current.handleUrlBlur());
      expect(result.current.form.getFieldState('url').error?.message).toBe(
        '5자 이상 입력해 주세요'
      );
    });
  });

  // ──────────────────────────────────────────────
  // 5. 중복확인 결과
  // ──────────────────────────────────────────────
  describe('URL 중복확인', () => {
    const setupWithValidUrl = () => {
      const hook = setup();
      act(() => {
        hook.result.current.handlePlatformChange(PlatformType.SMARTSTORE);
        hook.result.current.form.setValue('url', 'valid-url', {
          shouldValidate: true,
        });
      });
      return hook;
    };

    const makeBtnEvent = () =>
      ({ preventDefault: vi.fn() }) as unknown as React.MouseEvent<HTMLButtonElement>;

    it('사용 가능 → isUrlAvailable = true', async () => {
      mockCheckUrl.mockResolvedValueOnce({ exists: false });
      const { result } = setupWithValidUrl();
      await act(async () => result.current.handleDuplicateCheck(makeBtnEvent()));
      expect(result.current.form.getValues('isUrlAvailable')).toBe(true);
    });

    it('이미 등록됨 → isUrlAvailable = false + 에러', async () => {
      mockCheckUrl.mockResolvedValueOnce({ exists: true });
      const { result } = setupWithValidUrl();
      await act(async () => result.current.handleDuplicateCheck(makeBtnEvent()));
      expect(result.current.form.getValues('isUrlAvailable')).toBe(false);
      expect(result.current.form.getFieldState('isUrlAvailable').error?.message).toBe(
        '이미 등록된 URL입니다'
      );
    });

    it('API 실패 → 토스트 에러', async () => {
      mockCheckUrl.mockRejectedValueOnce(new Error('network'));
      const { result } = setupWithValidUrl();
      await act(async () => result.current.handleDuplicateCheck(makeBtnEvent()));
      expect(toast.error).toHaveBeenCalledWith('중복 확인 중 오류가 발생했습니다.');
    });

    it('중복확인 후 URL 수정 → 상태 초기화', async () => {
      mockCheckUrl.mockResolvedValueOnce({ exists: false });
      const { result } = setupWithValidUrl();
      await act(async () => result.current.handleDuplicateCheck(makeBtnEvent()));
      expect(result.current.form.getValues('isUrlAvailable')).toBe(true);

      act(() => result.current.handleUrlChange(makeInputEvent('changed')));
      expect(result.current.form.getValues('isUrlAvailable')).toBeUndefined();
    });
  });

  // ──────────────────────────────────────────────
  // 6. onInvalid 토스트
  // ──────────────────────────────────────────────
  describe('onInvalid 토스트', () => {
    it('name too_big → 최대 15자 토스트', () => {
      const { result } = setup();
      result.current.onInvalid({
        name: { type: 'too_big', message: '' },
      } as any);
      expect(toast.error).toHaveBeenCalledWith('최대 15자까지 입력 가능합니다.');
    });

    it('invalid_string → 허용되지 않은 문자 토스트', () => {
      const { result } = setup();
      result.current.onInvalid({
        url: { type: 'invalid_string', message: '' },
      } as any);
      expect(toast.error).toHaveBeenCalledWith(
        '허용되지 않은 문자가 포함되어 있습니다.'
      );
    });

    it('기타 에러 → 필수 항목 누락 토스트', () => {
      const { result } = setup();
      result.current.onInvalid({
        platformType: { type: 'invalid_type', message: '' },
      } as any);
      expect(toast.error).toHaveBeenCalledWith(
        '필수 항목을 모두 입력해 주세요.'
      );
    });
  });

  // ──────────────────────────────────────────────
  // 7. 파일 검증 (기존 테스트 유지)
  // ──────────────────────────────────────────────
  describe('파일 검증', () => {
    const fileChangeEvent = (files: File[]) =>
      ({ target: { files } }) as unknown as React.ChangeEvent<HTMLInputElement>;

    describe('파일명 길이', () => {
      it('100자 이하 - 통과', () => {
        const { result } = setup();
        act(() => result.current.handleFileChange(fileChangeEvent([makeFile('a'.repeat(96) + '.jpg')])));
        expect(toast.error).not.toHaveBeenCalled();
      });

      it('101자 - 에러', () => {
        const { result } = setup();
        act(() => result.current.handleFileChange(fileChangeEvent([makeFile('a'.repeat(97) + '.jpg')])));
        expect(toast.error).toHaveBeenCalledWith(
          '파일명이 너무 깁니다.\n(확장자 포함 100자 이하만 가능)'
        );
      });
    });

    describe('파일명 허용 문자', () => {
      it.each(['한글파일.jpg', 'english_file.pdf', '파일 이름 (1).png'])(
        '허용: "%s"',
        (name) => {
          const { result } = setup();
          act(() => result.current.handleFileChange(fileChangeEvent([makeFile(name)])));
          expect(toast.error).not.toHaveBeenCalledWith(expect.stringContaining('사용할 수 없는 문자'));
        }
      );

      it.each([['특수문자@.jpg'], ['파일#이름.jpg'], ['test!.png']])(
        '차단: "%s"',
        (name) => {
          const { result } = setup();
          act(() => result.current.handleFileChange(fileChangeEvent([makeFile(name)])));
          expect(toast.error).toHaveBeenCalledWith(expect.stringContaining('사용할 수 없는 문자'));
        }
      );
    });

    describe('파일 형식', () => {
      it('JPEG 통과', () => {
        const { result } = setup();
        act(() => result.current.handleFileChange(fileChangeEvent([makeFile('t.jpg', 'image/jpeg')])));
        expect(toast.error).not.toHaveBeenCalled();
      });

      it('GIF 차단', () => {
        const { result } = setup();
        act(() => result.current.handleFileChange(fileChangeEvent([makeFile('t.gif', 'image/gif')])));
        expect(toast.error).toHaveBeenCalledWith('지원하지 않는 파일 형식입니다. (JPEG, PNG, PDF만 가능)');
      });
    });

    describe('파일 용량', () => {
      it('5MB 이하 통과', () => {
        const { result } = setup();
        act(() => result.current.handleFileChange(fileChangeEvent([makeFile('t.jpg', 'image/jpeg', 5 * 1024 * 1024)])));
        expect(toast.error).not.toHaveBeenCalled();
      });

      it('5MB 초과 차단', () => {
        const { result } = setup();
        act(() => result.current.handleFileChange(fileChangeEvent([makeFile('t.jpg', 'image/jpeg', 5 * 1024 * 1024 + 1)])));
        expect(toast.error).toHaveBeenCalledWith('파일 용량이 5MB를 초과했습니다.');
      });
    });

    describe('파일 개수', () => {
      it('4개 차단', () => {
        const { result } = setup();
        const files = [makeFile('a.jpg'), makeFile('b.jpg'), makeFile('c.jpg'), makeFile('d.jpg')];
        act(() => result.current.handleFileChange(fileChangeEvent(files)));
        expect(toast.error).toHaveBeenCalledWith('최대 3개까지만 등록 가능합니다.');
      });
    });

    describe('중복 파일', () => {
      it('동일 파일 재업로드 차단', () => {
        const { result } = setup();
        const file = makeFile('test.jpg', 'image/jpeg', 500);
        act(() => result.current.handleFileChange(fileChangeEvent([file])));
        act(() => result.current.handleFileChange(fileChangeEvent([file])));
        expect(toast.error).toHaveBeenCalledWith('이미 등록된 파일입니다.');
      });
    });
  });
});

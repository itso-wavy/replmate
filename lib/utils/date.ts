/**
 * 날짜 값을 지정한 형식의 문자열로 변환합니다.
 *
 * - '-'가 포함된 문자열('2026-03-10T03:31:55.626Z'): ISO 8601 등은 `parseISO`로 파싱합니다.
 * - 그 외 문자열('2026.03.10'): `formatStr`에 맞춰 `parse`로 파싱합니다.
 * - `Date` 객체는 그대로 사용합니다.
 *
 * @param dateString - 변환할 날짜 값 (ISO 문자열, 커스텀 형식 문자열, Date 객체)
 * @param formatStr - 출력 형식 (기본값: `'yyyy.MM.dd'`)
 * @returns 포맷된 날짜 문자열. 값이 없으면 `null`, 유효하지 않은 날짜면 빈 문자열 반환.
 */
import { format, isValid, parse, parseISO } from 'date-fns';

export const formatDate = (
  dateString: Date | string | undefined | null,
  formatStr: string | undefined = 'yyyy.MM.dd'
) => {
  if (!dateString) return null;

  const date =
    typeof dateString === 'string'
      ? dateString.includes('-')
        ? parseISO(dateString)
        : parse(dateString, formatStr, new Date())
      : dateString;

  if (!isValid(date)) return null;

  return format(date, formatStr);
};

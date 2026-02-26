/**
 * 날짜 문자열을 'YYYY.MM.DD' 형식으로 변환
 * @param dateString - 날짜 문자열 (예: '2025.12.02' 또는 ISO 형식)
 * @returns 'YYYY.MM.DD' 형식의 문자열
 */
import { format, isValid, parse, parseISO } from 'date-fns';

export const formatDate = (
  dateString: Date | string,
  formatStr: string | undefined = 'yyyy.MM.dd'
) => {
  const date =
    typeof dateString === 'string'
      ? dateString.includes('.')
        ? parse(dateString, formatStr, new Date())
        : parseISO(dateString)
      : dateString;

  if (!isValid(date)) return '';

  return format(date, formatStr);
};

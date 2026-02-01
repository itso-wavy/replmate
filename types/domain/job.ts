import type { JobDto } from '@/types/api/job';

/**
 * Job Domain 타입
 * API DTO의 날짜 문자열을 Date 객체로 변환
 */
export interface JobDomain {
  id: string;
  type: string;
  status: string;
  progress: number;
  message: string | null;
  targetId: number | null;
  userId: number | null;
  result: Record<string, unknown> | null;
  error: string | null;
  createdAt: Date | null;
  startedAt: Date | null;
  completedAt: Date | null;
}

/**
 * Job 상태 타입 정의
 */
export type JobStatus = 'pending' | 'running' | 'completed' | 'failed';

/**
 * Job 타입 정의
 */
export type JobType =
  | 'product_sync'
  | 'review_sync'
  | 'reply_generation'
  | 'store_verification'
  | 'export_replies';

/**
 * Job 실행 정보를 포함한 확장 타입
 * 프론트엔드에서 Job 진행 상황 표시 시 사용
 */
export interface JobWithProgress extends JobDomain {
  /** Job 실행 시간 (ms) */
  duration?: number;
  /** Job이 완료되었는지 여부 */
  isCompleted: boolean;
  /** Job이 실패했는지 여부 */
  isFailed: boolean;
  /** Job이 실행 중인지 여부 */
  isRunning: boolean;
  /** 예상 남은 시간 (ms) */
  estimatedTimeRemaining?: number;
}

/**
 * JobDto를 JobDomain으로 변환
 * @param dto - API에서 받은 JobDto
 * @returns JobDomain 객체
 */
export function toJobDomain(dto: JobDto): JobDomain {
  return {
    id: dto.id,
    type: dto.type,
    status: dto.status,
    progress: dto.progress,
    message: dto.message,
    targetId: dto.targetId,
    userId: dto.userId,
    result: dto.result,
    error: dto.error,
    createdAt: dto.createdAt ? new Date(dto.createdAt) : null,
    startedAt: dto.startedAt ? new Date(dto.startedAt) : null,
    completedAt: dto.completedAt ? new Date(dto.completedAt) : null,
  };
}

/**
 * JobDto 배열을 JobDomain 배열로 변환
 * @param dtos - API에서 받은 JobDto 배열
 * @returns JobDomain 배열
 */
export function toJobDomainList(dtos: JobDto[]): JobDomain[] {
  return dtos.map(toJobDomain);
}

/**
 * JobDomain을 JobWithProgress로 확장
 * @param job - JobDomain 객체
 * @returns JobWithProgress 객체
 */
export function toJobWithProgress(job: JobDomain): JobWithProgress {
  const isCompleted = job.status === 'completed';
  const isFailed = job.status === 'failed';
  const isRunning = job.status === 'running';

  let duration: number | undefined;
  if (job.startedAt && job.completedAt) {
    duration = job.completedAt.getTime() - job.startedAt.getTime();
  }

  let estimatedTimeRemaining: number | undefined;
  if (isRunning && job.startedAt && job.progress > 0) {
    const elapsed = Date.now() - job.startedAt.getTime();
    const totalEstimated = (elapsed / job.progress) * 100;
    estimatedTimeRemaining = totalEstimated - elapsed;
  }

  return {
    ...job,
    duration,
    isCompleted,
    isFailed,
    isRunning,
    estimatedTimeRemaining,
  };
}

/**
 * Job 상태에 따른 색상 반환
 * @param status - Job 상태
 * @returns Tailwind CSS 색상 클래스
 */
export function getJobStatusColor(status: string): string {
  switch (status) {
    case 'completed':
      return 'text-green-600';
    case 'failed':
      return 'text-red-600';
    case 'running':
      return 'text-blue-600';
    case 'pending':
      return 'text-gray-600';
    default:
      return 'text-gray-400';
  }
}

/**
 * Job 타입에 따른 아이콘 이름 반환
 * @param type - Job 타입
 * @returns 아이콘 이름 (lucide-react 기준)
 */
export function getJobTypeIcon(type: string): string {
  switch (type) {
    case 'product_sync':
      return 'Package';
    case 'review_sync':
      return 'MessageSquare';
    case 'reply_generation':
      return 'Sparkles';
    case 'store_verification':
      return 'CheckCircle';
    case 'export_replies':
      return 'Download';
    default:
      return 'Activity';
  }
}

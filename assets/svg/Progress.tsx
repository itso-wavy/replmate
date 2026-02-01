interface ProgressSvgProps {
  status: 'waiting' | 'inactive' | 'active' | 'half';
  className?: string;
}

export const ProgressSvg = ({ status, className }: ProgressSvgProps) => {
  // waiting: 점선 원 (in-progress.svg)
  if (status === 'waiting')
    return (
      <svg
        width='20'
        height='20'
        viewBox='0 0 20 20'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
        className={className}
      >
        <circle
          cx='10'
          cy='10'
          r='9'
          stroke='currentColor'
          strokeWidth='2'
          strokeLinejoin='round'
          strokeDasharray='4 3'
        />
      </svg>
    );

  // inactive: X 아이콘 (inactive.svg)
  if (status === 'inactive')
    return (
      <svg
        width='20'
        height='20'
        viewBox='0 0 20 20'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
        className={className}
      >
        <path
          d='M10 0C15.5228 0 20 4.47715 20 10C20 15.5228 15.5228 20 10 20C4.47715 20 0 15.5228 0 10C0 4.47715 4.47715 0 10 0ZM14.707 5.29297C14.3165 4.90244 13.6835 4.90244 13.293 5.29297L10 8.58594L6.70703 5.29297C6.31651 4.90244 5.68349 4.90244 5.29297 5.29297C4.90244 5.68349 4.90244 6.31651 5.29297 6.70703L8.58594 10L5.29297 13.293C4.90244 13.6835 4.90244 14.3165 5.29297 14.707C5.68349 15.0976 6.31651 15.0976 6.70703 14.707L10 11.4141L13.293 14.707C13.6835 15.0976 14.3165 15.0976 14.707 14.707C15.0976 14.3165 15.0976 13.6835 14.707 13.293L11.4141 10L14.707 6.70703C15.0976 6.31651 15.0976 5.68349 14.707 5.29297Z'
          fill='currentColor'
        />
      </svg>
    );

  // active: 체크 아이콘 (active.svg)
  if (status === 'active')
    return (
      <svg
        width='20'
        height='20'
        viewBox='0 0 20 20'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
        className={className}
      >
        <path
          fillRule='evenodd'
          clipRule='evenodd'
          d='M10 0C15.5228 0 20 4.47715 20 10C20 15.5228 15.5228 20 10 20C4.47715 20 0 15.5228 0 10C0 4.47715 4.47715 0 10 0ZM14.707 7.29297C14.3165 6.90244 13.6835 6.90244 13.293 7.29297L8.5 12.0859L6.70703 10.293C6.31651 9.90244 5.68349 9.90244 5.29297 10.293C4.90244 10.6835 4.90244 11.3165 5.29297 11.707L7.79297 14.207C8.18349 14.5976 8.81651 14.5976 9.20703 14.207L14.707 8.70703C15.0976 8.31651 15.0976 7.68349 14.707 7.29297Z'
          fill='currentColor'
        />
      </svg>
    );

  // half: 반원 아이콘 (half.svg)
  if (status === 'half')
    return (
      <svg
        width='20'
        height='20'
        viewBox='0 0 20 20'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
        className={className}
      >
        <rect
          x='1'
          y='1'
          width='18'
          height='18'
          rx='9'
          stroke='currentColor'
          strokeWidth='2'
        />
        <path
          d='M10 3C9.08075 3 8.1705 3.18106 7.32122 3.53284C6.47194 3.88463 5.70026 4.40024 5.05025 5.05025C4.40024 5.70026 3.88463 6.47194 3.53284 7.32122C3.18106 8.1705 3 9.08075 3 10C3 10.9193 3.18106 11.8295 3.53284 12.6788C3.88463 13.5281 4.40024 14.2997 5.05025 14.9497C5.70026 15.5998 6.47194 16.1154 7.32122 16.4672C8.1705 16.8189 9.08075 17 10 17L10 10L10 3Z'
          fill='currentColor'
        />
      </svg>
    );

  return null;
};

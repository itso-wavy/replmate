function ToastList({ toasts }) {
  return (
    <div
      style={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
      }}
    >
      {toasts.map(t => (
        <div
          key={t.id}
          style={{
            background:
              t.type === 'error'
                ? '#fff5f5'
                : t.type === 'info'
                  ? '#f0f4ff'
                  : '#f3fbe8',
            border: `1px solid ${t.type === 'error' ? '#ffc9c9' : t.type === 'info' ? '#bac8ff' : '#b2f2bb'}`,
            color:
              t.type === 'error'
                ? '#c92a2a'
                : t.type === 'info'
                  ? '#364fc7'
                  : '#2b8a3e',
            borderRadius: 10,
            padding: '10px 16px',
            fontSize: 13,
            fontWeight: 500,
            boxShadow: '0 4px 16px #00000014',
            animation: 'slideIn 0.2s ease',
            maxWidth: 320,
          }}
        >
          {t.type === 'error' ? '오류: ' : t.type === 'info' ? '' : '완료: '}
          {t.message}
        </div>
      ))}
    </div>
  );
}

export default ToastList;

import { useState, useRef } from 'react';
import { CATEGORY_COLORS, PRIORITY_META } from '../constants';

function Chip({
  task,
  past,
  isDragging,
  onDragStart,
  onDragEnd,
  onEdit,
  onSaveActual,
}) {
  const [hovered, setHovered] = useState(false);
  const [inputVal, setInputVal] = useState(
    task.actual_hours != null ? String(task.actual_hours) : ''
  );
  const [saved, setSaved] = useState(false);
  const timer = useRef(null);
  const c = CATEGORY_COLORS[task.category] || CATEGORY_COLORS['기타'];
  const pLabel = PRIORITY_META[task.priority]?.label || '';
  const pColor = PRIORITY_META[task.priority]?.color || '#868e96';

  const enter = () => {
    clearTimeout(timer.current);
    setHovered(true);
    setSaved(false);
    setInputVal(task.actual_hours != null ? String(task.actual_hours) : '');
  };
  const leave = () => {
    timer.current = setTimeout(() => setHovered(false), 160);
  };

  const handleSave = e => {
    e.stopPropagation();
    const v = parseFloat(inputVal);
    onSaveActual(isNaN(v) ? null : v);
    setSaved(true);
    setTimeout(() => setHovered(false), 800);
  };

  return (
    <div
      style={{ position: 'relative' }}
      onMouseEnter={enter}
      onMouseLeave={leave}
    >
      <div
        className={`chip${isDragging ? ' chip-drag' : ''}`}
        draggable
        onDragStart={e => onDragStart(e, task)}
        onDragEnd={onDragEnd}
        onClick={e => {
          e.stopPropagation();
          onEdit();
        }}
        style={{
          background: past ? '#f1f3f5' : c.bg,
          borderLeft: `3px solid ${past ? '#ced4da' : c.border}`,
          borderRadius: 5,
          padding: '3px 7px',
          fontSize: 11,
          color: past ? '#adb5bd' : c.text,
          fontWeight: 500,
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis',
          opacity: past ? 0.6 : 1,
          display: 'flex',
          alignItems: 'center',
          gap: 4,
        }}
        title={task.name}
      >
        <span
          style={{
            flex: 1,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {task.name}
        </span>
        {task.actual_hours != null && (
          <span
            style={{
              fontSize: 9,
              fontFamily: "'DM Mono', monospace",
              background: c.border + '22',
              color: c.border,
              borderRadius: 3,
              padding: '1px 4px',
              flexShrink: 0,
            }}
          >
            {task.actual_hours}h
          </span>
        )}
      </div>

      {hovered && (
        <div
          onMouseEnter={() => clearTimeout(timer.current)}
          onMouseLeave={leave}
          onClick={e => e.stopPropagation()}
          style={{
            position: 'absolute',
            bottom: 'calc(100% + 6px)',
            left: 0,
            zIndex: 500,
            background: '#fff',
            border: '1px solid #e0e0ee',
            borderRadius: 10,
            padding: '12px 14px',
            width: 224,
            boxShadow: '0 8px 24px #00000018',
            animation: 'fadeUp 0.12s ease',
          }}
        >
          <div
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: '#1a1a2e',
              marginBottom: 6,
              lineHeight: 1.4,
            }}
          >
            {task.name}
          </div>
          <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
            <span
              style={{
                fontSize: 10,
                color: pColor,
                background: pColor + '15',
                padding: '1px 6px',
                borderRadius: 4,
                fontWeight: 600,
              }}
            >
              {pLabel}
            </span>
            <span
              style={{
                fontSize: 10,
                color: '#8888a0',
                fontFamily: "'DM Mono', monospace",
              }}
            >
              {task.start_date.slice(5)} ~ {task.end_date.slice(5)}
            </span>
          </div>

          <div
            style={{
              background: '#f8f8fc',
              borderRadius: 7,
              padding: '8px 10px',
              marginBottom: 10,
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: 4,
              }}
            >
              <span style={{ fontSize: 10, color: '#8888a0' }}>예상 시간</span>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: '#1a1a2e',
                  fontFamily: "'DM Mono', monospace",
                }}
              >
                {task.estimated_hours != null
                  ? task.estimated_hours + 'h'
                  : '-'}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 10, color: '#8888a0' }}>실제 소요</span>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  fontFamily: "'DM Mono', monospace",
                  color:
                    task.actual_hours == null
                      ? '#ccccdc'
                      : task.actual_hours > task.estimated_hours
                        ? '#e03131'
                        : '#2f9e44',
                }}
              >
                {task.actual_hours != null ? task.actual_hours + 'h' : '미입력'}
              </span>
            </div>
            {task.actual_hours != null && task.estimated_hours != null && (
              <div
                style={{
                  marginTop: 6,
                  paddingTop: 6,
                  borderTop: '1px solid #e8e8f4',
                  display: 'flex',
                  justifyContent: 'space-between',
                }}
              >
                <span style={{ fontSize: 10, color: '#8888a0' }}>차이</span>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    fontFamily: "'DM Mono', monospace",
                    color:
                      task.actual_hours > task.estimated_hours
                        ? '#e03131'
                        : '#2f9e44',
                  }}
                >
                  {task.actual_hours > task.estimated_hours ? '+' : ''}
                  {(task.actual_hours - task.estimated_hours).toFixed(1)}h
                </span>
              </div>
            )}
          </div>

          <div
            style={{
              fontSize: 10,
              color: '#8888a0',
              marginBottom: 5,
              fontWeight: 600,
            }}
          >
            실제 소요 시간 입력
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            <input
              type='number'
              min='0'
              step='0.5'
              value={inputVal}
              onChange={e => setInputVal(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSave(e)}
              placeholder='예: 1.5'
              style={{
                flex: 1,
                border: '1px solid #e0e0ee',
                borderRadius: 6,
                padding: '5px 8px',
                fontSize: 12,
                color: '#1a1a2e',
                background: '#f8f8fc',
                fontFamily: 'inherit',
              }}
            />
            <button
              onClick={handleSave}
              style={{
                background: saved ? '#2f9e44' : '#3b5bdb',
                color: '#fff',
                border: 'none',
                borderRadius: 6,
                padding: '5px 10px',
                fontSize: 11,
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'background 0.2s',
                whiteSpace: 'nowrap',
                fontFamily: 'inherit',
              }}
            >
              {saved ? '완료' : '저장'}
            </button>
          </div>
          {task.note && (
            <div
              style={{
                marginTop: 8,
                fontSize: 10,
                color: '#aaaabc',
                lineHeight: 1.5,
              }}
            >
              {task.note}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Chip;

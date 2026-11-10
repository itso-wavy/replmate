import { useState } from 'react';
import { CATEGORIES, PRIORITY_META } from '../constants';

function TaskForm({ task: initial, mode, onSave, onDelete, onCancel }) {
  const [form, setForm] = useState({ ...initial });
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const valid = form.name.trim() && form.start_date && form.end_date;

  const inp = {
    width: '100%',
    border: '1px solid #e0e0ee',
    borderRadius: 8,
    padding: '8px 11px',
    fontSize: 13,
    color: '#1a1a2e',
    background: '#f8f8fc',
    fontFamily: 'inherit',
  };
  const lbl = {
    fontSize: 12,
    fontWeight: 600,
    color: '#8888a0',
    marginBottom: 5,
    display: 'block',
  };
  const row = { marginBottom: 14 };

  return (
    <div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 20,
        }}
      >
        <h2
          style={{ margin: 0, fontSize: 17, fontWeight: 700, color: '#1a1a2e' }}
        >
          {mode === 'add' ? '태스크 추가' : '태스크 수정'}
        </h2>
        <button
          onClick={onCancel}
          style={{
            background: 'none',
            border: 'none',
            fontSize: 20,
            color: '#aaaabc',
            cursor: 'pointer',
          }}
        >
          x
        </button>
      </div>

      <div style={row}>
        <label style={lbl}>작업명 *</label>
        <input
          style={inp}
          value={form.name}
          onChange={e => set('name', e.target.value)}
          placeholder='작업명 입력'
        />
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 10,
          ...row,
        }}
      >
        <div>
          <label style={lbl}>시작일 *</label>
          <input
            type='date'
            style={inp}
            value={form.start_date}
            onChange={e => set('start_date', e.target.value)}
          />
        </div>
        <div>
          <label style={lbl}>종료일 *</label>
          <input
            type='date'
            style={inp}
            value={form.end_date}
            onChange={e => set('end_date', e.target.value)}
          />
        </div>
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 10,
          ...row,
        }}
      >
        <div>
          <label style={lbl}>카테고리</label>
          <select
            style={inp}
            value={form.category}
            onChange={e => set('category', e.target.value)}
          >
            {CATEGORIES.map(c => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>
        <div>
          <label style={lbl}>우선순위</label>
          <select
            style={inp}
            value={form.priority}
            onChange={e => set('priority', e.target.value)}
          >
            {Object.entries(PRIORITY_META).map(([k, v]) => (
              <option key={k} value={k}>
                {v.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 10,
          ...row,
        }}
      >
        <div>
          <label style={lbl}>예상 시간 (h)</label>
          <input
            type='number'
            min='0'
            step='0.5'
            style={inp}
            value={form.estimated_hours}
            onChange={e => set('estimated_hours', e.target.value)}
            placeholder='예: 2'
          />
        </div>
        <div>
          <label style={lbl}>실제 소요 시간 (h)</label>
          <input
            type='number'
            min='0'
            step='0.5'
            style={inp}
            value={form.actual_hours ?? ''}
            onChange={e =>
              set(
                'actual_hours',
                e.target.value === '' ? null : parseFloat(e.target.value)
              )
            }
            placeholder='완료 후 입력'
          />
        </div>
      </div>
      <div style={row}>
        <label style={lbl}>비고</label>
        <textarea
          style={{ ...inp, height: 68, resize: 'vertical' }}
          value={form.note}
          onChange={e => set('note', e.target.value)}
          placeholder='메모 (선택)'
        />
      </div>

      <div
        style={{
          display: 'flex',
          gap: 8,
          justifyContent: 'flex-end',
          marginTop: 4,
        }}
      >
        {mode === 'edit' && (
          <button
            onClick={() => onDelete(form.id)}
            style={{
              background: 'none',
              color: '#e03131',
              border: '1px solid #ffc9c9',
              borderRadius: 8,
              padding: '8px 16px',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
              marginRight: 'auto',
              fontFamily: 'inherit',
            }}
          >
            삭제
          </button>
        )}
        <button
          onClick={onCancel}
          style={{
            background: 'none',
            color: '#8888a0',
            border: '1px solid #e0e0ee',
            borderRadius: 8,
            padding: '8px 16px',
            fontSize: 13,
            fontWeight: 600,
            cursor: 'pointer',
            fontFamily: 'inherit',
          }}
        >
          취소
        </button>
        <button
          onClick={() => valid && onSave(form)}
          disabled={!valid}
          style={{
            background: valid ? '#3b5bdb' : '#c5cff8',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            padding: '8px 20px',
            fontSize: 13,
            fontWeight: 600,
            cursor: valid ? 'pointer' : 'not-allowed',
            fontFamily: 'inherit',
          }}
        >
          {mode === 'add' ? '추가' : '저장'}
        </button>
      </div>
    </div>
  );
}

export default TaskForm;

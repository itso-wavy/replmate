import { useState, useCallback, useEffect, Fragment } from 'react';
import { Chip, ToastList, TaskForm, useToast } from '.';
import {
  buildWeeks,
  emptyTask,
  isPast,
  shiftDate,
  toNum,
  toStr,
} from '../utils';
import { db } from '../lib/supabase';
import {
  CATEGORIES,
  CATEGORY_COLORS,
  DAY_LABELS,
  MONTHS,
  TODAY_STR,
  VISIBLE,
} from '../constants';

// ─── Main ────────────────────────────────────
function CalendarV2() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState({});
  const [modal, setModal] = useState(null);
  const [dragging, setDragging] = useState(null);
  const [dragOver, setDragOver] = useState(null);
  const { toasts, add: toast } = useToast();

  useEffect(() => {
    loadFromSupabase();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getTasksForDay = useCallback(
    (y, m, d) => {
      const num = toNum(toStr(y, m, d));
      return tasks.filter(
        t => num >= toNum(t.start_date) && num <= toNum(t.end_date)
      );
    },
    [tasks]
  );

  // ── Supabase 연동 ──
  const loadFromSupabase = async () => {
    setLoading(true);
    try {
      const data = await db.getAll();
      setTasks(data || []);
      toast(`${(data || []).length}개 태스크를 불러왔어요`);
    } catch (e) {
      toast(e.message, 'error');
    }
    setLoading(false);
  };

  const syncToSupabase = async () => {
    if (!tasks.length) {
      toast('저장할 태스크가 없어요', 'info');
      return;
    }
    setLoading(true);
    try {
      await db.upsert(tasks);
      toast(`${tasks.length}개 태스크를 저장했어요`);
    } catch (e) {
      toast(e.message, 'error');
    }
    setLoading(false);
  };

  // ── CRUD ──
  const saveTask = async task => {
    const exists = tasks.find(t => t.id === task.id);
    setTasks(prev =>
      exists ? prev.map(t => (t.id === task.id ? task : t)) : [...prev, task]
    );
    setModal(null);
    try {
      exists ? await db.update(task.id, task) : await db.upsert([task]);
      toast(exists ? '태스크를 수정했어요' : '태스크를 추가했어요');
    } catch (e) {
      toast(e.message, 'error');
    }
  };

  const deleteTask = async id => {
    setTasks(prev => prev.filter(t => t.id !== id));
    setModal(null);
    try {
      await db.delete(id);
      toast('태스크를 삭제했어요');
    } catch (e) {
      toast(e.message, 'error');
    }
  };

  const updateActualHours = async (id, hours) => {
    setTasks(prev =>
      prev.map(t => (t.id === id ? { ...t, actual_hours: hours } : t))
    );
    try {
      await db.update(id, { actual_hours: hours });
      toast('실제 소요 시간을 저장했어요');
    } catch (e) {
      toast(e.message, 'error');
    }
  };

  // ── 드래그 ──
  const onDragStart = (e, task) => {
    e.stopPropagation();
    setDragging(task);
    e.dataTransfer.effectAllowed = 'move';
  };
  const onDragOver = (e, dateStr) => {
    e.preventDefault();
    setDragOver(dateStr);
  };
  const onDrop = async (e, dateStr) => {
    e.preventDefault();
    if (!dragging) return;
    const diff = Math.round(
      (new Date(dateStr) - new Date(dragging.start_date)) / 86400000
    );
    if (diff === 0) {
      setDragging(null);
      setDragOver(null);
      return;
    }
    const updated = {
      ...dragging,
      start_date: shiftDate(dragging.start_date, diff),
      end_date: shiftDate(dragging.end_date, diff),
    };
    setTasks(prev => prev.map(t => (t.id === dragging.id ? updated : t)));
    setDragging(null);
    setDragOver(null);
    try {
      await db.update(dragging.id, {
        start_date: updated.start_date,
        end_date: updated.end_date,
      });
      toast(`일정을 ${updated.start_date} ~ ${updated.end_date}로 이동했어요`);
    } catch (e) {
      toast(e.message, 'error');
    }
  };
  const onDragEnd = () => {
    setDragging(null);
    setDragOver(null);
  };

  const toggleExpand = (key, e) => {
    e.stopPropagation();
    setExpanded(p => ({ ...p, [key]: !p[key] }));
  };

  const isToday = (y, m, d) => toStr(y, m, d) === TODAY_STR;

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#f0f1f5',
        padding: '28px 24px',
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
        body { margin: 0; }
        .day-cell { transition: background 0.1s; cursor: pointer; }
        .day-cell:hover { background: #e8eaf0 !important; }
        .chip { transition: opacity 0.1s; cursor: grab; user-select: none; }
        .chip:hover { opacity: 0.8; }
        .chip-drag { opacity: 0.3 !important; }
        .drop-target { background: #e8edff !important; outline: 2px dashed #3b5bdb; outline-offset: -3px; border-radius: 10px; }
        .more-btn { background: none; border: none; cursor: pointer; font-size: 11px; color: #7777a0; padding: 2px 6px; border-radius: 4px; transition: background 0.1s; font-family: inherit; display: block; width: 100%; text-align: left; }
        .more-btn:hover { background: #e4e6f8; color: #3b5bdb; }
        .month-label { font-size: 11px; letter-spacing: 3px; color: #aaaabc; text-transform: uppercase; font-family: 'DM Mono', monospace; margin-bottom: 6px; }
        .btn { border: none; border-radius: 8px; padding: 8px 16px; font-size: 13px; font-weight: 600; cursor: pointer; transition: opacity 0.1s, background 0.15s; font-family: inherit; }
        .btn:hover { opacity: 0.88; }
        .btn:disabled { opacity: 0.5; cursor: not-allowed; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(6px); } to { opacity:1; transform:translateY(0); } }
        @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
        @keyframes slideIn { from { opacity:0; transform:translateX(16px); } to { opacity:1; transform:translateX(0); } }
        .modal-bg { animation: fadeIn 0.15s ease; }
        .modal-box { animation: fadeUp 0.18s ease; }
        input:focus, textarea:focus, select:focus { border-color: #3b5bdb !important; outline: none; }
      `}</style>

      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: 16,
          marginBottom: 28,
        }}
      >
        <div>
          <div
            style={{
              fontSize: 11,
              letterSpacing: 4,
              color: '#aaaabc',
              fontFamily: "'DM Mono', monospace",
              textTransform: 'uppercase',
            }}
          >
            2026
          </div>
          <h1
            style={{
              margin: 0,
              fontSize: 38,
              fontWeight: 700,
              letterSpacing: -1,
              color: '#1a1a2e',
              lineHeight: 1.1,
            }}
          >
            ReplMate Frontend
          </h1>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              marginTop: 4,
              flexWrap: 'wrap',
            }}
          >
            <span
              style={{
                fontSize: 13,
                color: '#aaaabc',
                fontFamily: "'DM Mono', monospace",
                marginRight: 12,
              }}
            >
              Mar - Apr 2026 · 58.5h+
            </span>
            {/* 범례 */}
            {CATEGORIES.map(cat => {
              const c = CATEGORY_COLORS[cat];
              return (
                <div
                  key={cat}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 5,
                    fontSize: 12,
                    color: c.text,
                  }}
                >
                  <span
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: 2,
                      background: c.border,
                      display: 'inline-block',
                    }}
                  />
                  {cat}
                </div>
              );
            })}
          </div>
        </div>

        <div
          style={{
            marginLeft: 'auto',
            display: 'flex',
            gap: 8,
            alignItems: 'center',
            paddingBottom: 4,
          }}
        >
          <span
            style={{
              fontSize: 11,
              color: '#aaaabc',
              fontFamily: "'DM Mono', monospace",
              marginRight: 8,
            }}
          >
            {tasks.length}개 태스크
          </span>
          <button
            className='btn'
            onClick={loadFromSupabase}
            disabled={loading}
            style={{
              background: '#fff',
              color: '#555570',
              border: '1px solid #e0e0ee',
            }}
          >
            {loading ? '처리중...' : '불러오기'}
          </button>
          <button
            className='btn'
            onClick={syncToSupabase}
            disabled={loading}
            style={{ background: '#1a1a2e', color: '#fff' }}
          >
            {loading ? '처리중...' : 'Supabase 저장'}
          </button>
          <button
            className='btn'
            onClick={() => setModal({ mode: 'add', task: emptyTask() })}
            style={{ background: '#3b5bdb', color: '#fff' }}
          >
            + 태스크 추가
          </button>
        </div>
      </div>

      {/* Calendar */}
      <div style={{ display: 'flex', gap: 40, alignItems: 'flex-start' }}>
        {MONTHS.map(({ year, month, label }, idx) => {
          const weeks = buildWeeks(year, month);
          return (
            <Fragment key={`${year}-${month}`}>
              {idx > 0 && (
                <div
                  style={{
                    width: 1,
                    background: '#e0e0ee',
                    alignSelf: 'stretch',
                  }}
                />
              )}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className='month-label'>
                  {label} {year}
                </div>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(7, minmax(0, 1fr))',
                    gap: 4,
                    marginBottom: 4,
                  }}
                >
                  {DAY_LABELS.map((d, i) => (
                    <div
                      key={d}
                      style={{
                        textAlign: 'center',
                        fontSize: 12,
                        fontWeight: 600,
                        padding: '5px 0',
                        color:
                          i === 0 ? '#e03131' : i === 6 ? '#1971c2' : '#aaaabc',
                      }}
                    >
                      {d}
                    </div>
                  ))}
                </div>
                {weeks.map((wk, wi) => (
                  <div
                    key={wi}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(7, minmax(0, 1fr))',
                      gap: 4,
                      marginBottom: 4,
                    }}
                  >
                    {wk.map((cell, di) => {
                      if (!cell)
                        return <div key={di} style={{ minHeight: 130 }} />;
                      const { day, year: cy, month: cm } = cell;
                      const dateStr = toStr(cy, cm, day);
                      const todayCell = isToday(cy, cm, day);
                      const isOver = dragOver === dateStr;
                      const isSun = di === 0,
                        isSat = di === 6;
                      const dayTasks = getTasksForDay(cy, cm, day);
                      const key = `${year}-${month}-${wi}-${di}`;
                      const isExp = !!expanded[key];
                      const visible = isExp
                        ? dayTasks
                        : dayTasks.slice(0, VISIBLE);
                      const hiddenCount = dayTasks.length - VISIBLE;

                      return (
                        <div
                          key={di}
                          className={`day-cell${isOver ? ' drop-target' : ''}`}
                          onClick={() =>
                            setModal({ mode: 'add', task: emptyTask(dateStr) })
                          }
                          onDragOver={e => onDragOver(e, dateStr)}
                          onDrop={e => onDrop(e, dateStr)}
                          onDragLeave={() => setDragOver(null)}
                          style={{
                            minHeight: 130,
                            background: '#fff',
                            borderRadius: 10,
                            padding: '10px 9px 8px',
                            border: todayCell
                              ? '1.5px solid #3b5bdb88'
                              : '1px solid #e0e0ee',
                            boxShadow: todayCell
                              ? '0 0 0 3px #3b5bdb14'
                              : '0 1px 3px #0000000a',
                          }}
                        >
                          <div style={{ marginBottom: 7 }}>
                            {todayCell ? (
                              <span
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  width: 24,
                                  height: 24,
                                  borderRadius: 6,
                                  background: '#3b5bdb',
                                  color: '#fff',
                                  fontSize: 12,
                                  fontWeight: 700,
                                }}
                              >
                                {day}
                              </span>
                            ) : (
                              <span
                                style={{
                                  fontSize: 13,
                                  fontWeight: 600,
                                  color: isSun
                                    ? '#e0303160'
                                    : isSat
                                      ? '#1971c260'
                                      : '#8888a0',
                                }}
                              >
                                {day}
                              </span>
                            )}
                          </div>
                          <div
                            style={{
                              display: 'flex',
                              flexDirection: 'column',
                              gap: 3,
                            }}
                          >
                            {visible.map(task => (
                              <Chip
                                key={task.id}
                                task={task}
                                past={isPast(task)}
                                isDragging={dragging?.id === task.id}
                                onDragStart={onDragStart}
                                onDragEnd={onDragEnd}
                                onEdit={() =>
                                  setModal({ mode: 'edit', task: { ...task } })
                                }
                                onSaveActual={h =>
                                  updateActualHours(task.id, h)
                                }
                              />
                            ))}
                            {hiddenCount > 0 && !isExp && (
                              <button
                                className='more-btn'
                                onClick={e => toggleExpand(key, e)}
                              >
                                +{hiddenCount}개 더 보기
                              </button>
                            )}
                            {hiddenCount > 0 && isExp && (
                              <button
                                className='more-btn'
                                onClick={e => toggleExpand(key, e)}
                              >
                                접기
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </Fragment>
          );
        })}
      </div>

      {/* Modal */}
      {modal && (
        <div
          className='modal-bg'
          onClick={() => setModal(null)}
          style={{
            position: 'fixed',
            inset: 0,
            background: '#00000030',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 999,
            padding: 24,
          }}
        >
          <div
            className='modal-box'
            onClick={e => e.stopPropagation()}
            style={{
              background: '#fff',
              borderRadius: 16,
              padding: '28px 28px 24px',
              width: '100%',
              maxWidth: 480,
              boxShadow: '0 24px 64px #00000028',
            }}
          >
            <TaskForm
              task={modal.task}
              mode={modal.mode}
              onSave={saveTask}
              onDelete={deleteTask}
              onCancel={() => setModal(null)}
            />
          </div>
        </div>
      )}

      <ToastList toasts={toasts} />
    </div>
  );
}

export default CalendarV2;

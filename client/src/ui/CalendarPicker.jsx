import { useState, useEffect, useRef, useCallback } from 'react';

// ─── helpers ──────────────────────────────────────────────────────────────────
function pad(n) { return String(n).padStart(2, '0'); }

function todayMidnight() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

function ymd(d) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function daysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function firstDayOfMonth(year, month) {
  return new Date(year, month, 1).getDay(); // 0 = Sun
}

const MONTHS = ['January','February','March','April','May','June',
                'July','August','September','October','November','December'];
const DAYS   = ['Su','Mo','Tu','We','Th','Fr','Sa'];

// ─── CalendarPicker ───────────────────────────────────────────────────────────
/**
 * Props:
 *   value       — "YYYY-MM-DD" string or ''
 *   onChange    — (value: string) => void
 *   minDate     — "YYYY-MM-DD" string (optional)
 *   placeholder — string
 *   label       — string shown above the trigger
 */
export default function CalendarPicker({ value, onChange, minDate, placeholder = 'Pick a date', label }) {
  const [open,        setOpen]        = useState(false);
  const [viewYear,    setViewYear]    = useState(null);
  const [viewMonth,   setViewMonth]   = useState(null);
  const wrapRef = useRef(null);

  // Initialise view to the selected date (or today)
  useEffect(() => {
    const base = value ? new Date(value + 'T00:00:00') : new Date();
    setViewYear(base.getFullYear());
    setViewMonth(base.getMonth());
  }, [value]);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const minD = minDate ? new Date(minDate + 'T00:00:00') : null;

  const prevMonth = useCallback(() => {
    setViewMonth(m => {
      if (m === 0) { setViewYear(y => y - 1); return 11; }
      return m - 1;
    });
  }, []);

  const nextMonth = useCallback(() => {
    setViewMonth(m => {
      if (m === 11) { setViewYear(y => y + 1); return 0; }
      return m + 1;
    });
  }, []);

  const selectDay = (day) => {
    const chosen = new Date(viewYear, viewMonth, day);
    onChange(ymd(chosen));
    setOpen(false);
  };

  const clear = (e) => {
    e.stopPropagation();
    onChange('');
  };

  if (viewYear === null) return null;

  const totalDays   = daysInMonth(viewYear, viewMonth);
  const startOffset = firstDayOfMonth(viewYear, viewMonth);
  const today       = todayMidnight();

  // Format display
  const displayValue = value
    ? new Date(value + 'T00:00:00').toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
    : '';

  // Build grid cells: nulls for empty leading slots, then day numbers
  const cells = [
    ...Array(startOffset).fill(null),
    ...Array.from({ length: totalDays }, (_, i) => i + 1)
  ];
  // Pad to full weeks
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <div className="cal-wrap" ref={wrapRef}>
      {/* Trigger */}
      <div
        className={`cal-trigger ${open ? 'cal-trigger--open' : ''} ${value ? 'cal-trigger--filled' : ''}`}
        onClick={() => setOpen(o => !o)}
        role="button"
        tabIndex={0}
        onKeyDown={e => e.key === 'Enter' && setOpen(o => !o)}
      >
        <span className="cal-trigger-icon">📅</span>
        <span className="cal-trigger-text">{displayValue || placeholder}</span>
        {value && (
          <button
            type="button"
            className="cal-clear-btn"
            onClick={clear}
            tabIndex={-1}
            aria-label="Clear date"
          >✕</button>
        )}
      </div>

      {/* Dropdown */}
      {open && (
        <div className="cal-dropdown">
          {/* Month nav */}
          <div className="cal-header">
            <button type="button" className="cal-nav-btn" onClick={prevMonth}>‹</button>
            <span className="cal-month-label">{MONTHS[viewMonth]} {viewYear}</span>
            <button type="button" className="cal-nav-btn" onClick={nextMonth}>›</button>
          </div>

          {/* Day headers */}
          <div className="cal-grid">
            {DAYS.map(d => (
              <div key={d} className="cal-day-header">{d}</div>
            ))}

            {/* Day cells */}
            {cells.map((day, i) => {
              if (!day) return <div key={`e-${i}`} className="cal-cell cal-cell--empty" />;

              const cellDate  = new Date(viewYear, viewMonth, day);
              const isToday   = cellDate.getTime() === today.getTime();
              const isSelected = value === ymd(cellDate);
              const isPast    = minD && cellDate < minD;

              let cls = 'cal-cell';
              if (isToday)    cls += ' cal-cell--today';
              if (isSelected) cls += ' cal-cell--selected';
              if (isPast)     cls += ' cal-cell--disabled';

              return (
                <button
                  key={day}
                  type="button"
                  className={cls}
                  disabled={isPast}
                  onClick={() => !isPast && selectDay(day)}
                >
                  {day}
                </button>
              );
            })}
          </div>

          {/* Today shortcut */}
          <div className="cal-footer">
            <button
              type="button"
              className="cal-today-btn"
              onClick={() => { onChange(ymd(today)); setOpen(false); }}
              disabled={minD && today < minD}
            >
              Today
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

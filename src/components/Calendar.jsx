import { useState, useMemo } from 'react';

const MONTH_NAMES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];

const DAY_NAMES = ['LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB', 'DOM'];

function parseDeadline(deadlineStr) {
  const months = {
    Enero: 0, Febrero: 1, Marzo: 2, Abril: 3, Mayo: 4, Junio: 5,
    Julio: 6, Agosto: 7, Septiembre: 8, Octubre: 9, Noviembre: 10, Diciembre: 11,
  };
  const parts = deadlineStr.split(' ');
  if (parts.length < 3) return null;
  const day = parseInt(parts[0], 10);
  const month = months[parts[1]];
  const year = parseInt(parts[2], 10);
  if (isNaN(day) || month === undefined || isNaN(year)) return null;
  return new Date(year, month, day);
}

export default function Calendar({ activities, onActivityClick }) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const activityMap = useMemo(() => {
    const map = {};
    activities.forEach((a) => {
      const d = parseDeadline(a.deadline);
      if (d) {
        const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
        if (!map[key]) map[key] = [];
        map[key].push(a);
      }
    });
    return map;
  }, [activities]);

  const firstDay = new Date(year, month, 1);
  let startDow = firstDay.getDay();
  startDow = startDow === 0 ? 6 : startDow - 1;

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const cells = [];

  for (let i = startDow - 1; i >= 0; i--) {
    cells.push({ day: daysInPrevMonth - i, inMonth: false, activities: [] });
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const key = `${year}-${month}-${d}`;
    cells.push({
      day: d,
      inMonth: true,
      date: new Date(year, month, d),
      activities: activityMap[key] || [],
    });
  }

  const remaining = 7 - (cells.length % 7);
  if (remaining < 7) {
    for (let i = 1; i <= remaining; i++) {
      cells.push({ day: i, inMonth: false, activities: [] });
    }
  }

  const today = new Date();
  const isToday = (d) =>
    d &&
    d.getDate() === today.getDate() &&
    d.getMonth() === today.getMonth() &&
    d.getFullYear() === today.getFullYear();

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
  const goToday = () => setCurrentDate(new Date());

  const getEventClass = (status) => {
    switch (status) {
      case 'graded':
        return 'cal-event--graded';
      case 'submitted':
        return 'cal-event--submitted';
      default:
        return 'cal-event--pending';
    }
  };

  return (
    <div className="cal-wrapper">
      {/* Header */}
      <div className="cal-header">
        <div className="cal-header-left">
          <button className="cal-nav-btn" onClick={prevMonth}>‹</button>
          <button className="cal-nav-btn" onClick={nextMonth}>›</button>
          <button className="cal-today-btn" onClick={goToday}>Hoy</button>
        </div>
        <h3 className="cal-month-title">
          {MONTH_NAMES[month]} {year}
        </h3>
      </div>

      {/* Day name headers */}
      <div className="cal-day-headers">
        {DAY_NAMES.map((d) => (
          <div key={d} className="cal-col-header">{d}</div>
        ))}
      </div>

      {/* Single flat grid — all cells in one grid so rows auto-size uniformly */}
      <div className="cal-grid">
        {cells.map((cell, idx) => (
          <div
            key={idx}
            className={`cal-cell${!cell.inMonth ? ' cal-cell--outside' : ''}${cell.date && isToday(cell.date) ? ' cal-cell--today' : ''}`}
          >
            <span className={`cal-day-num${cell.date && isToday(cell.date) ? ' cal-day-num--today' : ''}`}>
              {cell.day}
            </span>
            {cell.activities.length > 0 && (
              <div className="cal-events">
                {cell.activities.map((a) => (
                  <button
                    key={a.id}
                    className={`cal-event ${getEventClass(a.status)}`}
                    onClick={() => onActivityClick(a.id)}
                    title={`${a.subject}: ${a.title}`}
                  >
                    <span className="cal-event-subject">{a.subject}:</span>
                    <span className="cal-event-title">{a.title}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="cal-legend">
        <div className="cal-legend-item">
          <span className="cal-legend-dot cal-legend-dot--pending" />
          <span>Pendiente</span>
        </div>
        <div className="cal-legend-item">
          <span className="cal-legend-dot cal-legend-dot--submitted" />
          <span>Entregada</span>
        </div>
        <div className="cal-legend-item">
          <span className="cal-legend-dot cal-legend-dot--graded" />
          <span>Calificada</span>
        </div>
      </div>
    </div>
  );
}

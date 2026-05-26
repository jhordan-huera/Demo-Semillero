import { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';

const DAYS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

function MiniCalendar({ homework }) {
  const today = new Date();
  const [currentMonth] = useState(today.getMonth());
  const [currentYear] = useState(today.getFullYear());

  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const monthName = new Date(currentYear, currentMonth).toLocaleDateString('es', { month: 'long', year: 'numeric' });

  // Parse deadlines to day numbers
  const deadlineDays = useMemo(() => {
    const map = {};
    homework.forEach((hw) => {
      const match = hw.deadline.match(/(\d+)\s/);
      if (match) {
        const day = parseInt(match[1]);
        if (!map[day]) map[day] = [];
        map[day].push(hw);
      }
    });
    return map;
  }, [homework]);

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(<div key={`e-${i}`} className="cal-cell cal-cell--empty" />);
  for (let d = 1; d <= daysInMonth; d++) {
    const isToday = d === today.getDate() && currentMonth === today.getMonth();
    const hasHw = deadlineDays[d];
    cells.push(
      <div key={d} className={`cal-cell${isToday ? ' cal-cell--today' : ''}${hasHw ? ' cal-cell--has-hw' : ''}`}>
        <span className="cal-day">{d}</span>
        {hasHw && <span className="cal-dot" />}
      </div>
    );
  }

  return (
    <div className="mini-calendar">
      <div className="cal-month">{monthName}</div>
      <div className="cal-grid">
        {DAYS.map((d) => <div key={d} className="cal-header">{d}</div>)}
        {cells}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const {
    parentName, childName, currentChild, teacherNote,
    units, homework, completeHomework, completedCount, totalActivities,
  } = useApp();

  const [selectedHw, setSelectedHw] = useState(null);
  const [comment, setComment] = useState('');

  const pendingHw = homework.filter((h) => !h.completed);
  const completedHw = homework.filter((h) => h.completed);
  const activeUnits = units.filter((u) => u.status === 'active');

  const handleComplete = () => {
    if (selectedHw) {
      completeHomework(selectedHw.id, comment);
      setSelectedHw(null);
      setComment('');
    }
  };

  return (
    <div className="page">
      <div className="page-content">
        {/* Header */}
        <div className="page-header">
          <div>
            <h1 className="page-title">¡Hola, {parentName?.split(' ')[0]}! 👋</h1>
            <p className="page-subtitle">Seguimiento de {childName}</p>
          </div>
          <div className="header-progress">
            <span className="header-progress-count">{completedCount}/{totalActivities}</span>
            <span className="header-progress-label">realizadas</span>
          </div>
        </div>

        {/* RF-F01: Child Profile Card */}
        <div className="profile-card">
          <div className="profile-card-avatar" style={{ background: currentChild?.color }}>
            {currentChild?.avatar}
          </div>
          <div className="profile-card-info">
            <h2 className="profile-card-name">{childName}</h2>
            <div className="profile-card-details">
              <span className="profile-detail">📚 {currentChild?.group}</span>
              <span className="profile-detail">👩‍🏫 {currentChild?.teacher}</span>
              <span className="profile-detail">🎂 {currentChild?.age} años · {currentChild?.level}</span>
            </div>
          </div>
        </div>

        {/* Active Units */}
        {activeUnits.length > 0 && (
          <div className="units-section">
            <h3 className="section-title">📖 Unidades Activas</h3>
            <div className="units-grid">
              {activeUnits.map((unit) => (
                <div key={unit.id} className="unit-chip">
                  <span className="unit-chip-title">{unit.title}</span>
                  <span className="unit-chip-scope">{unit.scope} · {unit.weeks} semanas</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Teacher Note */}
        {teacherNote && (
          <div className="teacher-note">
            <p>{teacherNote}</p>
          </div>
        )}

        {/* Dashboard Grid: Calendar + Homework */}
        <div className="dashboard-grid">
          {/* Calendar */}
          <div className="dashboard-calendar-col">
            <h3 className="section-title">📅 Calendario</h3>
            <MiniCalendar homework={homework} />
          </div>

          {/* RF-F04: Homework */}
          <div className="dashboard-homework-col">
            <h3 className="section-title">📝 Actividades para Casa</h3>
            {pendingHw.length === 0 ? (
              <div className="empty-state-mini">
                <span>🎉</span> ¡Todas las actividades están realizadas!
              </div>
            ) : (
              <div className="homework-list">
                {pendingHw.map((hw) => (
                  <div key={hw.id} className="homework-item" onClick={() => { setSelectedHw(hw); setComment(''); }}>
                    <div className="homework-item-check">
                      <span className="homework-checkbox">○</span>
                    </div>
                    <div className="homework-item-info">
                      <span className="homework-item-title">{hw.title}</span>
                      <span className="homework-item-meta">{hw.unit} · {hw.deadline}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Completed */}
            {completedHw.length > 0 && (
              <>
                <h3 className="section-title" style={{ marginTop: 'var(--space-lg)' }}>✅ Realizadas</h3>
                <div className="homework-list">
                  {completedHw.map((hw) => (
                    <div key={hw.id} className="homework-item homework-item--done" onClick={() => { setSelectedHw(hw); setComment(''); }}>
                      <div className="homework-item-check">
                        <span className="homework-checkbox homework-checkbox--done">✓</span>
                      </div>
                      <div className="homework-item-info">
                        <span className="homework-item-title homework-item-title--done">{hw.title}</span>
                        <span className="homework-item-meta">{hw.unit} {hw.comment && `· "${hw.comment}"`}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Modal for homework detail */}
        {selectedHw && (
          <div className="modal-overlay" onClick={() => setSelectedHw(null)}>
            <div className="modal-container" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <div className="modal-header-left">
                  <span className="modal-icon">📝</span>
                  <div>
                    <h2 className="modal-title">{selectedHw.title}</h2>
                    <span className="modal-subject">{selectedHw.unit} · {selectedHw.deadline}</span>
                  </div>
                </div>
                <button className="modal-close" onClick={() => setSelectedHw(null)}>✕</button>
              </div>

              <div className="modal-section">
                <h4 className="modal-section-title">📋 Instrucciones</h4>
                <p className="modal-description">{selectedHw.description}</p>
              </div>

              <div className="modal-section">
                {selectedHw.completed ? (
                  <div className="homework-done-badge">
                    <span>✅ Actividad realizada</span>
                    {selectedHw.comment && (
                      <p className="homework-done-comment">💬 "{selectedHw.comment}"</p>
                    )}
                  </div>
                ) : (
                  <div className="homework-action-section">
                    <label className="homework-comment-label" htmlFor="hw-comment">
                      Comentario breve (opcional)
                    </label>
                    <textarea
                      id="hw-comment"
                      className="homework-comment-input"
                      placeholder="Ej: Le costó un poco pero lo logró..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      rows={3}
                    />
                    <button className="homework-complete-btn" onClick={handleComplete}>
                      ✅ Marcar como realizada
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

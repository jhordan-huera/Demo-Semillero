import { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import ActivityModal from '../components/ActivityModal';

export default function Performance() {
  const { activities, childName, submitActivity, getActivity } = useApp();
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [modalActivityId, setModalActivityId] = useState(null);

  const openModal = (id) => setModalActivityId(id);
  const closeModal = () => setModalActivityId(null);
  const modalActivity = modalActivityId ? getActivity(modalActivityId) : null;

  // Group activities by subject
  const subjectMap = useMemo(() => {
    const map = {};
    activities.forEach((a) => {
      if (!map[a.subject]) {
        map[a.subject] = { activities: [], icon: a.icon };
      }
      map[a.subject].activities.push(a);
    });
    return map;
  }, [activities]);

  const subjects = Object.keys(subjectMap);

  // Stats for each subject
  const getSubjectStats = (subjectActivities) => {
    const total = subjectActivities.length;
    const completed = subjectActivities.filter(
      (a) => a.status === 'submitted' || a.status === 'graded'
    ).length;
    const graded = subjectActivities.filter((a) => a.status === 'graded').length;
    const pending = subjectActivities.filter((a) => a.status === 'pending').length;
    const progress = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { total, completed, graded, pending, progress };
  };

  // Global stats
  const globalStats = useMemo(() => {
    const total = activities.length;
    const completed = activities.filter(
      (a) => a.status === 'submitted' || a.status === 'graded'
    ).length;
    const graded = activities.filter((a) => a.status === 'graded').length;
    const pending = activities.filter((a) => a.status === 'pending').length;
    const progress = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { total, completed, graded, pending, progress };
  }, [activities]);

  // Filtered activities
  const filteredActivities =
    selectedSubject === 'all'
      ? activities
      : subjectMap[selectedSubject]?.activities || [];

  const getStatusLabel = (status) => {
    switch (status) {
      case 'submitted': return 'Entregada';
      case 'graded': return 'Calificada';
      default: return 'Pendiente';
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'submitted': return 'submitted';
      case 'graded': return 'graded';
      default: return 'pending';
    }
  };

  return (
    <div className="perf-page page">
      {/* Banner */}
      <div className="dashboard-banner">
        <div className="dashboard-banner-inner">
          <h1 style={{ fontSize: '1.25rem', fontWeight: 700 }}>
            📊 Reporte de {childName}
          </h1>
          <p style={{ opacity: 0.9, fontSize: '0.85rem', marginTop: 2 }}>
            Seguimiento de actividades y desempeño por materia
          </p>
        </div>
      </div>

      <div className="page-content">
        {/* Global Stats Cards */}
        <div className="perf-stats-grid">
          <div className="perf-stat-card">
            <div className="perf-stat-number">{globalStats.total}</div>
            <div className="perf-stat-label">Total</div>
          </div>
          <div className="perf-stat-card perf-stat-card--pending">
            <div className="perf-stat-number">{globalStats.pending}</div>
            <div className="perf-stat-label">Pendientes</div>
          </div>
          <div className="perf-stat-card perf-stat-card--submitted">
            <div className="perf-stat-number">
              {globalStats.completed - globalStats.graded}
            </div>
            <div className="perf-stat-label">Entregadas</div>
          </div>
          <div className="perf-stat-card perf-stat-card--graded">
            <div className="perf-stat-number">{globalStats.graded}</div>
            <div className="perf-stat-label">Calificadas</div>
          </div>
        </div>

        {/* Overall progress */}
        <div className="perf-overall-progress">
          <div className="perf-overall-header">
            <span className="perf-overall-label">Progreso General</span>
            <span className="perf-overall-pct">{globalStats.progress}%</span>
          </div>
          <div className="progress-bar" style={{ height: 10 }}>
            <div
              className="progress-fill"
              style={{ width: `${globalStats.progress}%` }}
            />
          </div>
        </div>

        {/* Subject Filter Tabs */}
        <div className="perf-subject-tabs">
          <button
            className={`perf-subject-tab${selectedSubject === 'all' ? ' perf-subject-tab--active' : ''}`}
            onClick={() => setSelectedSubject('all')}
          >
            📚 Todas
          </button>
          {subjects.map((subj) => {
            const stats = getSubjectStats(subjectMap[subj].activities);
            return (
              <button
                key={subj}
                className={`perf-subject-tab${selectedSubject === subj ? ' perf-subject-tab--active' : ''}`}
                onClick={() => setSelectedSubject(subj)}
              >
                {subjectMap[subj].icon} {subj}
                <span className="perf-subject-tab-count">
                  {stats.completed}/{stats.total}
                </span>
              </button>
            );
          })}
        </div>

        {/* Subject Summary (when specific subject selected) */}
        {selectedSubject !== 'all' && (
          <div className="perf-subject-summary">
            <div className="perf-subject-summary-header">
              <span className="perf-subject-summary-icon">
                {subjectMap[selectedSubject].icon}
              </span>
              <div>
                <h3 className="perf-subject-summary-name">{selectedSubject}</h3>
                <p className="perf-subject-summary-sub">
                  {getSubjectStats(subjectMap[selectedSubject].activities).total} actividades asignadas
                </p>
              </div>
            </div>
            <div className="perf-subject-summary-stats">
              {(() => {
                const s = getSubjectStats(subjectMap[selectedSubject].activities);
                return (
                  <>
                    <div className="perf-mini-stat">
                      <span className="perf-mini-stat-num perf-mini-stat--pending">{s.pending}</span>
                      <span className="perf-mini-stat-label">Pendiente{s.pending !== 1 ? 's' : ''}</span>
                    </div>
                    <div className="perf-mini-stat">
                      <span className="perf-mini-stat-num perf-mini-stat--submitted">{s.completed - s.graded}</span>
                      <span className="perf-mini-stat-label">Entregada{(s.completed - s.graded) !== 1 ? 's' : ''}</span>
                    </div>
                    <div className="perf-mini-stat">
                      <span className="perf-mini-stat-num perf-mini-stat--graded">{s.graded}</span>
                      <span className="perf-mini-stat-label">Calificada{s.graded !== 1 ? 's' : ''}</span>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        )}

        {/* Activity List */}
        <div className="perf-activity-list">
          {filteredActivities.length === 0 ? (
            <div className="perf-empty">
              <div className="perf-empty-emoji">📝</div>
              <div className="perf-empty-text">No hay actividades</div>
              <div className="perf-empty-sub">
                Aún no se han asignado actividades en esta materia.
              </div>
            </div>
          ) : (
            filteredActivities.map((activity, idx) => (
              <div
                key={activity.id}
                className="perf-activity-card"
                style={{ animationDelay: `${0.06 * (idx + 1)}s` }}
                onClick={() => openModal(activity.id)}
              >
                <div className="perf-activity-card-left">
                  <div className="perf-activity-card-icon">{activity.icon}</div>
                  <div className="perf-activity-card-info">
                    <div className="perf-activity-card-title">{activity.title}</div>
                    <div className="perf-activity-card-subject">{activity.subject}</div>
                    <div className="perf-activity-card-deadline">📅 {activity.deadline}</div>
                  </div>
                </div>
                <div className="perf-activity-card-right">
                  <span className={`status-badge ${getStatusClass(activity.status)}`}>
                    {getStatusLabel(activity.status)}
                  </span>
                  {activity.status === 'graded' && (
                    <div className="perf-activity-card-grade">
                      ⭐ {activity.teacherGrade}
                    </div>
                  )}
                  {activity.parentEvaluation && (
                    <div className="perf-activity-card-eval">
                      👨‍👩‍👧 {activity.parentEvaluation}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Activity Modal */}
      {modalActivity && (
        <ActivityModal
          activity={modalActivity}
          onClose={closeModal}
          onSubmitEvidence={(id, evalText, comment, file) => {
            submitActivity(id, evalText, comment, file);
            closeModal();
          }}
          childName={childName}
        />
      )}
    </div>
  );
}

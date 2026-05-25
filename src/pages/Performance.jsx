import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function Performance() {
  const navigate = useNavigate();
  const { activities, childName } = useApp();

  const completedActivities = activities.filter(
    (a) => a.status === 'submitted' || a.status === 'graded'
  );

  return (
    <div className="perf-page page">
      {/* Header */}
      <div className="perf-header">
        <div className="detail-title-area">
          <button className="detail-back" onClick={() => navigate('/dashboard')}>
            ← Volver al Dashboard
          </button>
          <h1 className="detail-title">📊 Desempeño de {childName}</h1>
          <div className="detail-meta">
            <span>
              {completedActivities.length} actividad
              {completedActivities.length !== 1 ? 'es' : ''} completada
              {completedActivities.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
      </div>

      <div className="perf-body">
        {completedActivities.length === 0 ? (
          <div className="perf-empty">
            <div className="perf-empty-emoji">📝</div>
            <div className="perf-empty-text">Aún no hay actividades completadas</div>
            <div className="perf-empty-sub">
              ¡Anímate a realizar la primera misión para ver el desempeño aquí!
            </div>
          </div>
        ) : (
          completedActivities.map((activity, idx) => (
            <div
              key={activity.id}
              className="perf-card"
              style={{ animationDelay: `${0.1 * (idx + 1)}s` }}
            >
              <div className="perf-card-title">
                {activity.icon} {activity.title}
              </div>

              <div className="perf-card-row">
                <span className="perf-card-label">Materia:</span>
                <span className="perf-card-value">{activity.subject}</span>
              </div>

              <div className="perf-card-row">
                <span className="perf-card-label">Tu evaluación:</span>
                <span className="perf-card-value">
                  {activity.parentEvaluation}
                </span>
              </div>

              {activity.parentComment && (
                <div className="perf-card-row">
                  <span className="perf-card-label">Tu comentario:</span>
                  <span
                    className="perf-card-value"
                    style={{ fontStyle: 'italic', opacity: 0.85 }}
                  >
                    "{activity.parentComment}"
                  </span>
                </div>
              )}

              {activity.uploadedFile && (
                <div className="perf-card-row">
                  <span className="perf-card-label">Archivo:</span>
                  <span className="perf-card-value">
                    📎 {activity.uploadedFile}
                  </span>
                </div>
              )}

              {activity.status === 'graded' ? (
                <>
                  <div
                    className="perf-card-row"
                    style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px solid var(--gray-200)' }}
                  >
                    <span className="perf-card-label">Nota docente:</span>
                    <span className="perf-card-value" style={{ color: 'var(--success)' }}>
                      {activity.teacherGrade}
                    </span>
                  </div>
                  <div className="perf-card-row">
                    <span className="perf-card-label">Retroalimentación:</span>
                    <span className="perf-card-value">
                      {activity.teacherFeedback}
                    </span>
                  </div>
                </>
              ) : (
                <div
                  className="perf-card-row"
                  style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px solid var(--gray-200)' }}
                >
                  <span className="perf-card-label">Estado:</span>
                  <span className="perf-card-value" style={{ color: 'var(--info)' }}>
                    ⏳ Esperando calificación de la docente...
                  </span>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

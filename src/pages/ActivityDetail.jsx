import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function ActivityDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getActivity, childName } = useApp();

  const activity = getActivity(id);

  if (!activity) {
    return (
      <div className="detail-page page">
        <div className="detail-header">
          <button className="detail-back" onClick={() => navigate('/dashboard')}>
            ← Volver
          </button>
        </div>
        <div className="detail-body">
          <div className="perf-empty">
            <div className="perf-empty-emoji">🔍</div>
            <div className="perf-empty-text">Actividad no encontrada</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="detail-page page">
      {/* Header */}
      <div className="detail-header">
        <div className="detail-title-area">
          <button className="detail-back" onClick={() => navigate('/dashboard')}>
            ← Volver al Dashboard
          </button>
          <span className="detail-subject-badge">{activity.subject}</span>
          <h1 className="detail-title">{activity.title}</h1>
          <div className="detail-meta">
            <span>📅 Fecha límite: {activity.deadline}</span>
            <span>•</span>
            <span>
              {activity.status === 'pending'
                ? '⏳ Pendiente'
                : activity.status === 'submitted'
                  ? '📤 Entregada'
                  : '✅ Calificada'}
            </span>
          </div>
        </div>
      </div>

      <div className="detail-body">
        {/* Instructions */}
        <div className="detail-instructions">
          <h3>📝 Instrucciones de la Docente</h3>
          <p>{activity.description}</p>
        </div>

        {/* Teacher Grade (if graded) */}
        {activity.status === 'graded' && (
          <div className="graded-card">
            <h3>✅ Calificación de la Docente</h3>
            <div className="graded-row">
              <span className="graded-label">Nota:</span>
              <span className="graded-value">{activity.teacherGrade}</span>
            </div>
            <div className="graded-row">
              <span className="graded-label">Retroalimentación:</span>
              <span className="graded-value">{activity.teacherFeedback}</span>
            </div>
          </div>
        )}

        {/* Parent Evaluation (if submitted) */}
        {(activity.status === 'submitted' || activity.status === 'graded') && (
          <div className="parent-eval-card">
            <h3>👨‍👩‍👧 Tu Evaluación</h3>
            <p className="parent-eval-text">{activity.parentEvaluation}</p>
            {activity.parentComment && (
              <p
                className="parent-eval-text"
                style={{ marginTop: '8px', opacity: 0.8, fontStyle: 'italic' }}
              >
                "{activity.parentComment}"
              </p>
            )}
            {activity.uploadedFile && (
              <div
                style={{
                  marginTop: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '0.85rem',
                  color: '#4D96FF',
                }}
              >
                📎 Archivo adjunto: <strong>{activity.uploadedFile}</strong>
              </div>
            )}
          </div>
        )}

        {/* Submit Button (if pending) */}
        {activity.status === 'pending' && (
          <button
            className="btn-primary"
            onClick={() => navigate(`/submit/${activity.id}`)}
            style={{ animation: 'fadeInUp 0.5s var(--ease-out) 0.3s both' }}
          >
            📤 Subir Evidencia
          </button>
        )}

        {/* Back Button (if already submitted) */}
        {activity.status !== 'pending' && (
          <button
            className="btn-primary"
            onClick={() => navigate('/dashboard')}
            style={{
              background: 'linear-gradient(135deg, var(--gray-600), var(--dark-700))',
              animation: 'fadeInUp 0.5s var(--ease-out) 0.3s both',
            }}
          >
            ← Volver al Dashboard
          </button>
        )}
      </div>
    </div>
  );
}

import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import Calendar from '../components/Calendar';

export default function Dashboard() {
  const {
    parentName,
    childName,
    activities,
    completedCount,
    totalActivities,
    teacherNote,
  } = useApp();
  const navigate = useNavigate();

  const progress =
    totalActivities > 0
      ? Math.round((completedCount / totalActivities) * 100)
      : 0;

  const getStatusClass = (status) => {
    switch (status) {
      case 'submitted':
        return 'status-submitted';
      case 'graded':
        return 'status-graded';
      default:
        return 'status-pending';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'submitted':
        return 'Entregada';
      case 'graded':
        return 'Calificada';
      default:
        return 'Pendiente';
    }
  };

  return (
    <div className="dashboard-page page">
      {/* Welcome Banner */}
      <div className="dashboard-banner">
        <div className="dashboard-banner-inner">
          <div>
            <div className="dashboard-greeting">
              ¡Hola, {parentName.split(' ')[0]}! 👋
            </div>
            <div className="dashboard-greeting-sub">
              Trabajando con {childName}
            </div>
          </div>
        </div>
      </div>

      <div className="page-content">
        {/* Teacher Note */}
        <div className="teacher-note">
          <div className="teacher-note-header">
            <span>📋</span> Nota de la Docente
          </div>
          <p>{teacherNote}</p>
        </div>

        {/* Progress */}
        <div className="progress-section">
          <div className="progress-header">
            <span className="progress-label">Progreso Semanal</span>
            <span className="progress-count">
              {completedCount} de {totalActivities} ({progress}%)
            </span>
          </div>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Badges */}
        <div className="badges-section">
          <div className="badges-title">Mis Insignias</div>
          <div className="badges-row">
            <div
              className={`badge-item ${completedCount >= 1 ? 'unlocked' : 'locked'}`}
            >
              <div className="badge-emoji">🥉</div>
              <div className="badge-label">
                Padre
                <br />
                Involucrado
              </div>
            </div>
            <div
              className={`badge-item ${completedCount >= 2 ? 'unlocked' : 'locked'}`}
            >
              <div className="badge-emoji">🥈</div>
              <div className="badge-label">
                Guía
                <br />
                Estelar
              </div>
            </div>
            <div
              className={`badge-item ${completedCount >= 3 ? 'unlocked' : 'locked'}`}
            >
              <div className="badge-emoji">🥇</div>
              <div className="badge-label">
                Héroe del
                <br />
                Fin de Semana
              </div>
            </div>
          </div>
        </div>

        {/* Calendar */}
        <Calendar
          activities={activities}
          onActivityClick={(id) => navigate(`/activity/${id}`)}
        />

        {/* Activities Section */}
        <div className="section-header">
          <h2 className="section-title">Actividades Asignadas</h2>
          <button
            className="btn-link"
            onClick={() => navigate('/performance')}
          >
            Ver Reporte →
          </button>
        </div>

        <div className="activity-list">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className={`activity-card ${getStatusClass(activity.status)}`}
              onClick={() => navigate(`/activity/${activity.id}`)}
            >
              <div className="activity-card-header">
                <div className="activity-card-icon">{activity.icon}</div>
                <div className="activity-card-info">
                  <div className="activity-card-title">{activity.title}</div>
                  <div className="activity-card-subject">
                    {activity.subject}
                  </div>
                </div>
              </div>
              <div className="activity-card-footer">
                <span className="activity-card-deadline">
                  📅 {activity.deadline}
                </span>
                <span
                  className={`status-badge ${activity.status === 'pending' ? 'pending' : activity.status === 'submitted' ? 'submitted' : 'graded'}`}
                >
                  {getStatusLabel(activity.status)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

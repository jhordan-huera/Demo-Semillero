import { useApp } from '../context/AppContext';

const LEVEL_CONFIG = {
  iniciado: { label: 'Iniciado', color: '#E53935', bg: '#FFEBEE', emoji: '🔴' },
  en_proceso: { label: 'En Proceso', color: '#FB8C00', bg: '#FFF3E0', emoji: '🟡' },
  logrado: { label: 'Logrado', color: '#43A047', bg: '#E8F5E9', emoji: '🟢' },
};

export default function Progress() {
  const { childName, currentChild, rubricCriteria, evaluations } = useApp();

  return (
    <div className="page">
      <div className="page-content">
        <div className="page-header">
          <div>
            <h1 className="page-title">Progreso de {childName?.split(' ')[0]}</h1>
            <p className="page-subtitle">Rúbrica Cognitiva — Evaluación del docente</p>
          </div>
        </div>

        {/* Legend */}
        <div className="rubric-legend">
          {Object.values(LEVEL_CONFIG).map((l) => (
            <span key={l.label} className="rubric-legend-item">
              <span>{l.emoji}</span> {l.label}
            </span>
          ))}
        </div>

        {/* Rubric Cards */}
        <div className="rubric-grid">
          {rubricCriteria.map((criteria) => {
            const evaluation = evaluations[criteria.id];
            const levelInfo = evaluation ? LEVEL_CONFIG[evaluation.level] : null;

            return (
              <div key={criteria.id} className="rubric-card">
                <div className="rubric-card-header">
                  <span className="rubric-card-icon">{criteria.icon}</span>
                  <div>
                    <h3 className="rubric-card-name">{criteria.name}</h3>
                    <p className="rubric-card-desc">{criteria.description}</p>
                  </div>
                </div>

                {levelInfo ? (
                  <>
                    <div
                      className="rubric-level-badge"
                      style={{ background: levelInfo.bg, color: levelInfo.color }}
                    >
                      {levelInfo.emoji} {levelInfo.label}
                    </div>

                    {/* Progress bar visual */}
                    <div className="rubric-progress-bar">
                      <div
                        className="rubric-progress-fill"
                        style={{
                          width: evaluation.level === 'logrado' ? '100%' : evaluation.level === 'en_proceso' ? '55%' : '20%',
                          background: levelInfo.color,
                        }}
                      />
                    </div>

                    <div className="rubric-observation">
                      <div className="rubric-observation-label">📝 Observación del docente</div>
                      <p className="rubric-observation-text">{evaluation.observation}</p>
                      <span className="rubric-observation-date">Evaluado: {evaluation.date}</span>
                    </div>
                  </>
                ) : (
                  <div className="rubric-no-eval">Aún no evaluado</div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

import { useApp } from '../context/AppContext';

const LEVEL_CONFIG = {
  iniciado: { label: 'I', color: '#E53935', bg: '#FFEBEE', full: 'Iniciado' },
  en_proceso: { label: 'EP', color: '#FB8C00', bg: '#FFF3E0', full: 'En Proceso' },
  logrado: { label: 'L', color: '#43A047', bg: '#E8F5E9', full: 'Logrado' },
};

const SHORT_CRITERIA = {
  clasificacion: 'Clasif.',
  seriacion: 'Seriac.',
  construccion: 'Constr.',
  pensamiento: 'Pens. Lóg.',
  metacognicion: 'Metacog.',
};

export default function History() {
  const { childName, history, rubricCriteria } = useApp();

  // Group history entries by unit
  const unitGroups = {};
  history.forEach((entry) => {
    if (!unitGroups[entry.unitId]) {
      unitGroups[entry.unitId] = { title: entry.unitTitle, entries: [] };
    }
    unitGroups[entry.unitId].entries.push(entry);
  });

  return (
    <div className="page">
      <div className="page-content">
        <div className="page-header">
          <div>
            <h1 className="page-title">Historial de {childName?.split(' ')[0]}</h1>
            <p className="page-subtitle">Evolución del progreso por unidad didáctica</p>
          </div>
        </div>

        {/* Legend */}
        <div className="rubric-legend">
          {Object.values(LEVEL_CONFIG).map((l) => (
            <span key={l.full} className="rubric-legend-item">
              <span
                className="history-dot"
                style={{ background: l.color }}
              />
              {l.full}
            </span>
          ))}
        </div>

        {Object.entries(unitGroups).map(([unitId, group]) => (
          <div key={unitId} className="history-unit-section">
            <h2 className="history-unit-title">{group.title}</h2>

            {/* Timeline table */}
            <div className="history-table-wrapper">
              <table className="history-table">
                <thead>
                  <tr>
                    <th>Criterio</th>
                    {group.entries.map((entry, i) => (
                      <th key={i} className="history-date-col">{entry.date}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rubricCriteria.map((c) => (
                    <tr key={c.id}>
                      <td className="history-criteria-cell">
                        <span className="history-criteria-icon">{c.icon}</span>
                        <span className="history-criteria-name">{c.name}</span>
                        <span className="history-criteria-short">{SHORT_CRITERIA[c.id]}</span>
                      </td>
                      {group.entries.map((entry, i) => {
                        const lvl = entry.evaluations[c.id];
                        const info = LEVEL_CONFIG[lvl];
                        return (
                          <td key={i} className="history-level-cell">
                            <span
                              className="history-level-pill"
                              style={{ background: info.bg, color: info.color }}
                              title={info.full}
                            >
                              {info.label}
                            </span>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Visual evolution arrows */}
            {group.entries.length > 1 && (
              <div className="history-evolution">
                <span className="history-evolution-label">📈 Evolución:</span>
                {rubricCriteria.map((c) => {
                  const first = group.entries[0].evaluations[c.id];
                  const last = group.entries[group.entries.length - 1].evaluations[c.id];
                  const levels = ['iniciado', 'en_proceso', 'logrado'];
                  const diff = levels.indexOf(last) - levels.indexOf(first);
                  return (
                    <span key={c.id} className="history-evolution-item">
                      {c.icon}
                      {diff > 0 ? '⬆️' : diff === 0 ? '➡️' : '⬇️'}
                    </span>
                  );
                })}
              </div>
            )}
          </div>
        ))}

        {history.length === 0 && (
          <div className="empty-state">
            <span className="empty-state-icon">📭</span>
            <p>Aún no hay historial de evaluaciones</p>
          </div>
        )}
      </div>
    </div>
  );
}

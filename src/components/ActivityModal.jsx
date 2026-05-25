import { useState, useRef, useEffect } from 'react';

const EVAL_OPTIONS = [
  { key: 'solo', label: 'Lo logró solito 🎉', emoji: '🎉', text: 'Lo logró solito', className: 'success' },
  { key: 'juntos', label: 'Lo hicimos juntos 🤝', emoji: '🤝', text: 'Lo hicimos juntos', className: 'info' },
  { key: 'dificultades', label: 'Tuvimos algunas dificultades', emoji: '🌱', text: 'Tuvimos algunas dificultades', className: 'warning' },
];

export default function ActivityModal({ activity, onClose, onSubmitEvidence, childName }) {
  const [view, setView] = useState('detail'); // 'detail' or 'submit'
  const [selectedEval, setSelectedEval] = useState(null);
  const [comment, setComment] = useState('');
  const [fileName, setFileName] = useState('');
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  // Close on Escape
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  // Prevent body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  // Reset form when switching views
  useEffect(() => {
    if (view === 'detail') {
      setSelectedEval(null);
      setComment('');
      setFileName('');
      setError('');
    }
  }, [view]);

  if (!activity) return null;

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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setFileName(file.name);
  };

  const handleSubmit = () => {
    setError('');
    if (!fileName) {
      setError('Por favor, sube un archivo como evidencia');
      return;
    }
    if (!selectedEval) {
      setError('Por favor, selecciona cómo le fue a tu hijo/a');
      return;
    }
    const evalText = EVAL_OPTIONS.find((o) => o.key === selectedEval)?.label || '';
    onSubmitEvidence(activity.id, evalText, comment, fileName);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div className="modal-header-left">
            <span className="modal-icon">{activity.icon}</span>
            <div>
              <h2 className="modal-title">{activity.title}</h2>
              <span className="modal-subject">{activity.subject}</span>
            </div>
          </div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        {/* Meta */}
        <div className="modal-meta">
          <span className="modal-meta-item">📅 {activity.deadline}</span>
          <span className={`status-badge ${getStatusClass(activity.status)}`}>
            {getStatusLabel(activity.status)}
          </span>
        </div>

        {/* ===== DETAIL VIEW ===== */}
        {view === 'detail' && (
          <>
            {/* Description */}
            <div className="modal-section">
              <h4 className="modal-section-title">📝 Instrucciones</h4>
              <p className="modal-description">
                {activity.description.split('\\n').map((line, i) => (
                  <span key={i}>
                    {line}
                    {i < activity.description.split('\\n').length - 1 && <br />}
                  </span>
                ))}
              </p>
            </div>

            {/* Graded info */}
            {activity.status === 'graded' && (
              <div className="modal-section modal-section--graded">
                <h4 className="modal-section-title">✅ Calificación Docente</h4>
                <div className="modal-grade-row">
                  <span className="modal-grade-label">Nota:</span>
                  <span className="modal-grade-value">{activity.teacherGrade}</span>
                </div>
                <div className="modal-grade-row">
                  <span className="modal-grade-label">Retroalimentación:</span>
                  <span className="modal-grade-feedback">{activity.teacherFeedback}</span>
                </div>
              </div>
            )}

            {/* Parent evaluation */}
            {(activity.status === 'submitted' || activity.status === 'graded') && (
              <div className="modal-section modal-section--eval">
                <h4 className="modal-section-title">👨‍👩‍👧 Tu Evaluación</h4>
                <p className="modal-eval-text">{activity.parentEvaluation}</p>
                {activity.parentComment && (
                  <p className="modal-eval-comment">"{activity.parentComment}"</p>
                )}
                {activity.uploadedFile && (
                  <div className="modal-file">📎 {activity.uploadedFile}</div>
                )}
              </div>
            )}

            {/* Waiting for grade */}
            {activity.status === 'submitted' && (
              <div className="modal-waiting">
                ⏳ Esperando calificación de la docente...
              </div>
            )}

            {/* Actions */}
            <div className="modal-actions">
              {activity.status === 'pending' && (
                <button className="btn-primary" onClick={() => setView('submit')}>
                  📤 Subir Evidencia
                </button>
              )}
            </div>
          </>
        )}

        {/* ===== SUBMIT VIEW ===== */}
        {view === 'submit' && (
          <>
            {/* Back to detail */}
            <div className="modal-section" style={{ paddingBottom: 0 }}>
              <button
                className="modal-back-btn"
                onClick={() => setView('detail')}
              >
                ← Volver a detalles
              </button>
            </div>

            {/* Upload Zone */}
            <div className="modal-section">
              <div
                className={`upload-zone-mini ${fileName ? 'has-file' : ''}`}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  style={{ display: 'none' }}
                  onChange={handleFileChange}
                  accept="image/*,.pdf,.doc,.docx"
                />
                <div className="upload-zone-mini-icon">{fileName ? '✅' : '📂'}</div>
                <div className="upload-zone-mini-text">
                  {fileName ? fileName : 'Toca para subir evidencia'}
                </div>
                <div className="upload-zone-mini-sub">
                  {fileName ? 'Toca para cambiar' : 'Foto, PDF o documento'}
                </div>
              </div>
            </div>

            {/* Evaluation */}
            <div className="modal-section">
              <h4 className="modal-section-title">
                ¿Cómo le fue a {childName}?
              </h4>
              <div className="modal-eval-options">
                {EVAL_OPTIONS.map((option) => (
                  <button
                    key={option.key}
                    className={`modal-eval-btn ${option.className}${selectedEval === option.key ? ' selected' : ''}`}
                    onClick={() => setSelectedEval(option.key)}
                  >
                    <span>{option.emoji}</span>
                    <span>{option.text}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Comment */}
            <div className="modal-section">
              <label className="modal-comment-label" htmlFor="modal-comment">
                Comentario (opcional)
              </label>
              <textarea
                id="modal-comment"
                className="modal-comment-textarea"
                placeholder="¿Cómo fue la experiencia?"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </div>

            {/* Error */}
            {error && (
              <div className="modal-error">⚠️ {error}</div>
            )}

            {/* Submit */}
            <div className="modal-actions">
              <button className="btn-primary" onClick={handleSubmit}>
                📤 Enviar Tarea
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

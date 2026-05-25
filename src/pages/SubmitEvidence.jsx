import { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const EVAL_OPTIONS = [
  {
    key: 'solo',
    label: 'Lo logró solito 🎉',
    emoji: '🎉',
    text: 'Lo logró solito',
    className: 'success',
  },
  {
    key: 'juntos',
    label: 'Lo hicimos juntos 🤝',
    emoji: '🤝',
    text: 'Lo hicimos juntos',
    className: 'info',
  },
  {
    key: 'dificultades',
    label: 'Tuvimos algunas dificultades',
    emoji: '🌱',
    text: 'Tuvimos algunas dificultades',
    className: 'warning',
  },
];

export default function SubmitEvidence() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getActivity, submitActivity, childName } = useApp();
  const fileInputRef = useRef(null);

  const [selectedEval, setSelectedEval] = useState(null);
  const [comment, setComment] = useState('');
  const [fileName, setFileName] = useState('');
  const [error, setError] = useState('');

  const activity = getActivity(id);

  if (!activity || activity.status !== 'pending') {
    return (
      <div className="submit-page page">
        <div className="detail-header">
          <div className="detail-title-area">
            <button className="detail-back" onClick={() => navigate('/dashboard')}>
              ← Volver
            </button>
          </div>
        </div>
        <div className="submit-body">
          <div className="perf-empty">
            <div className="perf-empty-emoji">📋</div>
            <div className="perf-empty-text">
              Esta actividad ya fue entregada
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
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
    submitActivity(activity.id, evalText, comment, fileName);
    navigate('/dashboard');
  };

  return (
    <div className="submit-page page">
      {/* Header */}
      <div className="detail-header">
        <div className="detail-title-area">
          <button className="detail-back" onClick={() => navigate(-1)}>
            ← Volver
          </button>
          <span className="detail-subject-badge">{activity.subject}</span>
          <h1 className="detail-title">{activity.title}</h1>
        </div>
      </div>

      <div className="submit-body">
        {/* Upload Zone */}
        <div
          className={`upload-zone ${fileName ? 'has-file' : ''}`}
          onClick={handleUploadClick}
        >
          <input
            ref={fileInputRef}
            type="file"
            style={{ display: 'none' }}
            onChange={handleFileChange}
            accept="image/*,.pdf,.doc,.docx"
          />
          <div className="upload-icon">{fileName ? '✅' : '📂'}</div>
          <div className="upload-text">
            {fileName
              ? '¡Archivo subido!'
              : 'Toca aquí para subir evidencia'}
          </div>
          <div className="upload-subtext">
            {fileName
              ? 'Toca para cambiar el archivo'
              : 'Foto, PDF o documento de la actividad completada'}
          </div>
          {fileName && (
            <div className="upload-filename">
              📎 {fileName}
            </div>
          )}
        </div>

        {/* Evaluation */}
        <div className="eval-section">
          <h3>¿Cómo le fue a {childName} en esta actividad?</h3>
          <div className="eval-options">
            {EVAL_OPTIONS.map((option) => (
              <button
                key={option.key}
                className={`eval-btn ${option.className} ${selectedEval === option.key ? 'selected' : ''}`}
                onClick={() => setSelectedEval(option.key)}
              >
                <span className="eval-btn-emoji">{option.emoji}</span>
                <span className="eval-btn-text">{option.text}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Comment */}
        <div className="comment-section">
          <label htmlFor="comment">Comentario (opcional)</label>
          <textarea
            id="comment"
            className="comment-textarea"
            placeholder="¿Cómo fue la experiencia? ¿Algún detalle que quieras compartir con la docente?"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </div>

        {/* Error */}
        {error && (
          <div
            className="login-error"
            style={{
              background: 'var(--danger-bg)',
              border: '1px solid var(--danger-light)',
              color: 'var(--danger)',
              marginBottom: 'var(--space-md)',
            }}
          >
            <span>⚠️</span> {error}
          </div>
        )}

        {/* Submit Button */}
        <button className="btn-primary" onClick={handleSubmit}>
          📤 Enviar Tarea
        </button>
      </div>
    </div>
  );
}

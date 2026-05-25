import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function Login() {
  const [cedula, setCedula] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, selectChild } = useApp();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!cedula.trim() || !password.trim()) {
      setError('Por favor, completa todos los campos');
      return;
    }

    const result = login(cedula.trim(), password.trim());
    if (result.success) {
      if (result.children.length === 1) {
        selectChild(result.children[0].id);
        navigate('/dashboard');
      } else {
        navigate('/select-child');
      }
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="login-page">
      <form className="login-card" onSubmit={handleSubmit}>
        <div className="login-icon">🎓</div>
        <h1 className="login-title">Bienvenido</h1>
        <p className="login-subtitle">
          Plataforma Digital para Padres de Familia
        </p>

        {error && (
          <div className="login-error">
            <span>⚠️</span>
            {error}
          </div>
        )}

        <div className="login-field">
          <label htmlFor="cedula">Cédula</label>
          <input
            id="cedula"
            type="text"
            placeholder="Ingresa tu número de cédula"
            value={cedula}
            onChange={(e) => setCedula(e.target.value)}
            autoComplete="username"
          />
        </div>

        <div className="login-field">
          <label htmlFor="password">Contraseña</label>
          <input
            id="password"
            type="password"
            placeholder="Ingresa tu contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
        </div>

        <button type="submit" className="login-btn">
          Iniciar Sesión
        </button>

        <div className="login-hint">
          <strong>Demo</strong> — Credenciales:
          <br />
          Cédula: <strong>1234567890</strong> — Contraseña: <strong>padre123</strong> (2 hijos)
          <br />
          Cédula: <strong>0987654321</strong> — Contraseña: <strong>padre456</strong> (1 hijo)
        </div>
      </form>
    </div>
  );
}

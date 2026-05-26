import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function MobileNav() {
  const { isLoggedIn, selectedChildId, childrenList, logout } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  if (!isLoggedIn || !selectedChildId) return null;

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="mobile-nav">
      <button
        className={`mobile-nav-item${isActive('/dashboard') ? ' mobile-nav-item--active' : ''}`}
        onClick={() => navigate('/dashboard')}
      >
        <span className="mobile-nav-icon">🏠</span>
        <span className="mobile-nav-label">Inicio</span>
      </button>
      <button
        className={`mobile-nav-item${isActive('/progress') ? ' mobile-nav-item--active' : ''}`}
        onClick={() => navigate('/progress')}
      >
        <span className="mobile-nav-icon">📊</span>
        <span className="mobile-nav-label">Progreso</span>
      </button>
      <button
        className={`mobile-nav-item${isActive('/history') ? ' mobile-nav-item--active' : ''}`}
        onClick={() => navigate('/history')}
      >
        <span className="mobile-nav-icon">📈</span>
        <span className="mobile-nav-label">Historial</span>
      </button>
      <button className="mobile-nav-item" onClick={handleLogout}>
        <span className="mobile-nav-icon">🚪</span>
        <span className="mobile-nav-label">Salir</span>
      </button>
    </nav>
  );
}

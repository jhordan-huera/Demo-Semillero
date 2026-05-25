import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function Navbar() {
  const { isLoggedIn, parentName, childName, logout } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  if (!isLoggedIn) return null;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        {/* Brand */}
        <button className="navbar-brand" onClick={() => navigate('/dashboard')}>
          <span className="navbar-brand-icon">🎓</span>
          <span className="navbar-brand-text">EduParent</span>
        </button>

        {/* Nav Links */}
        <div className="navbar-links">
          <button
            className={`navbar-link${isActive('/dashboard') ? ' navbar-link--active' : ''}`}
            onClick={() => navigate('/dashboard')}
          >
            <span className="navbar-link-icon">🏠</span>
            <span className="navbar-link-label">Inicio</span>
          </button>
          <button
            className={`navbar-link${isActive('/performance') ? ' navbar-link--active' : ''}`}
            onClick={() => navigate('/performance')}
          >
            <span className="navbar-link-icon">📊</span>
            <span className="navbar-link-label">Reporte</span>
          </button>
        </div>

        {/* User Info */}
        <div className="navbar-user">
          <div className="navbar-user-info">
            <span className="navbar-user-name">{parentName.split(' ')[0]}</span>
            <span className="navbar-user-child">👦 {childName.split(' ')[0]}</span>
          </div>
          <button className="navbar-logout" onClick={handleLogout} title="Cerrar sesión">
            ✕
          </button>
        </div>
      </div>
    </nav>
  );
}

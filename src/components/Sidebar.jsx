import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function Sidebar() {
  const { isLoggedIn, parentName, childName, currentChild, childrenList, selectedChildId, logout } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  if (!isLoggedIn || !selectedChildId) return null;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSwitchChild = () => {
    navigate('/select-child');
  };

  const isActive = (path) => location.pathname === path;

  const navItems = [
    { path: '/dashboard', icon: '🏠', label: 'Inicio' },
    { path: '/progress', icon: '📊', label: 'Progreso' },
    { path: '/history', icon: '📈', label: 'Historial' },
  ];

  return (
    <aside className="sidebar">
      {/* Brand */}
      <div className="sidebar-brand" onClick={() => navigate('/dashboard')}>
        <span className="sidebar-brand-icon">🎓</span>
        <span className="sidebar-brand-text">EduParent</span>
      </div>

      {/* User Card */}
      <div className="sidebar-user-card">
        <div
          className="sidebar-avatar"
          style={{ background: currentChild?.color || 'var(--primary)' }}
        >
          {currentChild?.avatar || parentName.charAt(0).toUpperCase()}
        </div>
        <div className="sidebar-user-info">
          <span className="sidebar-user-name">{parentName}</span>
          <span className="sidebar-user-child">
            {currentChild?.avatar} {childName}
          </span>
          <span className="sidebar-user-level">
            {currentChild?.age} años · {currentChild?.level}
          </span>
        </div>
      </div>

      {/* Switch Child Button */}
      {childrenList.length > 1 && (
        <button className="sidebar-switch-child" onClick={handleSwitchChild}>
          🔄 Cambiar Hijo
        </button>
      )}

      <div className="sidebar-divider" />

      {/* Navigation */}
      <nav className="sidebar-nav">
        <div className="sidebar-nav-label">Menú</div>
        {navItems.map((item) => (
          <button
            key={item.path}
            className={`sidebar-nav-item${isActive(item.path) ? ' sidebar-nav-item--active' : ''}`}
            onClick={() => navigate(item.path)}
          >
            <span className="sidebar-nav-icon">{item.icon}</span>
            <span className="sidebar-nav-text">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Spacer */}
      <div className="sidebar-spacer" />

      {/* Logout */}
      <button className="sidebar-logout" onClick={handleLogout}>
        <span className="sidebar-nav-icon">🚪</span>
        <span className="sidebar-nav-text">Cerrar Sesión</span>
      </button>
    </aside>
  );
}

import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function ChildSelector() {
  const { parentName, childrenList, selectChild } = useApp();
  const navigate = useNavigate();

  const handleSelect = (childId) => {
    selectChild(childId);
    navigate('/dashboard');
  };

  return (
    <div className="child-selector-page">
      <div className="child-selector-container">
        <div className="child-selector-header">
          <h1 className="child-selector-title">¡Hola, {parentName.split(' ')[0]}! 👋</h1>
          <p className="child-selector-subtitle">¿Con quién vamos a trabajar hoy?</p>
        </div>

        <div className="child-selector-grid">
          {childrenList.map((child) => (
            <button
              key={child.id}
              className="child-card"
              onClick={() => handleSelect(child.id)}
              style={{ '--child-color': child.color }}
            >
              <div className="child-card-avatar">{child.avatar}</div>
              <div className="child-card-name">{child.name}</div>
              <div className="child-card-detail">
                {child.age} años · {child.level}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

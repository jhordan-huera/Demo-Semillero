import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import Login from './pages/Login';
import ChildSelector from './pages/ChildSelector';
import Dashboard from './pages/Dashboard';
import ActivityDetail from './pages/ActivityDetail';
import SubmitEvidence from './pages/SubmitEvidence';
import Performance from './pages/Performance';
import Sidebar from './components/Sidebar';
import MobileNav from './components/MobileNav';

function ProtectedRoute({ children }) {
  const { isLoggedIn } = useApp();
  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }
  return children;
}

function Toast() {
  const { toast } = useApp();
  if (!toast) return null;
  return <div className="toast success">{toast}</div>;
}

function AppRoutes() {
  const { isLoggedIn, selectedChildId } = useApp();
  const showSidebar = isLoggedIn && selectedChildId;

  return (
    <div className={`app-layout${showSidebar ? ' app-layout--with-sidebar' : ''}`}>
      <Sidebar />
      <main className="app-main">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route
            path="/select-child"
            element={
              <ProtectedRoute>
                <ChildSelector />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/activity/:id"
            element={
              <ProtectedRoute>
                <ActivityDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/submit/:id"
            element={
              <ProtectedRoute>
                <SubmitEvidence />
              </ProtectedRoute>
            }
          />
          <Route
            path="/performance"
            element={
              <ProtectedRoute>
                <Performance />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Toast />
      </main>
      <MobileNav />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <AppRoutes />
      </AppProvider>
    </BrowserRouter>
  );
}

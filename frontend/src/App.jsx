import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';

import Home         from './pages/Home';
import Login        from './pages/Login';
import Dashboard    from './pages/Dashboard';
import Fields       from './pages/Fields';
import FieldDetail  from './pages/FieldDetail';
import ManageUsers  from './pages/ManageUsers';
import Layout       from './components/Layout';

function ProtectedRoute({ children, adminOnly = false }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen" style={{ background: 'var(--bg-base)' }}>
        <div className="spinner" />
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;
  if (adminOnly && user.role !== 'admin') return <Navigate to="/dashboard" replace />;
  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/"      element={<Home />} />
          <Route path="/login" element={<Login />} />

          {/* Protected — wrapped in sidebar Layout */}
          <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route path="/dashboard"  element={<Dashboard />} />
            <Route path="/fields"     element={<Fields />} />
            <Route path="/fields/:id" element={<FieldDetail />} />
            <Route path="/users"      element={
              <ProtectedRoute adminOnly>
                <ManageUsers />
              </ProtectedRoute>
            } />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
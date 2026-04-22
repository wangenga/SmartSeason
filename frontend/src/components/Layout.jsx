import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const navItem = ({ isActive }) =>
  `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
    isActive
      ? 'bg-forest-600/40 text-forest-300 border border-forest-500/30'
      : 'text-forest-400 hover:bg-forest-800/40 hover:text-forest-200'
  }`;

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--bg-base)' }}>
      {/* ── Sidebar ─────────────────────────────────────────── */}
      <aside
        className="w-60 flex-shrink-0 flex flex-col border-r"
        style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}
      >
        {/* Brand */}
        <div className="px-5 py-5 border-b" style={{ borderColor: 'var(--border)' }}>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🌾</span>
            <div>
              <div className="font-bold text-base gradient-text leading-tight">SmartSeason</div>
              <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Field Intelligence</div>
            </div>
          </div>
        </div>

        {/* Nav links */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          <NavLink to="/dashboard" className={navItem}>
            <span>📊</span> Dashboard
          </NavLink>
          <NavLink to="/fields" className={navItem}>
            <span>🌱</span> Fields
          </NavLink>
          {user?.role === 'admin' && (
            <NavLink to="/users" className={navItem}>
              <span>👥</span> Manage Users
            </NavLink>
          )}
        </nav>

        {/* User info + logout */}
        <div className="px-3 py-4 border-t space-y-2" style={{ borderColor: 'var(--border)' }}>
          <div className="px-4 py-3 rounded-lg" style={{ background: 'rgba(82,183,136,0.06)' }}>
            <div className="text-sm font-medium truncate" style={{ color: 'var(--text)' }}>{user?.name}</div>
            <div className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>{user?.email}</div>
            <span className={`mt-1 inline-block text-xs px-2 py-0.5 rounded-full font-medium ${
              user?.role === 'admin'
                ? 'bg-amber-400/20 text-amber-300'
                : 'bg-forest-600/30 text-forest-300'
            }`}>
              {user?.role === 'admin' ? '⚡ Admin' : '🌿 Agent'}
            </span>
          </div>
          <button onClick={handleLogout} className="btn btn-ghost w-full justify-center text-sm">
            ← Sign Out
          </button>
        </div>
      </aside>

      {/* ── Main content ─────────────────────────────────────── */}
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
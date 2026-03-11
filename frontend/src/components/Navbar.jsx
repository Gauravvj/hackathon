import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';
import api from '../services/api';

/**
 * Navbar component with navigation links, alert bell, and logout.
 * Shows different links based on user role (patient vs caregiver).
 */
export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [unreadCount, setUnreadCount] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  // Fetch unread alert count for caregivers
  useEffect(() => {
    if (user?.role === 'caregiver') {
      api.get(`/alerts/unread/${user._id}`)
        .then(res => setUnreadCount(res.data.unreadCount))
        .catch(() => {});
    }
  }, [user, location]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  const navLinks = user?.role === 'patient' ? [
    { path: '/dashboard', label: '🏠 Dashboard' },
    { path: '/schedule', label: '💊 Schedule' },
    { path: '/history', label: '📋 History' },
    { path: '/games', label: '🧠 Brain Games' },
  ] : [
    { path: '/caregiver', label: '📊 Dashboard' },
    { path: '/schedule', label: '💊 Medicines' },
    { path: '/history', label: '📋 Logs' },
  ];

  return (
  <nav
    className="glass-card sticky top-0 z-50 py-2"
    style={{ borderRadius: 0, borderTop: "none", borderLeft: "none", borderRight: "none" }}
  >
    <div className="max-w-[1400px] mx-auto px-8 lg:px-12">
      <div className="flex items-center justify-between h-20">

        {/* Logo */}
        <Link
          to={user?.role === "patient" ? "/dashboard" : "/caregiver"}
          className="flex items-center space-x-3 no-underline"
        >
          <span className="text-2xl">💊</span>

          <span className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
            MedReminder
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex text-2xl items-center gap-15">

          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200 no-underline ${
                isActive(link.path)
                  ? "bg-indigo-500/20 text-indigo-300"
                  : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
              }`}
            >
              {link.label}
            </Link>
          ))}

        </div>

        {/* Right Side */}
        <div className="flex items-center space-x-6">

          {/* Alert Bell */}
          {user?.role === "caregiver" && (
            <Link to="/caregiver" className="relative no-underline">
              <span className="text-xl">🔔</span>

              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {unreadCount}
                </span>
              )}
            </Link>
          )}

          {/* User Info */}
          <span className="hidden sm:block text-sm text-slate-400">
            {user?.name}
          </span>

          <span className="badge p-2 badge-info">{user?.role}</span>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="btn-outline text-xs py-2 px-4"
          >
            Logout
          </button>

          {/* Mobile Menu */}
          <button
            className="md:hidden text-slate-400 hover:text-white"
            onClick={() => setMenuOpen(!menuOpen)}
            style={{ background: "none", border: "none", fontSize: "1.5rem" }}
          >
            {menuOpen ? "✕" : "☰"}
          </button>

        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden pb-6 space-y-2 pt-3">

          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMenuOpen(false)}
              className={`block px-4 py-2 rounded-lg text-sm font-medium no-underline ${
                isActive(link.path)
                  ? "bg-indigo-500/20 text-indigo-300"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {link.label}
            </Link>
          ))}

        </div>
      )}
    </div>
  </nav>
);
}

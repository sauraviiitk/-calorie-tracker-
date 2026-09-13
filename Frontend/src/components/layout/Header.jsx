import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const pageTitles = {
  '/dashboard': 'Dashboard',
  '/diary': 'Food Diary',
  '/goals': 'Goals',
  '/reports': 'Reports',
  '/scanner': 'AI Scanner',
};

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const profileRef = useRef(null);
  const notifRef = useRef(null);

  const pageTitle = pageTitles[location.pathname] || 'Overview';

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClick = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const notifications = [
    { id: 1, icon: 'check_circle', color: 'text-tertiary', title: 'Goal achieved!', body: 'You hit your protein target today.', time: '2m ago' },
    { id: 2, icon: 'local_fire_department', color: 'text-secondary', title: '3-day streak 🔥', body: 'Keep it up — you\'re on a roll!', time: '1h ago' },
    { id: 3, icon: 'info', color: 'text-primary', title: 'Tip of the day', body: 'Drink water before each meal to reduce cravings.', time: '3h ago' },
  ];

  return (
    <header className="fixed top-0 left-64 right-0 h-16 bg-surface/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-40 flex items-center justify-between px-8">
      {/* Left - breadcrumb */}
      <div className="flex items-center gap-2">
        <span className="font-body-sm text-body-sm text-on-surface-variant">App</span>
        <span className="material-symbols-outlined text-on-surface-variant text-[14px]">chevron_right</span>
        <span className="font-title-md text-title-md text-on-surface font-semibold">{pageTitle}</span>
      </div>

      {/* Right - actions */}
      <div className="flex items-center gap-2">

        {/* Notification Bell */}
        <div className="relative" ref={notifRef}>
          <button
            type="button"
            onClick={() => { setNotifOpen(!notifOpen); setProfileOpen(false); }}
            className="relative p-2 rounded-full text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors"
          >
            <span className="material-symbols-outlined text-[22px]">notifications</span>
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary"></span>
          </button>

          {notifOpen && (
            <div className="absolute right-0 top-12 w-80 bg-surface-container-lowest rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] border border-outline-variant/60 overflow-hidden z-50">
              <div className="px-4 py-3 border-b border-outline-variant/60 flex items-center justify-between">
                <span className="font-title-md text-title-md font-semibold text-on-surface">Notifications</span>
                <span className="font-label-sm text-label-sm text-primary cursor-pointer hover:underline">Mark all read</span>
              </div>
              <div className="flex flex-col">
                {notifications.map(n => (
                  <div key={n.id} className="flex items-start gap-3 px-4 py-3 hover:bg-surface-container-low transition-colors cursor-pointer">
                    <span className={`material-symbols-outlined text-[22px] mt-0.5 ${n.color}`}>{n.icon}</span>
                    <div className="flex flex-col min-w-0">
                      <span className="font-title-sm text-on-surface font-semibold text-[13px]">{n.title}</span>
                      <span className="font-body-sm text-on-surface-variant text-[12px] leading-relaxed">{n.body}</span>
                      <span className="font-label-sm text-outline text-[11px] mt-0.5">{n.time}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-4 py-2.5 border-t border-outline-variant/60 text-center">
                <span className="font-label-sm text-[12px] text-primary cursor-pointer hover:underline">View all notifications</span>
              </div>
            </div>
          )}
        </div>

        {/* Profile Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            type="button"
            onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false); }}
            className="flex items-center gap-2 pl-2 rounded-full hover:bg-surface-container-high px-2 py-1.5 transition-colors"
          >
            {user?.avatarUrl ? (
              <img src={user.avatarUrl} alt="Avatar" className="w-8 h-8 rounded-full object-cover border border-outline-variant/60" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                <span className="material-symbols-outlined text-on-primary text-[18px]">person</span>
              </div>
            )}
            <span className="font-body-sm text-on-surface text-[13px] font-medium hidden sm:block">
              {user?.name || 'Saurav'}
            </span>
            <span className={`material-symbols-outlined text-on-surface-variant text-[18px] transition-transform ${profileOpen ? 'rotate-180' : ''}`}>expand_more</span>
          </button>

          {profileOpen && (
            <div className="absolute right-0 top-12 w-56 bg-surface-container-lowest rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] border border-outline-variant/60 overflow-hidden z-50">
              {/* User info */}
              <div className="px-4 py-3 border-b border-outline-variant/60">
                <p className="font-title-sm font-semibold text-on-surface text-[13px]">{user?.name || 'Saurav'}</p>
                <p className="font-body-sm text-on-surface-variant text-[12px] truncate">{user?.email || 'user@example.com'}</p>
              </div>
              {/* Menu items */}
              <div className="py-1">
                <button onClick={() => { navigate('/profile'); setProfileOpen(false); }} className="w-full flex items-center gap-3 px-4 py-2.5 text-[13px] text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface transition-colors">
                  <span className="material-symbols-outlined text-[18px]">manage_accounts</span>
                  My Profile
                </button>
                <button onClick={() => { navigate('/profile'); setProfileOpen(false); }} className="w-full flex items-center gap-3 px-4 py-2.5 text-[13px] text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface transition-colors">
                  <span className="material-symbols-outlined text-[18px]">settings</span>
                  Settings
                </button>
              </div>
              <div className="py-1 border-t border-outline-variant/60">
                <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 text-[13px] text-error hover:bg-error-container/40 transition-colors">
                  <span className="material-symbols-outlined text-[18px]">logout</span>
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;

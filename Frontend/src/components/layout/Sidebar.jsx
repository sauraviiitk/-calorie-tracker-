import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
const Sidebar = () => {
  const { logout, user } = useAuth();

  const navItems = [
    { icon: 'grid_view', label: 'Dashboard', path: '/' },
    { icon: 'menu_book', label: 'Food Diary', path: '/diary' },
    { icon: 'target', label: 'Goals', path: '/goals' },
    { icon: 'monitoring', label: 'Reports', path: '/reports' },
    { icon: 'document_scanner', label: 'AI Scanner', path: '/scanner' },
  ];

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-surface-container-low shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-50 flex flex-col justify-between py-6">
      <div className="flex flex-col gap-6">
        <div className="px-6 flex items-center gap-3">
          <img
            alt="CalorieMate logo"
            className="h-8 w-auto object-contain"
            src="https://lh3.googleusercontent.com/aida/AEtjO1Wahs2dTyYeodxwBp7-b1051XgyxHKNByKZmMdTeqMekBHXKGBENSd7XgkpICsgSw9SAQ8Ztag7eslYph9t0u_gCxxXDYv5vVWXfg3jqN3ueBEePQ15hwjN65xk1HoRowdKQTNsofVB8VP1-PiVgwG-GuXf3NVj4K8zuXgHVYQpgow96MGJ8efVSodeHe4b8dXI5rfbn6ljMaZpLb3ibn06dXPTh7oZA56UB6qZi5mOCJ3ALpAXjEg5SA"
          />
          <span className="font-title-lg text-title-lg text-on-surface font-bold tracking-tight">CalorieMate</span>
        </div>
        <nav className="flex flex-col gap-1 px-4">
          {navItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.path}
              className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-label-lg text-label-lg font-medium ${isActive
                ? 'bg-primary-container text-on-surface'
                : 'text-on-surface-variant hover:bg-surface-container-high'
                }`}
            >
              <span className="material-symbols-outlined text-[24px]">
                {item.icon}
              </span>
              {item.label}
            </NavLink>
          ))}

        </nav>
      </div>
      <div className="flex flex-col gap-2 px-4">
        <nav className="flex flex-col gap-1">
          <button onClick={logout} className="flex items-center w-full gap-3 px-3.5 py-2.5 rounded-xl font-body-md text-body-md text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-all">
            <span className="material-symbols-outlined text-[20px]">logout</span>
            <span>Logout</span>
          </button>
        </nav>
        <div className="flex items-center justify-between p-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high transition-colors cursor-pointer">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center">
                <span className="material-symbols-outlined text-on-primary text-[20px]">person</span>
              </div>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-tertiary-container ring-2 ring-surface-container-low"></span>
            </div>
            <div className="flex flex-col">
              <span className="font-title-md text-body-md text-on-surface font-medium leading-tight">{user?.name || 'Saurav'}</span>
              <span className="font-label-sm text-label-sm text-on-surface-variant">Active Pro</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

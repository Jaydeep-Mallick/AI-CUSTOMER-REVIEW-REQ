import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  const navItems = [
    { name: 'Dashboard', path: '/', icon: '📝' },
    { name: 'History', path: '/history', icon: '🕒' },
    { name: 'Analytics', path: '/analytics', icon: '📊' },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 h-screen hidden md:block fixed">
      <div className="p-6">
        <h2 className="text-xl font-bold text-primary flex items-center gap-2">
          <span>✨</span> AI Testimonials
        </h2>
        <p className="text-sm text-gray-500 mt-1">Manivtha Tours & Travels</p>
      </div>
      <nav className="mt-6">
        <ul className="space-y-2 px-4">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-primary text-white shadow-sm'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`
                }
              >
                <span>{item.icon}</span>
                <span className="font-medium">{item.name}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;

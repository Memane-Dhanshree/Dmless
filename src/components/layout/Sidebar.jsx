import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Briefcase,
  Code2,
  Users,
  BarChart3,
  UserCircle,
  Settings,
  PanelLeftClose,
  PanelLeftOpen,
  Plus,
} from 'lucide-react';
import { clsx } from 'clsx';

const baseNav = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  {
    label: 'Jobs',
    icon: Briefcase,
    children: [
      { to: '/jobs/internships', label: 'Internships' },
      { to: '/jobs/full-time', label: 'Full-Time' },
    ],
  },
  { to: '/hackathons', label: 'Hackathons', icon: Code2 },
  { to: '/referrals', label: 'Referrals', icon: Users },
  { to: '/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/talent-pool', label: 'Talent Pool', icon: UserCircle },
  { to: '/settings', label: 'Settings', icon: Settings },
];

export function Sidebar({ collapsed, onToggle, mobileOpen, onMobileClose }) {
  const location = useLocation();

  const isActive = (to) => to && location.pathname === to;
  const isParentActive = (children) =>
    children?.some((c) => c.to && location.pathname.startsWith(c.to));

  return (
    <aside
      className={clsx(
        'fixed left-0 top-14 bottom-0 z-30 bg-white border-r border-pastel-blue/30 flex flex-col transition-all duration-200',
        collapsed ? 'w-16' : 'w-56',
        'md:translate-x-0',
        mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      )}
      aria-label="Main navigation"
    >
      <div className="shrink-0 flex items-center justify-between px-2 py-2 border-b border-pastel-blue/20">
        {!collapsed && <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Menu</span>}
        <button
          type="button"
          onClick={onToggle}
          className="p-2 rounded-lg hover:bg-pastel-blue/20 text-gray-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-dmless-primary"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <PanelLeftOpen className="w-5 h-5" /> : <PanelLeftClose className="w-5 h-5" />}
        </button>
      </div>
      <nav className="flex-1 overflow-y-auto py-4 px-2" onClick={() => mobileOpen && onMobileClose?.()}>
        <div className="space-y-1">
          {baseNav.map((item) => {
            if (item.children) {
              return (
                <div key={item.label}>
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={collapsed ? onToggle : undefined}
                    onKeyDown={collapsed ? (e) => e.key === 'Enter' && onToggle() : undefined}
                    className={clsx(
                      'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-600',
                      isParentActive(item.children) && 'bg-pastel-blue/20 text-gray-800',
                      collapsed && 'cursor-pointer hover:bg-pastel-blue/20'
                    )}
                  >
                    <item.icon className="w-5 h-5 shrink-0" />
                    {!collapsed && <span>{item.label}</span>}
                  </div>
                  {!collapsed &&
                    item.children.map((child) => (
                      <NavLink
                        key={child.to}
                        to={child.to}
                        className={({ isActive: active }) =>
                          clsx(
                            'flex items-center gap-2 py-2 pl-10 pr-3 rounded-lg text-sm transition',
                            active
                              ? 'bg-dmless-primary/30 text-gray-900 font-medium'
                              : 'text-gray-600 hover:bg-pastel-blue/20'
                          )
                        }
                      >
                        {child.label}
                      </NavLink>
                    ))}
                </div>
              );
            }
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive: active }) =>
                  clsx(
                    'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition',
                    active
                      ? 'bg-dmless-primary/30 text-gray-900'
                      : 'text-gray-600 hover:bg-pastel-blue/20'
                  )
                }
              >
                <item.icon className="w-5 h-5 shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </NavLink>
            );
          })}
        </div>

        {!collapsed && (
          <div className="mt-6 pt-4 border-t border-pastel-blue/20 space-y-1">
            <p className="px-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
              Create
            </p>
            <NavLink
              to="/jobs/create"
              className={({ isActive }) =>
                clsx(
                  'flex items-center gap-2 px-3 py-2 rounded-lg text-sm',
                  isActive ? 'bg-pastel-green/30 text-gray-900' : 'text-gray-600 hover:bg-pastel-blue/20'
                )
              }
            >
              <Plus className="w-4 h-4" />
              New Job
            </NavLink>
            <NavLink
              to="/hackathons/create"
              className={({ isActive }) =>
                clsx(
                  'flex items-center gap-2 px-3 py-2 rounded-lg text-sm',
                  isActive ? 'bg-pastel-green/30 text-gray-900' : 'text-gray-600 hover:bg-pastel-blue/20'
                )
              }
            >
              <Plus className="w-4 h-4" />
              New Hackathon
            </NavLink>
          </div>
        )}
      </nav>
    </aside>
  );
}

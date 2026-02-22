import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bell, User, LogOut, UserCircle, Menu } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Button } from '../ui/Button';
import { clsx } from 'clsx';

const notificationRoutes = {
  applicant: (id) => `/jobs/internships`,
  screening: (id) => `/jobs/full-time`,
  hackathon: () => `/hackathons`,
  referral: () => `/referrals`,
};

export function Header({ onMenuClick }) {
  const { user, notifications, markNotificationRead, logout } = useApp();
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const notifRef = useRef(null);
  const profileRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    function handleClickOutside(e) {
      if (
        notifRef.current && !notifRef.current.contains(e.target) &&
        profileRef.current && !profileRef.current.contains(e.target)
      ) {
        setNotifOpen(false);
        setProfileOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleNotificationClick = (n) => {
    markNotificationRead(n.id);
    setNotifOpen(false);
    const path = notificationRoutes[n.type]?.(n.campaignId) || '/dashboard';
    navigate(path);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    setProfileOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 h-14 bg-white/95 backdrop-blur border-b border-pastel-blue/30 flex items-center justify-between px-4 lg:px-6">
      <div className="flex items-center gap-2">
        {onMenuClick && (
          <button
            type="button"
            onClick={onMenuClick}
            className="md:hidden p-2 rounded-lg hover:bg-pastel-blue/30 text-gray-700"
            aria-label="Open menu"
          >
            <Menu className="w-6 h-6" />
          </button>
        )}
        <Link
          to="/dashboard"
          className="flex items-center gap-2 text-xl font-bold text-gray-800 hover:text-dmless-primary transition"
          aria-label="DmLess – Go to Dashboard"
        >
        <span className="bg-gradient-to-r from-dmless-primary to-pastel-green rounded-lg px-2 py-0.5">
            DmLess
          </span>
        </Link>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative" ref={notifRef}>
          <button
            type="button"
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative p-2 rounded-lg hover:bg-pastel-blue/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-dmless-primary"
            aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ''}`}
          >
            <Bell className="w-5 h-5 text-gray-700" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-pastel-red text-[10px] font-bold text-white flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>
          {notifOpen && (
            <div
              className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-pastel-blue/30 py-2 max-h-96 overflow-y-auto"
              role="list"
            >
              {notifications.length === 0 ? (
                <p className="px-4 py-6 text-sm text-gray-500">No notifications</p>
              ) : (
                notifications.slice(0, 8).map((n) => (
                  <button
                    key={n.id}
                    type="button"
                    onClick={() => handleNotificationClick(n)}
                    className={clsx(
                      'w-full text-left px-4 py-3 hover:bg-pastel-blue/20 transition',
                      !n.read && 'bg-pastel-blue/10'
                    )}
                  >
                    <p className="text-sm text-gray-800">{n.message}</p>
                  </button>
                ))
              )}
            </div>
          )}
        </div>

        <div className="relative" ref={profileRef}>
          <button
            type="button"
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2 p-2 rounded-lg hover:bg-pastel-blue/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-dmless-primary"
            aria-label="Profile menu"
            aria-expanded={profileOpen}
          >
            <div className="w-8 h-8 rounded-full bg-pastel-blue flex items-center justify-center">
              <User className="w-4 h-4 text-gray-700" />
            </div>
          </button>
          {profileOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-pastel-blue/30 py-2">
              <div className="px-4 py-2 border-b border-pastel-blue/20">
                <p className="font-medium text-gray-800 truncate">{user.name}</p>
                <p className="text-xs text-gray-500 truncate">{user.email}</p>
              </div>
              <Link
                to="/profile"
                onClick={() => setProfileOpen(false)}
                className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-pastel-blue/20"
              >
                <UserCircle className="w-4 h-4" />
                My Profile
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-pastel-red/20 text-pastel-redDark"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Layers,
  FileText,
  Bell,
  User,
  Building2,
  Users,
  Activity,
  FileCheck2,
  UserCheck,
  Shield,
  HelpCircle,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Sidebar = ({ isOpen, onClose }) => {
  const { user, role } = useAuth();

  const citizenNav = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Government Services', path: '/services', icon: Layers },
    { name: 'My Applications', path: '/applications', icon: FileText },
    { name: 'Notifications', path: '/notifications', icon: Bell },
    { name: 'Citizen Profile', path: '/profile', icon: User },
  ];

  const officerNav = [
    { name: 'Department Dashboard', path: '/officer/dashboard', icon: LayoutDashboard },
    { name: 'Scrutiny Applications', path: '/officer/applications', icon: FileCheck2 },
    { name: 'Officer Profile', path: '/officer/profile', icon: UserCheck },
  ];

  const adminNav = [
    { name: 'System Overview', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Departments', path: '/admin/departments', icon: Building2 },
    { name: 'Services Catalog', path: '/admin/services', icon: Layers },
    { name: 'User Management', path: '/admin/users', icon: Users },
    { name: 'All Applications', path: '/admin/applications', icon: FileText },
    { name: 'Interop API Logs', path: '/admin/api-logs', icon: Activity },
    { name: 'Admin Profile', path: '/admin/profile', icon: Shield },
  ];

  const navItems =
    role === 'admin'
      ? adminNav
      : role === 'officer'
      ? officerNav
      : citizenNav;

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-16 bottom-0 left-0 z-40 w-64 bg-gov-navy text-white transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } flex flex-col justify-between border-r border-slate-800`}
      >
        {/* Navigation list */}
        <div className="p-4 flex-1 overflow-y-auto">
          {/* Department badge for officers */}
          {role === 'officer' && user?.department && (
            <div className="mb-4 p-3 bg-white/10 rounded-xl border border-white/10 text-xs">
              <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">
                Assigned Department
              </span>
              <span className="font-semibold text-white block mt-0.5 line-clamp-1">
                {user.department.name}
              </span>
            </div>
          )}

          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2">
            {role === 'admin'
              ? 'Administration Console'
              : role === 'officer'
              ? 'Officer Operations'
              : 'Citizen Portal'}
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-gov-blue text-white shadow-md border-l-4 border-gov-saffron font-semibold'
                        : 'text-slate-300 hover:bg-white/10 hover:text-white'
                    }`
                  }
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Bottom information card */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-950/40 text-xs text-slate-400">
          <div className="flex items-center gap-2 mb-1 text-slate-300 font-medium">
            <HelpCircle className="w-4 h-4 text-gov-saffron" />
            <span>MahaConnect Helpdesk</span>
          </div>
          <p className="text-[11px]">Toll Free: 1800-120-8040</p>
          <div className="mt-2 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px]">
            <span>Gateway v1.0</span>
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;

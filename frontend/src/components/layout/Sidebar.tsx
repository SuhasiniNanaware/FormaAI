import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  PlusCircle,
  Wrench,
  FileText,
  MessageSquareText,
  BarChart2,
  Layers,
  Settings,
  User,
  HelpCircle,
  Sparkles,
} from 'lucide-react';

const mainLinks = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/create-form', label: 'Generate AI Form', icon: PlusCircle },
  { to: '/form-builder', label: 'Form Builder', icon: Wrench },
  { to: '/forms', label: 'My Forms', icon: FileText },
  { to: '/responses', label: 'Responses', icon: MessageSquareText },
  { to: '/analytics', label: 'Analytics Engine', icon: BarChart2 },
  { to: '/templates', label: 'AI Templates', icon: Layers },
];

const subLinks = [
  { to: '/profile', label: 'Profile', icon: User },
  { to: '/settings', label: 'Settings', icon: Settings },
  { to: '/help', label: 'Help & Docs', icon: HelpCircle },
];

export const Sidebar: React.FC = () => {
  return (
    <aside className="w-64 border-r border-slate-800/80 bg-slate-950/40 backdrop-blur-xl p-4 flex flex-col justify-between shrink-0 h-[calc(100vh-4rem)] sticky top-16">
      <div className="space-y-6">
        <div>
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-3 mb-2">
            Main Workspace
          </div>
          <nav className="space-y-1">
            {mainLinks.map((link) => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-indigo-600/20 to-purple-600/10 text-indigo-300 border border-indigo-500/30 font-semibold'
                        : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/60'
                    }`
                  }
                >
                  <Icon className="w-4 h-4" />
                  {link.label}
                </NavLink>
              );
            })}
          </nav>
        </div>

        <div>
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-3 mb-2">
            Preferences & Help
          </div>
          <nav className="space-y-1">
            {subLinks.map((link) => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                        : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/60'
                    }`
                  }
                >
                  <Icon className="w-4 h-4" />
                  {link.label}
                </NavLink>
              );
            })}
          </nav>
        </div>
      </div>

      {/* AI Assistance Badge Card */}
      <div className="p-3.5 rounded-2xl bg-gradient-to-br from-indigo-900/40 to-purple-900/30 border border-indigo-500/20 backdrop-blur-md">
        <div className="flex items-center gap-2 text-indigo-300 text-xs font-semibold mb-1">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          AI Engine Ready
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed">
          Need custom validation rules? Ask Forma AI inside the Form Builder.
        </p>
      </div>
    </aside>
  );
};
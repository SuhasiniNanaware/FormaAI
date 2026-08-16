import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, Bell, Search, Command } from 'lucide-react';
import { Button } from '../ui/Button';
import { authService } from '../../services/authService';

export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const user = (() => {
    try {
      const stored = localStorage.getItem('user');
      if (!stored) return null;
      const parsed = JSON.parse(stored);
      return parsed;
    } catch {
      return null;
    }
  })();
  const userInitial = (user?.username || user?.email || 'U')
    .trim()
    .charAt(0)
    .toUpperCase();

  return (
    <header className="h-16 border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-xl px-6 flex items-center justify-between sticky top-0 z-40">
      {/* Brand Logo */}
      <div className="flex items-center gap-6">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition duration-200">
            <Sparkles className="w-5 h-5 text-indigo-100 animate-pulse-slow" />
          </div>
          <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-300 bg-clip-text text-transparent">
            Forma <span className="text-indigo-400">AI</span>
          </span>
        </Link>

        {/* Global Search */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800/80 text-slate-400 text-xs w-64 focus-within:border-indigo-500/50 transition">
          <Search className="w-3.5 h-3.5 text-slate-500" />
          <input
            type="text"
            placeholder="Search forms, responses..."
            className="bg-transparent focus:outline-none w-full text-slate-200 placeholder-slate-500 text-xs"
          />
          <kbd className="px-1.5 py-0.5 text-[10px] bg-slate-800 rounded border border-slate-700 text-slate-400 flex items-center gap-0.5">
            <Command className="w-2.5 h-2.5" />K
          </kbd>
        </div>
      </div>

      {/* Action Navigation */}
      <div className="flex items-center gap-3">
        <Button size="sm" onClick={() => navigate('/create-form')}>
          <Sparkles className="w-3.5 h-3.5" />
          + New AI Form
        </Button>

        <button
          onClick={() => navigate('/notifications')}
          className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent hover:border-slate-800 transition relative"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-500 ring-2 ring-slate-950" />
        </button>

        <div className="h-4 w-px bg-slate-800 mx-1" />
 
        <button
          onClick={() => navigate('/profile')}
          className="flex items-center gap-2 p-1 rounded-xl border border-slate-800 hover:border-indigo-500/40 transition bg-slate-900/50"
        >
          <div className="w-7 h-7 rounded-lg bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-300 font-semibold text-xs overflow-hidden">
            {user?.avatar ? (
              <img src={user.avatar} alt="Profile avatar" className="w-full h-full object-cover" />
            ) : (
              userInitial
            )}
          </div>
        </button>

        <button
          onClick={() => { authService.logout(); navigate('/login', { replace: true }); }}
          className="ml-2 px-3 py-1 text-xs rounded-lg bg-slate-900/40 border border-slate-800 text-slate-300 hover:bg-slate-900"
        >
          Logout
        </button>
      </div>
    </header>
  );
};
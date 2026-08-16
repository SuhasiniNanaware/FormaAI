import React, { useRef, useState } from 'react';
import { 
  User, 
  Mail, 
  ShieldCheck, 
  Sparkles, 
  Check, 
  Camera, 
  Calendar,
  Layers,
  FileText
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { authService } from '../../services/authService';

export const ProfilePage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [avatar, setAvatar] = useState('');
  const [saved, setSaved] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const fetchProfile = async () => {
    try {
      const res = await authService.getProfile();
      const payload = res?.data ?? res;
      setName(payload?.username || '');
      setEmail(payload?.email || '');
      setBio(payload?.bio || '');
      setAvatar(payload?.avatar || '');
      localStorage.setItem('user', JSON.stringify(payload));
      return;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      console.warn('Profile fetch failed, falling back to local snapshot', errorMessage);
    }

    try {
      const snapshot = localStorage.getItem('user');
      if (snapshot) {
        const parsed = JSON.parse(snapshot);
        setName(parsed?.username || '');
        setEmail(parsed?.email || '');
        setBio(parsed?.bio || '');
        setAvatar(parsed?.avatar || '');
      }
    } catch (ex) {
      console.error('Failed to read local user snapshot', ex);
    }
  };

  React.useEffect(() => {
    fetchProfile();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await authService.updateProfile({ username: name, email, bio, avatar });
      const payload = res?.data ?? res;
      setSaved(true);
      localStorage.setItem('user', JSON.stringify(payload));
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      alert('Failed to save profile');
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      const dataUrl = String(reader.result || '');
      setAvatar(dataUrl);
      try {
        const res = await authService.updateProfile({ username: name, email, bio, avatar: dataUrl });
        const payload = res?.data ?? res;
        localStorage.setItem('user', JSON.stringify(payload));
      } catch (error) {
        console.error('Failed to save avatar', error);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleLogout = () => {
    authService.logout();
    window.location.replace('/login');
  };

  const initials = name ? name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase() : 'U';

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Account Profile</h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Manage your personal information, workspace preferences, and subscription tier.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Avatar & Summary Card */}
        <Card glow className="p-6 border-slate-800 lg:col-span-1 flex flex-col items-center text-center space-y-4">
          <div className="relative group">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 p-0.5 shadow-xl shadow-indigo-500/10 overflow-hidden">
              {avatar ? (
                <img src={avatar} alt="Profile avatar" className="w-full h-full object-cover rounded-[14px]" />
              ) : (
                <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-indigo-400 text-2xl font-bold">
                  {initials}
                </div>
              )}
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
            <button type="button" onClick={handleAvatarClick} className="absolute bottom-0 right-0 p-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 hover:text-white hover:border-indigo-500 transition shadow-lg">
              <Camera className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-1">
            <h2 className="text-lg font-bold text-white">{name}</h2>
            <p className="text-xs text-slate-400">{email}</p>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <Badge variant="indigo" className="px-3 py-1 text-xs">
              <Sparkles className="w-3 h-3 mr-1" /> Pro Plan
            </Badge>
          </div>

          <div className="w-full border-t border-slate-800/80 my-2 pt-4 space-y-3 text-left">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-2">
                <FileText className="w-3.5 h-3.5 text-indigo-400" /> Forms Created
              </span>
              <span className="font-semibold text-white">12</span>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-2">
                <Layers className="w-3.5 h-3.5 text-purple-400" /> Total Submissions
              </span>
              <span className="font-semibold text-white">1,284</span>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-emerald-400" /> Member Since
              </span>
              <span className="font-semibold text-white">2026</span>
            </div>
          </div>
        </Card>

        {/* Right Column: Edit Profile Form */}
        <Card className="p-6 border-slate-800 lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <h3 className="text-base font-bold text-white">Personal Details</h3>
            <div className="flex items-center gap-3">
              <button onClick={handleLogout} className="text-xs text-slate-400 hover:text-white px-3 py-1 rounded-lg border border-slate-800/60">Logout</button>
              <span className="text-xs text-slate-500 flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> Verified Account
              </span>
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">Full Name</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                  <User className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">Email Address</label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Bio / Role</label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-indigo-500 resize-none"
                placeholder="Tell us about your work..."
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <Button type="submit" size="sm">
                {saved && <Check className="w-4 h-4 mr-1 text-emerald-400" />}
                {saved ? 'Changes Saved!' : 'Save Profile Changes'}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default ProfilePage;
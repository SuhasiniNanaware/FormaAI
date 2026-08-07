import React, { useState } from 'react';
import { 
  Sliders, 
  Key, 
  Bell, 
  ShieldAlert, 
  Globe, 
  Check, 
  Copy, 
  Eye, 
  EyeOff, 
  Trash2, 
  Save 
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';

type TabType = 'general' | 'api' | 'notifications' | 'danger';

export const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('general');
  const [saved, setSaved] = useState(false);

  // Form States
  const [theme, setTheme] = useState('dark');
  const [language, setLanguage] = useState('en');
  const [apiKey, setApiKey] = useState('sk-forma-9a8f7e6d5c4b3a210987654321');
  const [showKey, setShowKey] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);
  
  // Notification States
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState(true);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleCopyKey = () => {
    navigator.clipboard.writeText(apiKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 py-4">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">System Settings</h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Configure global platform preferences, AI model integrations, and security rules.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Navigation Sidebar */}
        <div className="md:col-span-1 space-y-1">
          {[
            { id: 'general', label: 'General', icon: Sliders },
            { id: 'api', label: 'AI & API Keys', icon: Key },
            { id: 'notifications', label: 'Notifications', icon: Bell },
            { id: 'danger', label: 'Danger Zone', icon: ShieldAlert },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition ${
                  isActive
                    ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900/50'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : 'text-slate-500'}`} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Settings Content Area */}
        <div className="md:col-span-3">
          <form onSubmit={handleSave}>
            {/* General Tab */}
            {activeTab === 'general' && (
              <Card className="p-6 border-slate-800 space-y-6">
                <div className="border-b border-slate-800 pb-4">
                  <h3 className="text-sm font-semibold text-white">General Preferences</h3>
                  <p className="text-xs text-slate-400">Customize display settings and application defaults.</p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-300">Workspace Theme</label>
                    <select
                      value={theme}
                      onChange={(e) => setTheme(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                    >
                      <option value="dark">Dark Space (Default)</option>
                      <option value="midnight">Midnight OLED</option>
                      <option value="system">Follow System</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-300">Default Language</label>
                    <div className="relative">
                      <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                      >
                        <option value="en">English (US)</option>
                        <option value="ja">Japanese (日本語)</option>
                        <option value="es">Spanish (Español)</option>
                      </select>
                      <Globe className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {/* AI & API Keys Tab */}
            {activeTab === 'api' && (
              <Card className="p-6 border-slate-800 space-y-6">
                <div className="border-b border-slate-800 pb-4">
                  <h3 className="text-sm font-semibold text-white">AI Engine Integration</h3>
                  <p className="text-xs text-slate-400">Manage custom LLM API keys for private form generation.</p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-medium text-slate-300">Gemini / OpenAI API Key</label>
                      <Badge variant="indigo" className="text-[10px]">Active Provider</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="relative flex-1">
                        <input
                          type={showKey ? 'text' : 'password'}
                          value={apiKey}
                          onChange={(e) => setApiKey(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-3 pr-9 py-2 text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
                        />
                        <button
                          type="button"
                          onClick={() => setShowKey(!showKey)}
                          className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300"
                        >
                          {showKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                      <Button type="button" variant="secondary" size="sm" onClick={handleCopyKey}>
                        {copiedKey ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                      </Button>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Your keys are encrypted before storage and used exclusively to run form schema requests.
                    </p>
                  </div>
                </div>
              </Card>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <Card className="p-6 border-slate-800 space-y-6">
                <div className="border-b border-slate-800 pb-4">
                  <h3 className="text-sm font-semibold text-white">Notification Rules</h3>
                  <p className="text-xs text-slate-400">Control when and how you receive alerts about form activity.</p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between py-2 border-b border-slate-800/60">
                    <div>
                      <h4 className="text-xs font-semibold text-white">New Submission Alerts</h4>
                      <p className="text-[11px] text-slate-400">Get an instant email whenever a user submits a form.</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={emailAlerts}
                      onChange={(e) => setEmailAlerts(e.target.checked)}
                      className="rounded border-slate-800 bg-slate-950 text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                    />
                  </div>

                  <div className="flex items-center justify-between py-2 border-b border-slate-800/60">
                    <div>
                      <h4 className="text-xs font-semibold text-white">Weekly Analytics Digest</h4>
                      <p className="text-[11px] text-slate-400">Receive weekly submission stats and conversion reports.</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={weeklyDigest}
                      onChange={(e) => setWeeklyDigest(e.target.checked)}
                      className="rounded border-slate-800 bg-slate-950 text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                    />
                  </div>

                  <div className="flex items-center justify-between py-2">
                    <div>
                      <h4 className="text-xs font-semibold text-white">AI Optimization Tips</h4>
                      <p className="text-[11px] text-slate-400">Get suggestions on how to improve completion rates.</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={aiSuggestions}
                      onChange={(e) => setAiSuggestions(e.target.checked)}
                      className="rounded border-slate-800 bg-slate-950 text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                    />
                  </div>
                </div>
              </Card>
            )}

            {/* Danger Zone Tab */}
            {activeTab === 'danger' && (
              <Card className="p-6 border-red-500/20 bg-red-500/[0.02] space-y-6">
                <div className="border-b border-red-500/20 pb-4">
                  <h3 className="text-sm font-semibold text-red-400 flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4" /> Irreversible Actions
                  </h3>
                  <p className="text-xs text-slate-400">Actions taken here cannot be undone.</p>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div>
                    <h4 className="text-xs font-semibold text-white">Delete Workspace & Account</h4>
                    <p className="text-[11px] text-slate-400">Permanently remove all forms, submissions, and account settings.</p>
                  </div>
                  <Button type="button" variant="danger" size="sm">
                    <Trash2 className="w-3.5 h-3.5 mr-1.5" /> Delete Account
                  </Button>
                </div>
              </Card>
            )}

            {/* Global Save Button */}
            {activeTab !== 'danger' && (
              <div className="mt-6 flex justify-end">
                <Button type="submit" size="sm">
                  {saved ? <Check className="w-4 h-4 mr-1 text-emerald-400" /> : <Save className="w-4 h-4 mr-1.5" />}
                  {saved ? 'Saved Preferences!' : 'Save Settings'}
                </Button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
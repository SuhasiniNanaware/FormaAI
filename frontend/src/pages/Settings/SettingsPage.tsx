import React, { useEffect, useState } from 'react';
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
  Save,
  Palette,
  Languages,
  Mail,
  Sparkles,
  Monitor,
  Moon,
  Sun,
  AlertTriangle,
} from 'lucide-react';

import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';


type TabType =
  | 'general'
  | 'api'
  | 'notifications'
  | 'danger';

type ThemeType =
  | 'dark'
  | 'midnight'
  | 'system';

type Language =
  | 'en'
  | 'hi'
  | 'mr'
  | 'ja'
  | 'es'
  | 'fr'
  | 'de'
  | 'ko';

type SettingsState = {
  theme: ThemeType;
  language: Language;
  apiKey: string;
  emailAlerts: boolean;
  weeklyDigest: boolean;
  aiSuggestions: boolean;
};

const SETTINGS_KEY =
  'forma_settings';

const defaultSettings: SettingsState = {
  theme: 'dark',
  language: 'en',
  apiKey: '',
  emailAlerts: true,
  weeklyDigest: false,
  aiSuggestions: true,
};

/*
 * ======================================================
 * APPLY THEME
 * ======================================================
 */

const applyTheme = (
  theme: ThemeType
) => {
  const root =
    document.documentElement;

  root.classList.remove(
    'forma-dark',
    'forma-midnight',
    'forma-light'
  );

  if (theme === 'midnight') {
    root.classList.add(
      'forma-midnight'
    );
    return;
  }

  if (theme === 'system') {
    const prefersDark =
      window.matchMedia(
        '(prefers-color-scheme: dark)'
      ).matches;

    root.classList.add(
      prefersDark
        ? 'forma-dark'
        : 'forma-light'
    );

    return;
  }

  root.classList.add(
    'forma-dark'
  );
};

/*
 * ======================================================
 * LOAD SAVED SETTINGS
 * ======================================================
 */

const getSavedSettings =
  (): SettingsState => {
    try {
      const saved =
        localStorage.getItem(
          SETTINGS_KEY
        );

      if (!saved) {
        return defaultSettings;
      }

      return {
        ...defaultSettings,
        ...JSON.parse(saved),
      };
    } catch {
      return defaultSettings;
    }
  };

export const SettingsPage: React.FC =
  () => {
    const [activeTab, setActiveTab] =
      useState<TabType>('general');

    const [settings, setSettings] =
      useState<SettingsState>(
        getSavedSettings
      );

    const [saved, setSaved] =
      useState(false);

    const [showKey, setShowKey] =
      useState(false);

    const [copiedKey, setCopiedKey] =
      useState(false);

    /*
     * ==================================================
     * APPLY INITIAL THEME
     * ==================================================
     */

    useEffect(() => {
      applyTheme(settings.theme);
    }, []);

    /*
     * ==================================================
     * UPDATE SETTING
     * ==================================================
     */

    const updateSetting = <
      K extends keyof SettingsState
    >(
      key: K,
      value: SettingsState[K]
    ) => {
      setSettings(
        (previous) => ({
          ...previous,
          [key]: value,
        })
      );

      setSaved(false);

      /*
       * Theme applies immediately.
       */
      if (key === 'theme') {
        applyTheme(
          value as ThemeType
        );
      }
    };

    /*
     * ==================================================
     * SAVE
     * ==================================================
     */

    const handleSave = (
      event?: React.FormEvent
    ) => {
      event?.preventDefault();

      try {
        localStorage.setItem(
          SETTINGS_KEY,
          JSON.stringify(settings)
        );

        /*
         * Allow other pages/components
         * to react to settings changes.
         */
        window.dispatchEvent(
          new CustomEvent(
            'forma-settings-changed',
            {
              detail: settings,
            }
          )
        );

        setSaved(true);

        window.setTimeout(() => {
          setSaved(false);
        }, 2500);
      } catch (error) {
        console.error(
          'Failed to save settings:',
          error
        );
      }
    };

    /*
     * ==================================================
     * COPY API KEY
     * ==================================================
     */

    const handleCopyKey =
      async () => {
        if (!settings.apiKey) {
          return;
        }

        try {
          await navigator.clipboard.writeText(
            settings.apiKey
          );

          setCopiedKey(true);

          window.setTimeout(() => {
            setCopiedKey(false);
          }, 2000);
        } catch (error) {
          console.error(
            'Failed to copy API key:',
            error
          );
        }
      };

    /*
     * ==================================================
     * CLEAR SETTINGS
     * ==================================================
     */

    const handleClearSettings =
      () => {
        const confirmed =
          window.confirm(
            'Reset all Forma settings to their default values?'
          );

        if (!confirmed) {
          return;
        }

        localStorage.removeItem(
          SETTINGS_KEY
        );

        setSettings(
          defaultSettings
        );

        applyTheme('dark');

        window.dispatchEvent(
          new CustomEvent(
            'forma-settings-changed',
            {
              detail:
                defaultSettings,
            }
          )
        );

        setSaved(true);

        window.setTimeout(() => {
          setSaved(false);
        }, 2000);
      };

    /*
     * ==================================================
     * TABS
     * ==================================================
     */

    const tabs = [
      {
        id: 'general' as TabType,
        label: 'General',
        description:
          'Appearance & language',
        icon: Sliders,
      },
      {
        id: 'api' as TabType,
        label: 'AI & API',
        description:
          'AI integration',
        icon: Key,
      },
      {
        id: 'notifications' as TabType,
        label: 'Notifications',
        description:
          'Alerts & updates',
        icon: Bell,
      },
      {
        id: 'danger' as TabType,
        label: 'Danger Zone',
        description:
          'Reset preferences',
        icon: ShieldAlert,
      },
    ];

    /*
     * ==================================================
     * TOGGLE
     * ==================================================
     */

    const Toggle = ({
      checked,
      onChange,
    }: {
      checked: boolean;
      onChange: () => void;
    }) => (
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={onChange}
        className={`relative h-6 w-11 rounded-full border transition ${
          checked
            ? 'bg-indigo-600 border-indigo-500'
            : 'bg-slate-800 border-slate-700'
        }`}
      >
        <span
          className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-all ${
            checked
              ? 'left-6'
              : 'left-1'
          }`}
        />
      </button>
    );

    return (
      <div className="max-w-5xl mx-auto space-y-6 py-4">

        {/* ==================================================
            HEADER
        ================================================== */}

        <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/80 p-6">

          <div className="absolute -right-20 -top-20 h-48 w-48 rounded-full bg-indigo-600/10 blur-3xl" />

          <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">

            <div>

              <div className="flex items-center gap-2 mb-2">

                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600/15 border border-indigo-500/20">
                  <Sliders className="w-4 h-4 text-indigo-400" />
                </div>

                <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-indigo-400">
                  Workspace
                </span>

              </div>

              <h1 className="text-2xl sm:text-3xl font-bold text-white">
                Settings
              </h1>

              <p className="mt-1 max-w-xl text-xs sm:text-sm text-slate-400">
                Customize your Forma workspace,
                integrations and notification preferences.
              </p>

            </div>

            {saved && (
              <Badge
                variant="emerald"
                className="self-start sm:self-center"
              >
                <Check className="w-3 h-3 mr-1" />
                Changes saved
              </Badge>
            )}

          </div>

        </div>

        {/* ==================================================
            LAYOUT
        ================================================== */}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* ==================================================
              SIDEBAR
          ================================================== */}

          <div className="lg:col-span-3">

            <div className="lg:sticky lg:top-6 space-y-2">

              <p className="px-2 pb-1 text-[10px] uppercase tracking-wider font-semibold text-slate-600">
                Settings
              </p>

              {tabs.map((tab) => {

                const Icon = tab.icon;

                const isActive =
                  activeTab === tab.id;

                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() =>
                      setActiveTab(
                        tab.id
                      )
                    }
                    className={`w-full flex items-center gap-3 rounded-xl border p-3 text-left transition ${
                      isActive
                        ? 'bg-indigo-600/10 border-indigo-500/20'
                        : 'border-transparent bg-slate-900/40 hover:bg-slate-900 hover:border-slate-800'
                    }`}
                  >

                    <div
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                        isActive
                          ? 'bg-indigo-600/15 text-indigo-400'
                          : 'bg-slate-800 text-slate-500'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>

                    <div className="min-w-0">

                      <p
                        className={`text-xs font-semibold ${
                          isActive
                            ? 'text-white'
                            : 'text-slate-400'
                        }`}
                      >
                        {tab.label}
                      </p>

                      <p className="text-[10px] text-slate-600 mt-0.5">
                        {tab.description}
                      </p>

                    </div>

                  </button>
                );
              })}

            </div>

          </div>

          {/* ==================================================
              CONTENT
          ================================================== */}

          <div className="lg:col-span-9">

            <form
              onSubmit={handleSave}
              className="space-y-5"
            >

              {/* ==================================================
                  GENERAL
              ================================================== */}

              {activeTab ===
                'general' && (
                <>

                  <Card className="p-6 border-slate-800">

                    <div className="flex items-start gap-3 pb-5 border-b border-slate-800">

                      <div className="h-9 w-9 rounded-xl bg-indigo-600/10 flex items-center justify-center">
                        <Palette className="w-4 h-4 text-indigo-400" />
                      </div>

                      <div>
                        <h2 className="text-sm font-semibold text-white">
                          Appearance
                        </h2>

                        <p className="text-xs text-slate-500 mt-1">
                          Choose how Forma looks across your workspace.
                        </p>
                      </div>

                    </div>

                    <div className="mt-6">

                      <label className="text-xs font-medium text-slate-300">
                        Workspace Theme
                      </label>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3">

                        {/* Dark */}

                        <button
                          type="button"
                          onClick={() =>
                            updateSetting(
                              'theme',
                              'dark'
                            )
                          }
                          className={`rounded-xl border p-4 text-left transition ${
                            settings.theme ===
                            'dark'
                              ? 'border-indigo-500 bg-indigo-600/10'
                              : 'border-slate-800 bg-slate-950 hover:border-slate-700'
                          }`}
                        >

                          <Moon className="w-5 h-5 text-indigo-400 mb-3" />

                          <p className="text-xs font-semibold text-white">
                            Dark Space
                          </p>

                          <p className="text-[10px] text-slate-500 mt-1">
                            Default Forma theme
                          </p>

                        </button>

                        {/* Midnight */}

                        <button
                          type="button"
                          onClick={() =>
                            updateSetting(
                              'theme',
                              'midnight'
                            )
                          }
                          className={`rounded-xl border p-4 text-left transition ${
                            settings.theme ===
                            'midnight'
                              ? 'border-indigo-500 bg-indigo-600/10'
                              : 'border-slate-800 bg-slate-950 hover:border-slate-700'
                          }`}
                        >

                          <div className="w-5 h-5 rounded-full bg-black border border-slate-600 mb-3" />

                          <p className="text-xs font-semibold text-white">
                            Midnight OLED
                          </p>

                          <p className="text-[10px] text-slate-500 mt-1">
                            Deep black interface
                          </p>

                        </button>

                        {/* System */}

                        <button
                          type="button"
                          onClick={() =>
                            updateSetting(
                              'theme',
                              'system'
                            )
                          }
                          className={`rounded-xl border p-4 text-left transition ${
                            settings.theme ===
                            'system'
                              ? 'border-indigo-500 bg-indigo-600/10'
                              : 'border-slate-800 bg-slate-950 hover:border-slate-700'
                          }`}
                        >

                          <Monitor className="w-5 h-5 text-slate-400 mb-3" />

                          <p className="text-xs font-semibold text-white">
                            System
                          </p>

                          <p className="text-[10px] text-slate-500 mt-1">
                            Follow device preference
                          </p>

                        </button>

                      </div>

                    </div>

                  </Card>

                  {/* LANGUAGE */}

                  <Card className="p-6 border-slate-800">

                    <div className="flex items-start gap-3">

                      <div className="h-9 w-9 rounded-xl bg-indigo-600/10 flex items-center justify-center">
                        <Globe className="w-4 h-4 text-indigo-400" />
                      </div>

                      <div className="flex-1">

                        <h2 className="text-sm font-semibold text-white">
                          Language
                        </h2>

                        <p className="text-xs text-slate-500 mt-1">
                          Choose the language used throughout the Forma interface.
                        </p>

                        <div className="mt-5">


  <select
    value={settings.language}
    onChange={(e) =>
      updateSetting(
        'language',
        e.target.value as Language
      )
    }
    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
  >
    <option value="en">
      English (US)
    </option>

    <option value="hi">
      Hindi (हिन्दी)
    </option>

    <option value="mr">
      Marathi (मराठी)
    </option>

    <option value="ja">
      Japanese (日本語)
    </option>

    <option value="es">
      Spanish (Español)
    </option>

    <option value="fr">
      French (Français)
    </option>

    <option value="de">
      German (Deutsch)
    </option>

    <option value="ko">
      Korean (한국어)
    </option>
  </select>

</div>

                        </div>

                      </div>


                  </Card>

                </>
              )}

              {/* ==================================================
                  API
              ================================================== */}

              {activeTab === 'api' && (
                <Card className="p-6 border-slate-800">

                  <div className="flex items-start gap-3 pb-5 border-b border-slate-800">

                    <div className="h-9 w-9 rounded-xl bg-indigo-600/10 flex items-center justify-center">
                      <Key className="w-4 h-4 text-indigo-400" />
                    </div>

                    <div>

                      <h2 className="text-sm font-semibold text-white">
                        AI & API Integration
                      </h2>

                      <p className="text-xs text-slate-500 mt-1">
                        Manage the API credentials used by your AI features.
                      </p>

                    </div>

                  </div>

                  <div className="mt-6">

                    <div className="flex items-center justify-between mb-2">

                      <label className="text-xs font-medium text-slate-300">
                        AI Provider API Key
                      </label>

                      <Badge
                        variant="indigo"
                        className="text-[9px]"
                      >
                        Configured
                      </Badge>

                    </div>

                    <div className="flex gap-2">

                      <div className="relative flex-1">

                        <input
                          type={
                            showKey
                              ? 'text'
                              : 'password'
                          }
                          value={
                            settings.apiKey
                          }
                          onChange={(e) =>
                            updateSetting(
                              'apiKey',
                              e.target.value
                            )
                          }
                          placeholder="Enter API key"
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 pr-10 text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
                        />

                        <button
                          type="button"
                          onClick={() =>
                            setShowKey(
                              !showKey
                            )
                          }
                          className="absolute right-3 top-2.5 text-slate-500 hover:text-white"
                        >
                          {showKey ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>

                      </div>

                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        disabled={
                          !settings.apiKey
                        }
                        onClick={
                          handleCopyKey
                        }
                      >
                        {copiedKey ? (
                          <Check className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </Button>

                    </div>

                    <div className="mt-4 rounded-xl bg-slate-950 border border-slate-800 p-4">

                      <div className="flex gap-3">

                        <Sparkles className="w-4 h-4 text-indigo-400 shrink-0" />

                        <p className="text-[10px] leading-relaxed text-slate-500">
                          This setting controls the API credential
                          available to the existing AI integration.
                          Keep your key private.
                        </p>

                      </div>

                    </div>

                  </div>

                </Card>
              )}

              {/* ==================================================
                  NOTIFICATIONS
              ================================================== */}

              {activeTab ===
                'notifications' && (
                <Card className="p-6 border-slate-800">

                  <div className="flex items-start gap-3 pb-5 border-b border-slate-800">

                    <div className="h-9 w-9 rounded-xl bg-indigo-600/10 flex items-center justify-center">
                      <Bell className="w-4 h-4 text-indigo-400" />
                    </div>

                    <div>

                      <h2 className="text-sm font-semibold text-white">
                        Notifications
                      </h2>

                      <p className="text-xs text-slate-500 mt-1">
                        Control which Forma updates you want to receive.
                      </p>

                    </div>

                  </div>

                  <div className="divide-y divide-slate-800/70">

                    {/* EMAIL */}

                    <div className="flex items-center justify-between gap-5 py-5">

                      <div className="flex gap-3">

                        <div className="h-9 w-9 rounded-lg bg-slate-800 flex items-center justify-center">
                          <Mail className="w-4 h-4 text-slate-400" />
                        </div>

                        <div>

                          <p className="text-xs font-semibold text-white">
                            New Submission Alerts
                          </p>

                          <p className="text-[10px] text-slate-500 mt-1">
                            Get notified when a response is submitted.
                          </p>

                        </div>

                      </div>

                      <Toggle
                        checked={
                          settings.emailAlerts
                        }
                        onChange={() =>
                          updateSetting(
                            'emailAlerts',
                            !settings.emailAlerts
                          )
                        }
                      />

                    </div>

                    {/* DIGEST */}

                    <div className="flex items-center justify-between gap-5 py-5">

                      <div className="flex gap-3">

                        <div className="h-9 w-9 rounded-lg bg-slate-800 flex items-center justify-center">
                          <Bell className="w-4 h-4 text-slate-400" />
                        </div>

                        <div>

                          <p className="text-xs font-semibold text-white">
                            Weekly Analytics Digest
                          </p>

                          <p className="text-[10px] text-slate-500 mt-1">
                            Receive weekly form performance summaries.
                          </p>

                        </div>

                      </div>

                      <Toggle
                        checked={
                          settings.weeklyDigest
                        }
                        onChange={() =>
                          updateSetting(
                            'weeklyDigest',
                            !settings.weeklyDigest
                          )
                        }
                      />

                    </div>

                    {/* AI */}

                    <div className="flex items-center justify-between gap-5 py-5">

                      <div className="flex gap-3">

                        <div className="h-9 w-9 rounded-lg bg-slate-800 flex items-center justify-center">
                          <Sparkles className="w-4 h-4 text-slate-400" />
                        </div>

                        <div>

                          <p className="text-xs font-semibold text-white">
                            AI Optimization Tips
                          </p>

                          <p className="text-[10px] text-slate-500 mt-1">
                            Receive suggestions for improving forms.
                          </p>

                        </div>

                      </div>

                      <Toggle
                        checked={
                          settings.aiSuggestions
                        }
                        onChange={() =>
                          updateSetting(
                            'aiSuggestions',
                            !settings.aiSuggestions
                          )
                        }
                      />

                    </div>

                  </div>

                </Card>
              )}

              {/* ==================================================
                  DANGER
              ================================================== */}

              {activeTab === 'danger' && (
                <Card className="p-6 border-red-500/20 bg-red-500/[0.02]">

                  <div className="flex items-start gap-3 pb-5 border-b border-red-500/15">

                    <div className="h-9 w-9 rounded-xl bg-red-500/10 flex items-center justify-center">
                      <ShieldAlert className="w-4 h-4 text-red-400" />
                    </div>

                    <div>

                      <h2 className="text-sm font-semibold text-red-400">
                        Danger Zone
                      </h2>

                      <p className="text-xs text-slate-500 mt-1">
                        Reset locally stored workspace preferences.
                      </p>

                    </div>

                  </div>

                  <div className="mt-6 rounded-xl border border-red-500/15 bg-red-500/[0.03] p-5">

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">

                      <div className="flex gap-3">

                        <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />

                        <div>

                          <h3 className="text-xs font-semibold text-white">
                            Reset Forma Settings
                          </h3>

                          <p className="text-[10px] text-slate-500 mt-1 max-w-lg">
                            Restore theme, language, API key and
                            notification preferences to their defaults.
                            Your forms and backend data are not affected.
                          </p>

                        </div>

                      </div>

                      <Button
                        type="button"
                        variant="danger"
                        size="sm"
                        onClick={
                          handleClearSettings
                        }
                      >
                        <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                        Reset Settings
                      </Button>

                    </div>

                  </div>

                </Card>
              )}

              {/* ==================================================
                  SAVE
              ================================================== */}

              {activeTab !==
                'danger' && (
                <div className="flex items-center justify-between pt-1">

                  <p className="text-[10px] text-slate-600">
                    Settings are saved to this Forma workspace.
                  </p>

                  <Button
                    type="submit"
                    size="sm"
                  >
                    {saved ? (
                      <>
                        <Check className="w-4 h-4 mr-1.5 text-emerald-400" />
                        Saved
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-1.5" />
                        Save Changes
                      </>
                    )}
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
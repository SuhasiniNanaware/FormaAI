import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

export type Language =
  | 'en'
  | 'hi'
  | 'mr'
  | 'ja'
  | 'es'
  | 'fr'
  | 'de'
  | 'ko';

type LanguageContextType = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
};

const LANGUAGE_KEY = 'forma_language';

const LanguageContext =
  createContext<LanguageContextType | undefined>(
    undefined
  );

const translations: Record<
  Language,
  Record<string, string>
> = {
  en: {
    settings: 'Settings',
    general: 'General',
    language: 'Language',
    appearance: 'Appearance',
    saveChanges: 'Save Changes',
    saved: 'Saved',
    dashboard: 'Dashboard',
    forms: 'Forms',
    responses: 'Responses',
    analytics: 'Analytics',
    profile: 'Profile',
    notifications: 'Notifications',
    help: 'Help',
  },

  hi: {
    settings: 'सेटिंग्स',
    general: 'सामान्य',
    language: 'भाषा',
    appearance: 'दिखावट',
    saveChanges: 'परिवर्तन सहेजें',
    saved: 'सहेजा गया',
    dashboard: 'डैशबोर्ड',
    forms: 'फॉर्म',
    responses: 'प्रतिक्रियाएँ',
    analytics: 'विश्लेषण',
    profile: 'प्रोफ़ाइल',
    notifications: 'सूचनाएँ',
    help: 'सहायता',
  },

  mr: {
    settings: 'सेटिंग्ज',
    general: 'सामान्य',
    language: 'भाषा',
    appearance: 'दिसणे',
    saveChanges: 'बदल जतन करा',
    saved: 'जतन केले',
    dashboard: 'डॅशबोर्ड',
    forms: 'फॉर्म',
    responses: 'प्रतिसाद',
    analytics: 'विश्लेषण',
    profile: 'प्रोफाइल',
    notifications: 'सूचना',
    help: 'मदत',
  },

  ja: {
    settings: '設定',
    general: '一般',
    language: '言語',
    appearance: '外観',
    saveChanges: '変更を保存',
    saved: '保存しました',
    dashboard: 'ダッシュボード',
    forms: 'フォーム',
    responses: '回答',
    analytics: '分析',
    profile: 'プロフィール',
    notifications: '通知',
    help: 'ヘルプ',
  },

  es: {
    settings: 'Configuración',
    general: 'General',
    language: 'Idioma',
    appearance: 'Apariencia',
    saveChanges: 'Guardar cambios',
    saved: 'Guardado',
    dashboard: 'Panel',
    forms: 'Formularios',
    responses: 'Respuestas',
    analytics: 'Analítica',
    profile: 'Perfil',
    notifications: 'Notificaciones',
    help: 'Ayuda',
  },

  fr: {
    settings: 'Paramètres',
    general: 'Général',
    language: 'Langue',
    appearance: 'Apparence',
    saveChanges: 'Enregistrer',
    saved: 'Enregistré',
    dashboard: 'Tableau de bord',
    forms: 'Formulaires',
    responses: 'Réponses',
    analytics: 'Analyses',
    profile: 'Profil',
    notifications: 'Notifications',
    help: 'Aide',
  },

  de: {
    settings: 'Einstellungen',
    general: 'Allgemein',
    language: 'Sprache',
    appearance: 'Darstellung',
    saveChanges: 'Änderungen speichern',
    saved: 'Gespeichert',
    dashboard: 'Dashboard',
    forms: 'Formulare',
    responses: 'Antworten',
    analytics: 'Analysen',
    profile: 'Profil',
    notifications: 'Benachrichtigungen',
    help: 'Hilfe',
  },

  ko: {
    settings: '설정',
    general: '일반',
    language: '언어',
    appearance: '화면',
    saveChanges: '변경 사항 저장',
    saved: '저장됨',
    dashboard: '대시보드',
    forms: '양식',
    responses: '응답',
    analytics: '분석',
    profile: '프로필',
    notifications: '알림',
    help: '도움말',
  },
};

const getInitialLanguage = (): Language => {
  const saved =
    localStorage.getItem(LANGUAGE_KEY);

  if (
    saved &&
    saved in translations
  ) {
    return saved as Language;
  }

  return 'en';
};

export const LanguageProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [language, setLanguageState] =
    useState<Language>(
      getInitialLanguage
    );

  const setLanguage = (
    newLanguage: Language
  ) => {
    setLanguageState(newLanguage);

    localStorage.setItem(
      LANGUAGE_KEY,
      newLanguage
    );

    window.dispatchEvent(
      new CustomEvent(
        'forma-language-changed',
        {
          detail: newLanguage,
        }
      )
    );
  };

  useEffect(() => {
    document.documentElement.lang =
      language;
  }, [language]);

  const t = (key: string) => {
    return (
      translations[language]?.[key] ??
      translations.en[key] ??
      key
    );
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context =
    useContext(LanguageContext);

  if (!context) {
    throw new Error(
      'useLanguage must be used inside LanguageProvider'
    );
  }

  return context;
};

export default LanguageContext;
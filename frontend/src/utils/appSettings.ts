export type AppLanguage =
  | 'en'
  | 'ja'
  | 'es';

export type AppTheme =
  | 'dark'
  | 'midnight'
  | 'system';

export const SETTINGS_KEY =
  'forma_settings';

export const getAppSettings = () => {
  try {
    const saved =
      localStorage.getItem(
        SETTINGS_KEY
      );

    return saved
      ? JSON.parse(saved)
      : null;
  } catch {
    return null;
  }
};

export const getCurrentLanguage =
  (): AppLanguage => {
    const settings =
      getAppSettings();

    return settings?.language ||
      'en';
  };

export const getCurrentTheme =
  (): AppTheme => {
    const settings =
      getAppSettings();

    return settings?.theme ||
      'dark';
  };
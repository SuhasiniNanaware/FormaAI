export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role: 'owner' | 'admin' | 'member';
  plan: 'free' | 'pro' | 'enterprise';
  organization: string;
  createdAt: string;
}

export interface UserSettings {
  theme: 'dark' | 'light' | 'system';
  language: string;
  emailNotifications: {
    newResponse: boolean;
    weeklyDigest: boolean;
    productUpdates: boolean;
  };
  security: {
    twoFactorEnabled: boolean;
  };
}
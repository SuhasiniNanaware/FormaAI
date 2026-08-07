export type QuestionType = 
  | 'short_text' 
  | 'long_text' 
  | 'multiple_choice' 
  | 'rating' 
  | 'dropdown' 
  | 'checkbox'
  | 'date'
  | 'file_upload';

export interface QuestionOption {
  id: string;
  label: string;
  value: string;
}

export interface QuestionValidation {
  required: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  min?: number;
  max?: number;
  customErrorMessage?: string;
}

export interface Question {
  id: string;
  type: QuestionType;
  title: string;
  description?: string;
  placeholder?: string;
  options?: QuestionOption[];
  validation: QuestionValidation;
  order: number;
}

export interface FormTheme {
  primaryColor: string;
  backgroundColor: string;
  cardStyle: 'glass' | 'solid' | 'minimal';
  borderRadius: 'none' | 'sm' | 'md' | 'lg' | 'full';
  fontFamily: string;
}

export interface FormSettings {
  allowAnonymous: boolean;
  collectEmail: boolean;
  limitOneResponse: boolean;
  showProgressBar: boolean;
  customSuccessMessage: string;
  redirectUrl?: string;
}

export interface Form {
  id: string;
  title: string;
  description: string;
  status: 'draft' | 'published' | 'archived';
  questions: Question[];
  theme: FormTheme;
  settings: FormSettings;
  createdAt: string;
  updatedAt: string;
  responsesCount: number;
  completionRate: number;
  viewsCount: number;
  slug: string;
}

export interface FormSubmission {
  id: string;
  formId: string;
  submittedAt: string;
  answers: Record<string, string | number | string[]>;
  respondentEmail?: string;
  completionTimeSeconds: number;
  device: 'desktop' | 'mobile' | 'tablet';
}
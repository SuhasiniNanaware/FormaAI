import type { Form, FormSubmission } from '../types/form';
import type { UserProfile } from '../types/user';

export const mockUser: UserProfile = {
  id: 'usr_01',
  name: 'Alex Rivera',
  email: 'alex.rivera@forma.ai',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
  role: 'owner',
  plan: 'pro',
  organization: 'Apex Digital Labs',
  createdAt: '2026-01-10',
};

export const mockForms: Form[] = [
  {
    id: 'form_101',
    slug: 'student-registration-2026',
    title: 'Student Registration Form',
    description: 'Engineering Batch 2026 enrollment & course orientation preferences.',
    status: 'published',
    createdAt: '2026-07-01',
    updatedAt: '2026-07-15',
    responsesCount: 284,
    viewsCount: 340,
    completionRate: 83.5,
    theme: {
      primaryColor: '#6366f1',
      backgroundColor: '#020617',
      cardStyle: 'glass',
      borderRadius: 'md',
      fontFamily: 'Inter',
    },
    settings: {
      allowAnonymous: false,
      collectEmail: true,
      limitOneResponse: true,
      showProgressBar: true,
      customSuccessMessage: 'Registration completed! Check your inbox for confirmation.',
    },
    questions: [
      {
        id: 'q1',
        type: 'short_text',
        title: 'Full Name',
        description: 'As listed on official identification documents.',
        placeholder: 'e.g. Eleanor Vance',
        order: 1,
        validation: { required: true, minLength: 2 },
      },
      {
        id: 'q2',
        type: 'dropdown',
        title: 'Engineering Specialization',
        order: 2,
        options: [
          { id: 'opt1', label: 'Computer Science & AI', value: 'cs_ai' },
          { id: 'opt2', label: 'Robotics & Automation', value: 'robotics' },
          { id: 'opt3', label: 'Data Science & Analytics', value: 'ds' },
        ],
        validation: { required: true },
      },
      {
        id: 'q3',
        type: 'rating',
        title: 'Prior Knowledge of React & TypeScript',
        description: 'Rate your confidence level from 1 to 5.',
        order: 3,
        validation: { required: true, min: 1, max: 5 },
      },
    ],
  },
  {
    id: 'form_102',
    slug: 'patient-intake-form',
    title: 'Hospital Patient Intake Form',
    description: 'Medical history, symptoms log, and insurance details.',
    status: 'published',
    createdAt: '2026-07-10',
    updatedAt: '2026-07-20',
    responsesCount: 129,
    viewsCount: 150,
    completionRate: 86.0,
    theme: {
      primaryColor: '#06b6d4',
      backgroundColor: '#020617',
      cardStyle: 'glass',
      borderRadius: 'lg',
      fontFamily: 'Inter',
    },
    settings: {
      allowAnonymous: false,
      collectEmail: true,
      limitOneResponse: false,
      showProgressBar: true,
      customSuccessMessage: 'Your details have been securely logged.',
    },
    questions: [
      {
        id: 'q201',
        type: 'short_text',
        title: 'Patient Full Name',
        order: 1,
        validation: { required: true },
      },
      {
        id: 'q202',
        type: 'long_text',
        title: 'Primary Health Concerns or Symptoms',
        placeholder: 'Describe symptoms...',
        order: 2,
        validation: { required: true, minLength: 10 },
      },
    ],
  },
];

export const mockSubmissions: FormSubmission[] = [
  {
    id: 'sub_01',
    formId: 'form_101',
    submittedAt: '2026-07-22T10:15:00Z',
    respondentEmail: 'student1@university.edu',
    completionTimeSeconds: 84,
    device: 'desktop',
    answers: {
      q1: 'Marcus Brody',
      q2: 'cs_ai',
      q3: 4,
    },
  },
  {
    id: 'sub_02',
    formId: 'form_101',
    submittedAt: '2026-07-22T11:42:00Z',
    respondentEmail: 'student2@university.edu',
    completionTimeSeconds: 110,
    device: 'mobile',
    answers: {
      q1: 'Sophia Chen',
      q2: 'ds',
      q3: 5,
    },
  },
];
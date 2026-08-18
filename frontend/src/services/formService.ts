import axios from 'axios';
import type { Form, FormSubmission } from '../types/form';

const API = axios.create({
  baseURL: 'http://localhost:5000/api/forms',
});

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');

  if (!token) {
    throw new Error('Authentication token not found');
  }

  return {
    Authorization: `Bearer ${token}`,
  };
};

const mapBackendForm = (form: any): Form => ({
  id: form._id,
  title: form.title,
  description: form.description || '',
  status: form.status || 'draft',
  questions: form.questions || [],

  theme: form.theme || {
    primaryColor: '#8b5cf6',
    backgroundColor: '#020617',
    cardStyle: 'glass',
    borderRadius: 'md',
    fontFamily: 'Inter',
  },

  settings: form.settings || {
    allowAnonymous: true,
    collectEmail: true,
    limitOneResponse: false,
    showProgressBar: true,
    customSuccessMessage: 'Thank you for your submission!',
  },

  createdAt: form.createdAt,
  updatedAt: form.updatedAt,

  responsesCount:
    form.responsesCount ?? form.submissions ?? 0,

  completionRate: form.completionRate || 0,
  viewsCount: form.viewsCount || 0,

  slug:
    form.slug ||
    form.title
      ?.toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, ''),
});

export const formService = {

  // Get all forms from backend
  async getAllForms(): Promise<Form[]> {
    const response = await API.get('/', {
      headers: getAuthHeaders(),
    });

    const backendForms = response.data.data || [];

    return backendForms.map(mapBackendForm);
  },

  // Get one form from backend
  async getFormById(id: string): Promise<Form | null> {
    try {
      const response = await API.get(`/${id}`);

      return mapBackendForm(response.data.data);
    } catch (error) {
      console.error('Failed to fetch form:', error);
      return null;
    }
  },

  // Generate form using real AI backend
  async generateFormWithAI(prompt: string): Promise<Form> {
    const response = await API.post(
      '/generate',
      { prompt },
      {
        headers: getAuthHeaders(),
      }
    );

    return mapBackendForm(response.data.data);
  },

  // Get form responses
  async getFormResponses(
    formId: string
  ): Promise<FormSubmission[]> {
    const response = await API.get(
      `/${formId}/responses`,
      {
        headers: getAuthHeaders(),
      }
    );

    return response.data.data || [];
  },

  // Submit form response
  async submitFormResponse(
    formId: string,
    answers: Record<string, any>
  ): Promise<boolean> {
    await API.post(
      `/${formId}/responses`,
      {
        answers,
        completionTimeSeconds: 45,
        device: 'desktop',
      }
    );

    return true;
  },

  // Create a normal form
  async createForm(
    title: string,
    description: string
  ): Promise<Form> {
    const response = await API.post(
      '/',
      {
        title,
        description,
      },
      {
        headers: getAuthHeaders(),
      }
    );

    return mapBackendForm(response.data.data);
  },

  // Update form
  async updateForm(
    formId: string,
    updates: Partial<Form>
  ): Promise<Form> {
    const response = await API.put(
      `/${formId}`,
      updates,
      {
        headers: getAuthHeaders(),
      }
    );

    return mapBackendForm(response.data.data);
  },

  // Delete form
  async deleteForm(formId: string): Promise<boolean> {
    await API.delete(
      `/${formId}`,
      {
        headers: getAuthHeaders(),
      }
    );

    return true;
  },
};
import axios from 'axios';
import type { Form, FormSubmission } from '../types/form';

const API = axios.create({
  baseURL: 'http://localhost:5000/api/forms',
  timeout: 15000,
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

/**
 * Converts MongoDB Form documents into the frontend Form type.
 */
const normalizeForm = (form: any): Form => {
  return {
    id: form._id || form.id,
    title: form.title || '',
    description: form.description || '',
    status: form.status || 'draft',

    questions: Array.isArray(form.questions)
      ? form.questions
      : [],

    theme: form.theme || {
      primaryColor: '#6366f1',
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

    responsesCount: form.responsesCount || 0,
    completionRate: form.completionRate || 0,
    viewsCount: form.viewsCount || 0,

    slug:
      form.slug ||
      form.title
        ?.toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, ''),
  };
};

export const formService = {

  /**
   * Get all forms belonging to the logged-in user.
   */
  async getAllForms(): Promise<Form[]> {
    const response = await API.get('/my-forms', {
      headers: getAuthHeaders(),
    });

    const forms = response.data?.data || [];

    return forms.map(normalizeForm);
  },

  /**
   * Get a single form by MongoDB ID or slug.
   */
  async getFormById(id: string): Promise<Form | null> {
    try {
      const response = await API.get(`/${id}`);

      const form = response.data?.data;

      if (!form) {
        return null;
      }

      return normalizeForm(form);
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }

      throw error;
    }
  },

  /**
   * Create a new form in MongoDB.
   */
  async createForm(
    formData: Partial<Form>
  ): Promise<Form> {

    const response = await API.post(
      '/',
      formData,
      {
        headers: getAuthHeaders(),
      }
    );

    return normalizeForm(response.data.data);
  },

  /**
   * Update an existing form.
   */
  async updateForm(
    id: string,
    updates: Partial<Form>
  ): Promise<Form> {

    const response = await API.put(
      `/${id}`,
      updates,
      {
        headers: getAuthHeaders(),
      }
    );

    return normalizeForm(response.data.data);
  },

  /**
   * Delete a form.
   */
  async deleteForm(id: string): Promise<boolean> {

    await API.delete(
      `/${id}`,
      {
        headers: getAuthHeaders(),
      }
    );

    return true;
  },

  /**
   * Generate a form using the real AI backend.
   */
 async generateFormWithAI(prompt: string): Promise<Form> {
  const response = await API.post(
    '/generate',
    { prompt },
    {
      headers: getAuthHeaders(),
    }
  );

  return normalizeForm(response.data.data);
},

  /**
   * Get responses for a form.
   */
  async getFormResponses(
    formId: string
  ): Promise<FormSubmission[]> {

    const response = await API.get(
      `/${formId}/responses`
    );

    return response.data?.data || [];
  },

  /**
   * Submit a response to a form.
   */
  async submitFormResponse(
    formId: string,
    answers: Record<string, any>,
    respondentEmail?: string,
    completionTimeSeconds?: number,
    device: 'desktop' | 'mobile' | 'tablet' = 'desktop'
  ): Promise<FormSubmission> {

    const response = await API.post(
      `/${formId}/responses`,
      {
        answers,
        respondentEmail,
        completionTimeSeconds,
        device,
      }
    );

    return response.data.data;
  },
};
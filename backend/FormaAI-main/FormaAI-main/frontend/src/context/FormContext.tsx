import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Form, Question, FormSubmission } from '../types/form';
import { formService } from '../services/formService';

export interface FormContextType {
  forms: Form[];
  activeForm: Form | null;
  isLoading: boolean;
  aiPrompt: string;
  setAiPrompt: (prompt: string) => void;
  setActiveForm: (form: Form | null) => void;
  loadForms: () => Promise<void>;
  createFromPrompt: (prompt: string) => Promise<Form>;
  addQuestionToActiveForm: (question: Question) => void;
  updateQuestionInActiveForm: (questionId: string, updated: Partial<Question>) => void;
  deleteQuestionFromActiveForm: (questionId: string) => void;
  reorderQuestionsInActiveForm: (startIndex: number, endIndex: number) => void;
  getActiveFormResponses: () => Promise<FormSubmission[]>;
}

const FormContext = createContext<FormContextType | undefined>(undefined);

export const FormProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [forms, setForms] = useState<Form[]>([]);
  const [activeForm, setActiveForm] = useState<Form | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [aiPrompt, setAiPrompt] = useState<string>('');

  const loadForms = async () => {
    setIsLoading(true);
    try {
      const data = await formService.getAllForms();
      setForms(data);
      if (data.length > 0 && !activeForm) {
        setActiveForm(data[0]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadForms();
  }, []);

  const createFromPrompt = async (prompt: string): Promise<Form> => {
    setIsLoading(true);
    try {
      const newForm = await formService.generateFormWithAI(prompt);
      setForms((prev) => [newForm, ...prev]);
      setActiveForm(newForm);
      return newForm;
    } finally {
      setIsLoading(false);
    }
  };

  const addQuestionToActiveForm = (question: Question) => {
    if (!activeForm) return;
    const updated = {
      ...activeForm,
      questions: [...activeForm.questions, question],
    };
    setActiveForm(updated);
    setForms((prev) => prev.map((f) => (f.id === updated.id ? updated : f)));
  };

  const updateQuestionInActiveForm = (questionId: string, updatedProps: Partial<Question>) => {
    if (!activeForm) return;
    const updatedQuestions = activeForm.questions.map((q) =>
      q.id === questionId ? { ...q, ...updatedProps } : q
    );
    const updated = { ...activeForm, questions: updatedQuestions };
    setActiveForm(updated);
    setForms((prev) => prev.map((f) => (f.id === updated.id ? updated : f)));
  };

  const deleteQuestionFromActiveForm = (questionId: string) => {
    if (!activeForm) return;
    const updatedQuestions = activeForm.questions.filter((q) => q.id !== questionId);
    const updated = { ...activeForm, questions: updatedQuestions };
    setActiveForm(updated);
    setForms((prev) => prev.map((f) => (f.id === updated.id ? updated : f)));
  };

  const reorderQuestionsInActiveForm = (startIndex: number, endIndex: number) => {
    if (!activeForm) return;
    const result = Array.from(activeForm.questions);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    const ordered = result.map((q, idx) => ({ ...q, order: idx + 1 }));
    const updated = { ...activeForm, questions: ordered };
    setActiveForm(updated);
    setForms((prev) => prev.map((f) => (f.id === updated.id ? updated : f)));
  };

  const getActiveFormResponses = async (): Promise<FormSubmission[]> => {
    if (!activeForm) return [];
    return await formService.getFormResponses(activeForm.id);
  };

  return (
    <FormContext.Provider
      value={{
        forms,
        activeForm,
        isLoading,
        aiPrompt,
        setAiPrompt,
        setActiveForm,
        loadForms,
        createFromPrompt,
        addQuestionToActiveForm,
        updateQuestionInActiveForm,
        deleteQuestionFromActiveForm,
        reorderQuestionsInActiveForm,
        getActiveFormResponses,
      }}
    >
      {children}
    </FormContext.Provider>
  );
};

export const useFormContext = () => {
  const context = useContext(FormContext);
  if (!context) throw new Error('useFormContext must be used within FormProvider');
  return context;
};
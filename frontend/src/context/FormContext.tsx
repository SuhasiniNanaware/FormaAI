import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';

import type {
  Form,
  Question,
  FormSubmission,
} from '../types/form';

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

  saveActiveForm: () => Promise<Form>;

  addQuestionToActiveForm: (question: Question) => void;

  updateQuestionInActiveForm: (
    questionId: string,
    updated: Partial<Question>
  ) => void;

  deleteQuestionFromActiveForm: (
    questionId: string
  ) => void;

  reorderQuestionsInActiveForm: (
    startIndex: number,
    endIndex: number
  ) => void;

  getActiveFormResponses: () => Promise<FormSubmission[]>;
}

const FormContext =
  createContext<FormContextType | undefined>(undefined);

const ACTIVE_FORM_STORAGE_KEY =
  'formaai_active_form';

export const FormProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [forms, setForms] = useState<Form[]>([]);

  const [activeForm, setActiveFormState] =
    useState<Form | null>(() => {
      try {
        const stored =
          sessionStorage.getItem(
            ACTIVE_FORM_STORAGE_KEY
          );

        if (!stored) {
          return null;
        }

        return JSON.parse(stored) as Form;
      } catch (error) {
        console.error(
          'Failed to restore active form:',
          error
        );

        sessionStorage.removeItem(
          ACTIVE_FORM_STORAGE_KEY
        );

        return null;
      }
    });

  const [isLoading, setIsLoading] =
    useState<boolean>(true);

  const [aiPrompt, setAiPrompt] =
    useState<string>('');

  /*
   * =========================================================
   * SET ACTIVE FORM
   * =========================================================
   *
   * Keeps React state AND session storage synchronized.
   *
   * This is frontend-only persistence.
   * No backend/API changes.
   */
  const setActiveForm = useCallback(
    (form: Form | null) => {
      setActiveFormState(form);

      try {
        if (form) {
          sessionStorage.setItem(
            ACTIVE_FORM_STORAGE_KEY,
            JSON.stringify(form)
          );
        } else {
          sessionStorage.removeItem(
            ACTIVE_FORM_STORAGE_KEY
          );
        }
      } catch (error) {
        console.error(
          'Failed to persist active form:',
          error
        );
      }
    },
    []
  );

  /*
   * =========================================================
   * LOAD FORMS
   * =========================================================
   */
  const loadForms = useCallback(async (): Promise<void> => {
    setIsLoading(true);

    try {
      const data =
        await formService.getAllForms();

      setForms(data);

      /*
       * If we already have an active form,
       * refresh it from the backend.
       */
      setActiveFormState((currentActiveForm) => {
        if (currentActiveForm) {
          const refreshedForm =
            data.find(
              (form) =>
                form.id === currentActiveForm.id
            );

          if (refreshedForm) {
            try {
              sessionStorage.setItem(
                ACTIVE_FORM_STORAGE_KEY,
                JSON.stringify(refreshedForm)
              );
            } catch {
              // Ignore storage errors.
            }

            return refreshedForm;
          }

          return currentActiveForm;
        }

        /*
         * No active form exists.
         * Select the first available form.
         */
        if (data.length > 0) {
          try {
            sessionStorage.setItem(
              ACTIVE_FORM_STORAGE_KEY,
              JSON.stringify(data[0])
            );
          } catch {
            // Ignore storage errors.
          }

          return data[0];
        }

        return null;
      });
    } catch (error) {
      console.error(
        'Failed to load forms:',
        error
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  /*
   * =========================================================
   * INITIAL LOAD
   * =========================================================
   */
  useEffect(() => {
    void loadForms();
  }, [loadForms]);

  /*
   * =========================================================
   * CREATE FORM FROM AI PROMPT
   * =========================================================
   */
  const createFromPrompt = useCallback(
    async (prompt: string): Promise<Form> => {
      setIsLoading(true);

      try {
        const newForm =
          await formService.generateFormWithAI(
            prompt
          );

        setForms((previousForms) => [
          newForm,
          ...previousForms,
        ]);

        setActiveForm(newForm);

        return newForm;
      } finally {
        setIsLoading(false);
      }
    },
    [setActiveForm]
  );

  /*
   * =========================================================
   * SAVE ACTIVE FORM
   * =========================================================
   */
  const saveActiveForm = useCallback(
    async (): Promise<Form> => {
      if (!activeForm) {
        throw new Error(
          'No active form selected'
        );
      }

      setIsLoading(true);

      try {
        /*
         * KEEP EXISTING BACKEND CONNECTION.
         *
         * PUT /api/forms/:id
         */
        const savedForm =
          await formService.updateForm(
            activeForm.id,
            {
              title: activeForm.title,
              description:
                activeForm.description,
              status: activeForm.status,
              questions:
                activeForm.questions,
              theme: activeForm.theme,
              settings:
                activeForm.settings,
            }
          );

        /*
         * IMPORTANT:
         * Store exactly what backend returned.
         */
        setActiveForm(savedForm);

        /*
         * Keep forms list synchronized.
         */
        setForms((previousForms) =>
          previousForms.map((form) =>
            form.id === savedForm.id
              ? savedForm
              : form
          )
        );

        /*
         * Extra frontend persistence.
         */
        try {
          sessionStorage.setItem(
            ACTIVE_FORM_STORAGE_KEY,
            JSON.stringify(savedForm)
          );
        } catch (error) {
          console.error(
            'Failed to cache saved form:',
            error
          );
        }

        return savedForm;
      } catch (error) {
        console.error(
          'Failed to save active form:',
          error
        );

        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [activeForm, setActiveForm]
  );

  /*
   * =========================================================
   * ADD QUESTION
   * =========================================================
   */
  const addQuestionToActiveForm = (
    question: Question
  ): void => {
    if (!activeForm) {
      return;
    }

    const updatedForm: Form = {
      ...activeForm,
      questions: [
        ...activeForm.questions,
        question,
      ],
    };

    setActiveForm(updatedForm);

    setForms((previousForms) =>
      previousForms.map((form) =>
        form.id === updatedForm.id
          ? updatedForm
          : form
      )
    );
  };

  /*
   * =========================================================
   * UPDATE QUESTION
   * =========================================================
   */
  const updateQuestionInActiveForm = (
    questionId: string,
    updatedProps: Partial<Question>
  ): void => {
    if (!activeForm) {
      return;
    }

    const updatedQuestions =
      activeForm.questions.map((question) =>
        question.id === questionId
          ? {
              ...question,
              ...updatedProps,
            }
          : question
      );

    const updatedForm: Form = {
      ...activeForm,
      questions: updatedQuestions,
    };

    setActiveForm(updatedForm);

    setForms((previousForms) =>
      previousForms.map((form) =>
        form.id === updatedForm.id
          ? updatedForm
          : form
      )
    );
  };

  /*
   * =========================================================
   * DELETE QUESTION
   * =========================================================
   */
  const deleteQuestionFromActiveForm = (
    questionId: string
  ): void => {
    if (!activeForm) {
      return;
    }

    const filteredQuestions =
      activeForm.questions.filter(
        (question) =>
          question.id !== questionId
      );

    const orderedQuestions =
      filteredQuestions.map(
        (question, index) => ({
          ...question,
          order: index + 1,
        })
      );

    const updatedForm: Form = {
      ...activeForm,
      questions: orderedQuestions,
    };

    setActiveForm(updatedForm);

    setForms((previousForms) =>
      previousForms.map((form) =>
        form.id === updatedForm.id
          ? updatedForm
          : form
      )
    );
  };

  /*
   * =========================================================
   * REORDER QUESTIONS
   * =========================================================
   */
  const reorderQuestionsInActiveForm = (
    startIndex: number,
    endIndex: number
  ): void => {
    if (!activeForm) {
      return;
    }

    if (
      startIndex < 0 ||
      endIndex < 0 ||
      startIndex >=
        activeForm.questions.length ||
      endIndex >=
        activeForm.questions.length
    ) {
      return;
    }

    const result =
      Array.from(activeForm.questions);

    const [removed] =
      result.splice(startIndex, 1);

    if (!removed) {
      return;
    }

    result.splice(endIndex, 0, removed);

    const orderedQuestions =
      result.map(
        (question, index) => ({
          ...question,
          order: index + 1,
        })
      );

    const updatedForm: Form = {
      ...activeForm,
      questions: orderedQuestions,
    };

    setActiveForm(updatedForm);

    setForms((previousForms) =>
      previousForms.map((form) =>
        form.id === updatedForm.id
          ? updatedForm
          : form
      )
    );
  };

  /*
   * =========================================================
   * GET ACTIVE FORM RESPONSES
   * =========================================================
   */
  const getActiveFormResponses =
    async (): Promise<FormSubmission[]> => {
      if (!activeForm) {
        return [];
      }

      return await formService.getFormResponses(
        activeForm.id
      );
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

        saveActiveForm,

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
  const context =
    useContext(FormContext);

  if (!context) {
    throw new Error(
      'useFormContext must be used within FormProvider'
    );
  }

  return context;
};
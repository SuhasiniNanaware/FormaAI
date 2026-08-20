export type DraftAnswers = Record<string, any>;

const getStorageKey = (formId: string) =>
  `forma_ai_draft_answers_${formId}`;

export const getDraftAnswers = (
  formId: string
): DraftAnswers => {
  try {
    const stored =
      localStorage.getItem(
        getStorageKey(formId)
      );

    if (!stored) {
      return {};
    }

    return JSON.parse(stored);
  } catch {
    return {};
  }
};

export const saveDraftAnswers = (
  formId: string,
  answers: DraftAnswers
) => {
  try {
    localStorage.setItem(
      getStorageKey(formId),
      JSON.stringify(answers)
    );
  } catch (error) {
    console.error(
      'Failed to save draft answers:',
      error
    );
  }
};

export const clearDraftAnswers = (
  formId: string
) => {
  try {
    localStorage.removeItem(
      getStorageKey(formId)
    );
  } catch (error) {
    console.error(
      'Failed to clear draft answers:',
      error
    );
  }
};
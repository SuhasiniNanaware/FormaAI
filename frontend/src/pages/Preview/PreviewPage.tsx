import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Edit3,
  Star,
  Calendar,
  Upload,
  Send,
  CheckCircle2,
  Loader2,
} from 'lucide-react';

import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';

import { useFormContext } from '../../context/FormContext';
import { formService } from '../../services/formService';

import {
  getDraftAnswers,
  saveDraftAnswers,
  clearDraftAnswers,
} from '../../utils/formDraft';

export const PreviewPage: React.FC = () => {
  const navigate = useNavigate();

  /*
   * IMPORTANT:
   * Use both activeForm and forms.
   *
   * activeForm contains the latest form being edited.
   * forms provides a fallback so Preview does not become
   * blank if activeForm is temporarily unavailable.
   */
  const {
    activeForm,
    forms,
    setActiveForm,
  } = useFormContext();

  const currentForm = activeForm || forms[0] || null;

  const [submitted, setSubmitted] =
    useState(false);

  const [answers, setAnswers] =
    useState<Record<string, any>>({});

  const [respondentEmail, setRespondentEmail] =
    useState('');

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [error, setError] =
    useState('');

  const [startedAt] =
    useState<number>(Date.now());

  /*
   * =========================================================
   * KEEP THE LATEST FORM SELECTED
   * =========================================================
   */

  useEffect(() => {
    if (!currentForm) {
      return;
    }

    /*
     * Make sure the context has the same form
     * that Preview is displaying.
     */
    if (
      !activeForm ||
      activeForm.id !== currentForm.id
    ) {
      setActiveForm(currentForm);
    }

    /*
     * Load any respondent draft answers that belong
     * to this form.
     */
    const savedAnswers =
      getDraftAnswers(currentForm.id);

    setAnswers(savedAnswers);
  }, [
    currentForm?.id,
    activeForm,
    setActiveForm,
  ]);

  /*
   * =========================================================
   * NO FORM
   * =========================================================
   */

  if (!currentForm) {
    return (
      <div className="text-center py-20 space-y-4">

        <h2 className="text-xl font-bold text-white">
          No active form selected
        </h2>

        <p className="text-sm text-slate-500">
          Create or select a form before opening preview.
        </p>

        <Button
          onClick={() =>
            navigate('/dashboard')
          }
        >
          Back to Dashboard
        </Button>

      </div>
    );
  }

  /*
   * =========================================================
   * INPUT CHANGE
   * =========================================================
   */

  const handleInputChange = (
    questionId: string,
    value: any
  ) => {

    setAnswers((previous) => {

      const updated = {
        ...previous,
        [questionId]: value,
      };

      saveDraftAnswers(
        currentForm.id,
        updated
      );

      return updated;
    });

    setError('');
  };

  /*
   * =========================================================
   * CHECKBOX CHANGE
   * =========================================================
   */

  const handleCheckboxChange = (
    questionId: string,
    value: string,
    checked: boolean
  ) => {

    setAnswers((previous) => {

      const current =
        Array.isArray(
          previous[questionId]
        )
          ? previous[questionId]
          : [];

      const updated = checked
        ? current.includes(value)
          ? current
          : [...current, value]
        : current.filter(
            (item: string) =>
              item !== value
          );

      const nextAnswers = {
        ...previous,
        [questionId]: updated,
      };

      saveDraftAnswers(
        currentForm.id,
        nextAnswers
      );

      return nextAnswers;
    });

    setError('');
  };

  /*
   * =========================================================
   * VALIDATE
   * =========================================================
   */

  const validateForm = (): string | null => {

    for (const question of currentForm.questions) {

      if (!question.validation?.required) {
        continue;
      }

      const answer =
        answers[question.id];

      const isEmpty =
        answer === undefined ||
        answer === null ||
        answer === '' ||
        (Array.isArray(answer) &&
          answer.length === 0);

      if (isEmpty) {
        return `Please answer: ${question.title}`;
      }
    }

    if (
      currentForm.settings?.collectEmail
    ) {

      if (!respondentEmail.trim()) {
        return 'Please enter your email address.';
      }

      const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (
        !emailPattern.test(
          respondentEmail.trim()
        )
      ) {
        return 'Please enter a valid email address.';
      }
    }

    return null;
  };

  /*
   * =========================================================
   * SUBMIT
   * =========================================================
   */

  const handleSubmit = async (
    event: React.FormEvent
  ) => {

    event.preventDefault();

    setError('');

    const validationError =
      validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    saveDraftAnswers(
      currentForm.id,
      answers
    );

    setIsSubmitting(true);

    try {

      const completionTimeSeconds =
        Math.max(
          1,
          Math.round(
            (Date.now() -
              startedAt) /
              1000
          )
        );

      await formService.submitFormResponse(
        currentForm.id,
        answers,
        respondentEmail.trim() ||
          undefined,
        completionTimeSeconds,
        /Mobi|Android/i.test(
          navigator.userAgent
        )
          ? 'mobile'
          : 'desktop'
      );

      setSubmitted(true);

    } catch (submitError: any) {

      console.error(
        'Failed to submit response:',
        submitError
      );

      setError(
        submitError?.response
          ?.data?.message ||
          submitError?.message ||
          'Unable to submit your response. Please try again.'
      );

    } finally {
      setIsSubmitting(false);
    }
  };

  /*
   * =========================================================
   * SUBMIT ANOTHER
   * =========================================================
   */

  const handleSubmitAnother = () => {

    clearDraftAnswers(
      currentForm.id
    );

    setAnswers({});
    setRespondentEmail('');
    setError('');
    setSubmitted(false);
  };

  /*
   * =========================================================
   * SUCCESS
   * =========================================================
   */

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto py-10">

        <Card className="p-12 text-center space-y-5 border-emerald-500/30">

          <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-7 h-7" />
          </div>

          <div className="space-y-2">

            <h2 className="text-xl font-bold text-white">
              Response Submitted!
            </h2>

            <p className="text-sm text-slate-400 max-w-sm mx-auto">
              {currentForm.settings
                ?.customSuccessMessage ||
                'Thank you for taking the time to complete this form.'}
            </p>

          </div>

          <div className="flex items-center justify-center gap-3 flex-wrap">

            <Button
              variant="secondary"
              size="sm"
              onClick={() =>
                navigate('/form-builder')
              }
            >
              <Edit3 className="w-4 h-4 mr-1.5" />
              Edit Form
            </Button>

            <Button
              size="sm"
              onClick={
                handleSubmitAnother
              }
            >
              Submit Another Response
            </Button>

          </div>

        </Card>

      </div>
    );
  }

  /*
   * =========================================================
   * PREVIEW PAGE
   * =========================================================
   */

  return (
    <div className="max-w-2xl mx-auto space-y-6 py-4">

      {/* TOP CONTROLS */}

      <div className="flex items-center justify-between gap-3">

        <Button
          variant="ghost"
          size="sm"
          onClick={() =>
            navigate('/form-builder')
          }
        >
          <ArrowLeft className="w-4 h-4 mr-1.5" />
          Back to Builder
        </Button>

        <div className="flex items-center gap-2">

          <Badge variant="slate">
            Preview
          </Badge>

          <Button
            variant="secondary"
            size="sm"
            onClick={() =>
              navigate('/form-builder')
            }
          >
            <Edit3 className="w-4 h-4 mr-1.5" />
            Edit Form
          </Button>

        </div>

      </div>

      {/* FORM */}

      <form
        onSubmit={handleSubmit}
        className="space-y-6"
      >

        {/* =====================================================
            SAVED FORM DETAILS
        ====================================================== */}

        <Card className="p-6 border-slate-800 space-y-3">

          <div className="flex items-start justify-between gap-3">

            <div className="space-y-2 flex-1">

              <h1 className="text-2xl font-bold text-white">
                {currentForm.title ||
                  'Untitled Form'}
              </h1>

              {currentForm.description && (
                <p className="text-sm text-slate-400 leading-relaxed">
                  {currentForm.description}
                </p>
              )}

            </div>

            <Badge
              variant={
                currentForm.status ===
                'published'
                  ? 'emerald'
                  : 'slate'
              }
              className="capitalize shrink-0"
            >
              {currentForm.status}
            </Badge>

          </div>

          <div className="flex items-center gap-2 pt-2">

            <span className="text-xs text-slate-600">
              {currentForm.questions.length}{' '}
              field
              {currentForm.questions.length !== 1
                ? 's'
                : ''}
            </span>

            <span className="text-slate-700">
              •
            </span>

            <span className="text-xs text-slate-600">
              Form Preview
            </span>

          </div>

        </Card>

        {/* =====================================================
            EMAIL
        ====================================================== */}

        {currentForm.settings?.collectEmail && (

          <Card className="p-6 border-slate-800 space-y-3">

            <label className="block text-sm font-medium text-white">

              Email Address

              <span className="text-red-400 ml-1">
                *
              </span>

            </label>

            <input
              type="email"
              value={respondentEmail}
              onChange={(event) => {

                setRespondentEmail(
                  event.target.value
                );

                setError('');
              }}
              placeholder="you@example.com"
              required
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
            />

          </Card>
        )}

        {/* =====================================================
            SAVED QUESTIONS
        ====================================================== */}

        {currentForm.questions.map(
          (question, index) => (

            <Card
              key={question.id}
              className="p-6 border-slate-800 space-y-4"
            >

              {/* QUESTION TITLE */}

              <div>

                <label className="block text-sm font-medium text-white">

                  {index + 1}.{' '}

                  {question.title ||
                    'Untitled Question'}

                  {question.validation?.required && (
                    <span className="text-red-400 ml-1">
                      *
                    </span>
                  )}

                </label>

                {question.description && (
                  <p className="text-xs text-slate-500 mt-1">
                    {question.description}
                  </p>
                )}

              </div>

              {/* SHORT TEXT */}

              {question.type ===
                'short_text' && (

                <input
                  type="text"
                  required={
                    question.validation?.required
                  }
                  value={
                    answers[question.id] || ''
                  }
                  onChange={(event) =>
                    handleInputChange(
                      question.id,
                      event.target.value
                    )
                  }
                  placeholder={
                    question.placeholder ||
                    'Your answer'
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                />

              )}

              {/* LONG TEXT */}

              {question.type ===
                'long_text' && (

                <textarea
                  rows={5}
                  required={
                    question.validation?.required
                  }
                  value={
                    answers[question.id] || ''
                  }
                  onChange={(event) =>
                    handleInputChange(
                      question.id,
                      event.target.value
                    )
                  }
                  placeholder={
                    question.placeholder ||
                    'Your response'
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 resize-none"
                />

              )}

              {/* MULTIPLE CHOICE */}

              {question.type ===
                'multiple_choice' && (

                <div className="space-y-2">

                  {question.options?.map(
                    (option) => (

                      <label
                        key={option.id}
                        className="flex items-center gap-3 p-3 rounded-xl border border-slate-800 bg-slate-950/60 hover:border-indigo-500/50 cursor-pointer transition"
                      >

                        <input
                          type="radio"
                          name={
                            question.id
                          }
                          value={
                            option.value
                          }
                          checked={
                            answers[
                              question.id
                            ] ===
                            option.value
                          }
                          onChange={() =>
                            handleInputChange(
                              question.id,
                              option.value
                            )
                          }
                          required={
                            question.validation
                              ?.required
                          }
                          className="text-indigo-600"
                        />

                        <span className="text-sm text-slate-300">
                          {option.label}
                        </span>

                      </label>

                    )
                  )}

                </div>

              )}

              {/* CHECKBOX */}

              {question.type ===
                'checkbox' && (

                <div className="space-y-2">

                  {question.options?.map(
                    (option) => {

                      const selected =
                        Array.isArray(
                          answers[
                            question.id
                          ]
                        ) &&
                        answers[
                          question.id
                        ].includes(
                          option.value
                        );

                      return (
                        <label
                          key={option.id}
                          className="flex items-center gap-3 p-3 rounded-xl border border-slate-800 bg-slate-950/60 hover:border-indigo-500/50 cursor-pointer transition"
                        >

                          <input
                            type="checkbox"
                            value={
                              option.value
                            }
                            checked={
                              selected
                            }
                            onChange={(event) =>
                              handleCheckboxChange(
                                question.id,
                                option.value,
                                event.target.checked
                              )
                            }
                            className="rounded border-slate-700 bg-slate-950 text-indigo-600"
                          />

                          <span className="text-sm text-slate-300">
                            {option.label}
                          </span>

                        </label>
                      );
                    }
                  )}

                </div>

              )}

              {/* DROPDOWN */}

              {question.type ===
                'dropdown' && (

                <select
                  required={
                    question.validation
                      ?.required
                  }
                  value={
                    answers[
                      question.id
                    ] || ''
                  }
                  onChange={(event) =>
                    handleInputChange(
                      question.id,
                      event.target.value
                    )
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500"
                >

                  <option value="">
                    Select an option...
                  </option>

                  {question.options?.map(
                    (option) => (

                      <option
                        key={option.id}
                        value={option.value}
                      >
                        {option.label}
                      </option>

                    )
                  )}

                </select>

              )}

              {/* RATING */}

              {question.type ===
                'rating' && (

                <div className="flex gap-2">

                  {[1, 2, 3, 4, 5].map(
                    (star) => {

                      const selected =
                        Number(
                          answers[
                            question.id
                          ] || 0
                        ) >= star;

                      return (
                        <button
                          key={star}
                          type="button"
                          onClick={() =>
                            handleInputChange(
                              question.id,
                              star
                            )
                          }
                          className={`p-1 transition ${
                            selected
                              ? 'text-amber-400'
                              : 'text-slate-700 hover:text-slate-500'
                          }`}
                        >
                          <Star
                            className="w-7 h-7 fill-current"
                          />
                        </button>
                      );
                    }
                  )}

                </div>

              )}

              {/* DATE */}

              {question.type ===
                'date' && (

                <div className="relative">

                  <input
                    type="date"
                    required={
                      question.validation
                        ?.required
                    }
                    value={
                      answers[
                        question.id
                      ] || ''
                    }
                    onChange={(event) =>
                      handleInputChange(
                        question.id,
                        event.target.value
                      )
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500"
                  />

                  <Calendar className="w-4 h-4 text-slate-500 absolute right-3 top-3 pointer-events-none" />

                </div>

              )}

              {/* FILE UPLOAD */}

              {question.type ===
                'file_upload' && (

                <label className="block cursor-pointer">

                  <div className="border border-dashed border-slate-800 rounded-xl p-6 text-center space-y-2 bg-slate-950/40 hover:border-indigo-500/50 transition">

                    <Upload className="w-6 h-6 text-slate-500 mx-auto" />

                    <p className="text-xs text-slate-400">
                      Click to select a file
                    </p>

                    <p className="text-[10px] text-slate-600">
                      Select a file for this response.
                    </p>

                  </div>

                  <input
                    type="file"
                    required={
                      question.validation
                        ?.required
                    }
                    className="hidden"
                    onChange={(event) => {

                      const file =
                        event.target.files?.[0];

                      if (file) {
                        handleInputChange(
                          question.id,
                          file.name
                        );
                      }

                    }}
                  />

                  {answers[
                    question.id
                  ] && (

                    <p className="text-xs text-indigo-400 mt-2">
                      Selected:{' '}
                      {answers[
                        question.id
                      ]}
                    </p>

                  )}

                </label>

              )}

            </Card>

          )
        )}

        {/* EMPTY FORM */}

        {currentForm.questions.length === 0 && (

          <Card className="p-10 text-center border-dashed border-slate-800">

            <p className="text-sm text-slate-400">
              This form doesn't have any questions yet.
            </p>

            <Button
              variant="secondary"
              size="sm"
              className="mt-4"
              onClick={() =>
                navigate('/form-builder')
              }
            >
              <Edit3 className="w-4 h-4 mr-1.5" />
              Add Questions
            </Button>

          </Card>

        )}

        {/* ERROR */}

        {error && (

          <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3">

            <p className="text-sm text-red-400">
              {error}
            </p>

          </div>

        )}

        {/* SUBMIT */}

        {currentForm.questions.length > 0 && (

          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting}
          >

            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
                Submitting Response...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-1.5" />
                Submit Response
              </>
            )}

          </Button>

        )}

      </form>
    </div>
  );
};

export default PreviewPage;
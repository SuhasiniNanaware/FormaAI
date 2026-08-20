import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Type,
  AlignLeft,
  CheckSquare,
  List,
  Star,
  Upload,
  Calendar,
  ChevronDown,
  Plus,
  Trash2,
  ChevronUp,
  Eye,
  Send,
  Sparkles,
  GripVertical,
  Save,
} from 'lucide-react';

import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { useFormContext } from '../../context/FormContext';

import type {
  Question,
  QuestionType,
  QuestionOption,
  Form,
} from '../../types/form';

export const FormBuilderPage: React.FC = () => {
  const navigate = useNavigate();

  const {
    activeForm,
    setActiveForm,
    addQuestionToActiveForm,
    updateQuestionInActiveForm,
    deleteQuestionFromActiveForm,
    reorderQuestionsInActiveForm,
    saveActiveForm,
  } = useFormContext();

  const [activeQuestionId, setActiveQuestionId] =
    useState<string | null>(null);

  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  /*
   * TEST / PREVIEW ANSWERS
   *
   * These values are only used while interacting with
   * the form inside the builder.
   *
   * They do NOT modify the generated question structure
   * and are NOT saved to MongoDB.
   */
  const [previewAnswers, setPreviewAnswers] = useState<
    Record<string, any>
  >({});

  /*
   * Update a test answer.
   */
  const handlePreviewAnswer = (
    questionId: string,
    value: any
  ) => {
    setPreviewAnswers((previous) => ({
      ...previous,
      [questionId]: value,
    }));
  };

  /*
   * No active form
   */
  if (!activeForm) {
    return (
      <div className="text-center py-20 space-y-4">
        <h2 className="text-xl font-bold text-white">
          No active form selected
        </h2>

        <p className="text-sm text-slate-500">
          Create or select a form before opening the builder.
        </p>

        <Button onClick={() => navigate('/create-form')}>
          Create New Form
        </Button>
      </div>
    );
  }

  /*
   * Update basic form information locally.
   */
  const updateFormDetails = (updates: Partial<Form>) => {
    setActiveForm({
      ...activeForm,
      ...updates,
    });
  };

  
  const handleAddQuestion = (type: QuestionType) => {
    const isChoice =
      type === 'multiple_choice' ||
      type === 'dropdown' ||
      type === 'checkbox';

    const timestamp = Date.now();

    const newQuestion: Question = {
      id: `q_${timestamp}`,
      type,
      title: `New ${type.replace('_', ' ')} Question`,
      description: '',
      placeholder: 'Enter response...',
      validation: {
        required: true,
      },
      options: isChoice
        ? [
            {
              id: `opt_${timestamp}_1`,
              label: 'Option 1',
              value: 'option_1',
            },
            {
              id: `opt_${timestamp}_2`,
              label: 'Option 2',
              value: 'option_2',
            },
          ]
        : undefined,
      order: activeForm.questions.length + 1,
    };

    addQuestionToActiveForm(newQuestion);

    setActiveQuestionId(newQuestion.id);
  };

  /*
   * Add an option.
   */
  const handleAddOption = (
    questionId: string,
    currentOptions: QuestionOption[] = []
  ) => {
    const nextIndex = currentOptions.length + 1;

    const updatedOptions: QuestionOption[] = [
      ...currentOptions,
      {
        id: `opt_${Date.now()}`,
        label: `Option ${nextIndex}`,
        value: `option_${nextIndex}`,
      },
    ];

    updateQuestionInActiveForm(questionId, {
      options: updatedOptions,
    });
  };

  /*
   * Update an option.
   */
  const handleUpdateOption = (
    questionId: string,
    currentOptions: QuestionOption[],
    index: number,
    newLabel: string
  ) => {
    const updatedOptions = [...currentOptions];

    updatedOptions[index] = {
      ...updatedOptions[index],
      label: newLabel,
      value:
        newLabel
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9]+/g, '_')
          .replace(/^_|_$/g, '') ||
        `option_${index + 1}`,
    };

    updateQuestionInActiveForm(questionId, {
      options: updatedOptions,
    });
  };

  /*
   * Delete an option.
   */
  const handleDeleteOption = (
    questionId: string,
    currentOptions: QuestionOption[],
    index: number
  ) => {
    const updatedOptions = currentOptions.filter(
      (_, optionIndex) => optionIndex !== index
    );

    updateQuestionInActiveForm(questionId, {
      options: updatedOptions,
    });
  };

  /*
   * Save the active form to backend.
   */
  const handleSave = async (): Promise<boolean> => {
    try {
      setIsSaving(true);
      setSaveMessage('');

      await saveActiveForm();

      setSaveMessage('Saved successfully');

      window.setTimeout(() => {
        setSaveMessage('');
      }, 2500);

      return true;
    } catch (error: any) {
      console.error('Failed to save form:', error);

      const message =
        error?.response?.data?.message ||
        error?.message ||
        'Failed to save form';

      setSaveMessage(message);

      return false;
    } finally {
      setIsSaving(false);
    }
  };

  /*
   * Save before Preview.
   */
  const handlePreview = async () => {
    const saved = await handleSave();

    if (saved) {
      navigate('/preview');
    }
  };

  /*
   * Save before Publish.
   */
  const handlePublish = async () => {
    const saved = await handleSave();

    if (saved) {
      navigate('/publish');
    }
  };

  return (
    <div className="space-y-6">

      {/* =====================================================
          HEADER
      ====================================================== */}

      <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">

          {/* Form information */}
          <div className="flex-1 min-w-0">

            <div className="flex items-center gap-2 mb-2">

              <Sparkles className="w-4 h-4 text-indigo-400" />

              <span className="text-xs text-indigo-400 font-medium">
                Form Builder
              </span>

              <Badge
                variant={
                  activeForm.status === 'published'
                    ? 'emerald'
                    : 'slate'
                }
                className="text-[10px]"
              >
                {activeForm.status}
              </Badge>

            </div>

            {/* Editable title */}
            <input
              type="text"
              value={activeForm.title}
              onChange={(e) =>
                updateFormDetails({
                  title: e.target.value,
                })
              }
              className="w-full max-w-2xl bg-transparent text-xl font-bold text-white border-b border-transparent hover:border-slate-700 focus:border-indigo-500 focus:outline-none py-1"
              placeholder="Form title"
            />

            {/* Editable description */}
            <textarea
              value={activeForm.description || ''}
              onChange={(e) =>
                updateFormDetails({
                  description: e.target.value,
                })
              }
              rows={2}
              className="w-full max-w-2xl mt-1 bg-transparent text-xs text-slate-400 border border-transparent hover:border-slate-800 focus:border-indigo-500 rounded-lg focus:outline-none resize-none p-1"
              placeholder="Add a description for your form..."
            />

          </div>

          {/* Actions */}
          <div className="flex flex-wrap items-center gap-2">

            {saveMessage && (
              <span
                className={`text-xs max-w-[180px] ${
                  saveMessage === 'Saved successfully'
                    ? 'text-emerald-400'
                    : 'text-red-400'
                }`}
              >
                {saveMessage}
              </span>
            )}

            <Button
              variant="secondary"
              size="sm"
              onClick={() => navigate('/my-forms')}
              disabled={isSaving}
            >
              Back
            </Button>

            <Button
              variant="secondary"
              size="sm"
              onClick={handlePreview}
              disabled={isSaving}
            >
              <Eye className="w-4 h-4 mr-1.5" />
              Preview
            </Button>

            <Button
              variant="secondary"
              size="sm"
              onClick={() => void handleSave()}
              disabled={isSaving}
            >
              <Save className="w-4 h-4 mr-1.5" />

              {isSaving
                ? 'Saving...'
                : 'Save Changes'}
            </Button>

            <Button
              size="sm"
              onClick={handlePublish}
              disabled={isSaving}
            >
              <Send className="w-4 h-4 mr-1.5" />
              Publish Form
            </Button>

          </div>
        </div>
      </div>

      {/* =====================================================
          BUILDER
      ====================================================== */}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* ===================================================
            LEFT TOOLBAR
        ==================================================== */}

        <div className="lg:col-span-3 space-y-3">

          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-1">
            Add Elements
          </div>

          <div className="grid grid-cols-1 gap-2">

            {[
              {
                type: 'short_text' as QuestionType,
                label: 'Short Text',
                icon: Type,
              },
              {
                type: 'long_text' as QuestionType,
                label: 'Long Answer',
                icon: AlignLeft,
              },
              {
                type: 'multiple_choice' as QuestionType,
                label: 'Multiple Choice',
                icon: List,
              },
              {
                type: 'checkbox' as QuestionType,
                label: 'Checkboxes',
                icon: CheckSquare,
              },
              {
                type: 'dropdown' as QuestionType,
                label: 'Dropdown Menu',
                icon: ChevronDown,
              },
              {
                type: 'rating' as QuestionType,
                label: 'Star Rating',
                icon: Star,
              },
              {
                type: 'date' as QuestionType,
                label: 'Date Picker',
                icon: Calendar,
              },
              {
                type: 'file_upload' as QuestionType,
                label: 'File Upload',
                icon: Upload,
              },
            ].map((item) => {

              const Icon = item.icon;

              return (
                <button
                  key={item.type}
                  type="button"
                  onClick={() =>
                    handleAddQuestion(item.type)
                  }
                  className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-900 text-slate-300 hover:text-white transition group text-xs font-medium w-full text-left"
                >

                  <div className="w-7 h-7 rounded-lg bg-slate-800 group-hover:bg-indigo-600/20 text-slate-400 group-hover:text-indigo-300 flex items-center justify-center transition">

                    <Icon className="w-4 h-4" />

                  </div>

                  <span>
                    {item.label}
                  </span>

                  <Plus className="w-3.5 h-3.5 ml-auto text-slate-600 group-hover:text-indigo-400" />

                </button>
              );
            })}

          </div>

          <Card className="p-4 border-slate-800">

            <p className="text-xs text-slate-500 leading-relaxed">

              Changes are made locally first.

              <br />

              Click{' '}
              <span className="text-slate-300 font-medium">
                Save Changes
              </span>{' '}
              to persist them in MongoDB.

            </p>

          </Card>

        </div>

        {/* ===================================================
            QUESTIONS
        ==================================================== */}

        <div className="lg:col-span-9 space-y-4">

          {activeForm.questions.length === 0 ? (

            <Card className="p-12 text-center text-slate-500 border-dashed border-slate-800">

              <div className="flex justify-center mb-3">
                <Plus className="w-8 h-8 text-slate-700" />
              </div>

              <p className="text-sm">
                No fields added yet.
              </p>

              <p className="text-xs text-slate-600 mt-1">
                Choose an element from the left toolbar
                to start building your form.
              </p>

            </Card>

          ) : (

            activeForm.questions.map((q, idx) => {

              const isSelected =
                activeQuestionId === q.id;

              return (

                <Card
                  key={q.id}
                  onClick={() =>
                    setActiveQuestionId(q.id)
                  }
                  className={`p-5 transition cursor-pointer relative ${
                    isSelected
                      ? 'border-indigo-500 ring-1 ring-indigo-500/50 bg-slate-900/90'
                      : 'border-slate-800 hover:border-slate-700'
                  }`}
                >

                  <div className="flex items-start gap-3">

                    {/* Drag handle */}
                    <div className="cursor-grab text-slate-600 hover:text-slate-400 pt-1">
                      <GripVertical className="w-5 h-5" />
                    </div>

                    <div className="flex-1 space-y-4 min-w-0">

                      {/* Question title */}
                      <div className="flex flex-col sm:flex-row sm:items-center gap-3">

                        <input
                          type="text"
                          value={q.title}
                          onChange={(e) =>
                            updateQuestionInActiveForm(
                              q.id,
                              {
                                title: e.target.value,
                              }
                            )
                          }
                          onClick={(e) =>
                            e.stopPropagation()
                          }
                          className="bg-transparent text-white font-semibold text-base border-b border-transparent focus:border-indigo-500 focus:outline-none w-full py-1"
                          placeholder="Question Title..."
                        />

                        <label
                          className="flex items-center gap-1.5 text-xs text-slate-400 cursor-pointer shrink-0"
                          onClick={(e) =>
                            e.stopPropagation()
                          }
                        >

                          <input
                            type="checkbox"
                            checked={
                              q.validation?.required ??
                              false
                            }
                            onChange={(e) =>
                              updateQuestionInActiveForm(
                                q.id,
                                {
                                  validation: {
                                    ...q.validation,
                                    required:
                                      e.target.checked,
                                  },
                                }
                              )
                            }
                            className="rounded border-slate-700 bg-slate-900 text-indigo-600 focus:ring-indigo-500"
                          />

                          Required

                        </label>

                      </div>

                      {/* Question description */}
                      <input
                        type="text"
                        value={q.description || ''}
                        onChange={(e) =>
                          updateQuestionInActiveForm(
                            q.id,
                            {
                              description:
                                e.target.value,
                            }
                          )
                        }
                        onClick={(e) =>
                          e.stopPropagation()
                        }
                        className="w-full bg-transparent text-xs text-slate-400 border-b border-transparent focus:border-indigo-500 focus:outline-none py-1"
                        placeholder="Optional question description..."
                      />

                      {/* =================================================
                          SHORT TEXT - NOW TYPEABLE
                      ================================================== */}

                      {q.type === 'short_text' && (
                        <input
                          type="text"
                          value={
                            previewAnswers[q.id] || ''
                          }
                          onChange={(e) =>
                            handlePreviewAnswer(
                              q.id,
                              e.target.value
                            )
                          }
                          onClick={(e) =>
                            e.stopPropagation()
                          }
                          placeholder={
                            q.placeholder ||
                            'Type your answer...'
                          }
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20"
                        />
                      )}

                      {/* =================================================
                          LONG TEXT - NOW TYPEABLE
                      ================================================== */}

                      {q.type === 'long_text' && (
                        <textarea
                          value={
                            previewAnswers[q.id] || ''
                          }
                          onChange={(e) =>
                            handlePreviewAnswer(
                              q.id,
                              e.target.value
                            )
                          }
                          onClick={(e) =>
                            e.stopPropagation()
                          }
                          placeholder={
                            q.placeholder ||
                            'Type your detailed response...'
                          }
                          rows={4}
                          maxLength={
                            q.validation?.maxLength ||
                            undefined
                          }
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 resize-none"
                        />
                      )}

                      {/* =================================================
                          MULTIPLE CHOICE
                          Labels remain editable.
                          Options are also selectable.
                      ================================================== */}

                      {q.type === 'multiple_choice' && (
                        <div className="space-y-2 pt-1">

                          {q.options?.map(
                            (opt, optIdx) => (

                              <div
                                key={
                                  opt.id ||
                                  optIdx
                                }
                                className="flex items-center gap-2"
                              >

                                <input
                                  type="radio"
                                  name={`preview-${q.id}`}
                                  value={opt.value}
                                  checked={
                                    previewAnswers[q.id] ===
                                    opt.value
                                  }
                                  onChange={() =>
                                    handlePreviewAnswer(
                                      q.id,
                                      opt.value
                                    )
                                  }
                                  onClick={(e) =>
                                    e.stopPropagation()
                                  }
                                  className="w-4 h-4 shrink-0 text-indigo-600 border-slate-700 bg-slate-950 focus:ring-indigo-500"
                                />

                                <input
                                  type="text"
                                  value={opt.label}
                                  onChange={(e) =>
                                    handleUpdateOption(
                                      q.id,
                                      q.options || [],
                                      optIdx,
                                      e.target.value
                                    )
                                  }
                                  onClick={(e) =>
                                    e.stopPropagation()
                                  }
                                  className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 flex-1"
                                />

                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();

                                    handleDeleteOption(
                                      q.id,
                                      q.options || [],
                                      optIdx
                                    );
                                  }}
                                  className="text-slate-600 hover:text-red-400 p-1"
                                  aria-label="Delete option"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>

                              </div>
                            )
                          )}

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();

                              handleAddOption(
                                q.id,
                                q.options
                              );
                            }}
                            className="text-xs text-indigo-400 font-semibold hover:underline flex items-center gap-1 pt-1"
                          >
                            <Plus className="w-3 h-3" />
                            Add Option
                          </button>

                        </div>
                      )}

                      {/* =================================================
                          CHECKBOX
                          Labels remain editable.
                      ================================================== */}

                      {q.type === 'checkbox' && (
                        <div className="space-y-2 pt-1">

                          {q.options?.map(
                            (opt, optIdx) => {

                              const selectedValues =
                                Array.isArray(
                                  previewAnswers[q.id]
                                )
                                  ? previewAnswers[q.id]
                                  : [];

                              const checked =
                                selectedValues.includes(
                                  opt.value
                                );

                              return (
                                <div
                                  key={
                                    opt.id ||
                                    optIdx
                                  }
                                  className="flex items-center gap-2"
                                >

                                  <input
                                    type="checkbox"
                                    value={opt.value}
                                    checked={checked}
                                    onChange={(e) => {
                                      const current =
                                        Array.isArray(
                                          previewAnswers[
                                            q.id
                                          ]
                                        )
                                          ? previewAnswers[
                                              q.id
                                            ]
                                          : [];

                                      const updated =
                                        e.target.checked
                                          ? [
                                              ...current,
                                              opt.value,
                                            ]
                                          : current.filter(
                                              (
                                                value: string
                                              ) =>
                                                value !==
                                                opt.value
                                            );

                                      handlePreviewAnswer(
                                        q.id,
                                        updated
                                      );
                                    }}
                                    onClick={(e) =>
                                      e.stopPropagation()
                                    }
                                    className="w-4 h-4 shrink-0 rounded text-indigo-600 border-slate-700 bg-slate-950 focus:ring-indigo-500"
                                  />

                                  <input
                                    type="text"
                                    value={opt.label}
                                    onChange={(e) =>
                                      handleUpdateOption(
                                        q.id,
                                        q.options || [],
                                        optIdx,
                                        e.target.value
                                      )
                                    }
                                    onClick={(e) =>
                                      e.stopPropagation()
                                    }
                                    className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 flex-1"
                                  />

                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();

                                      handleDeleteOption(
                                        q.id,
                                        q.options || [],
                                        optIdx
                                      );
                                    }}
                                    className="text-slate-600 hover:text-red-400 p-1"
                                    aria-label="Delete option"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>

                                </div>
                              );
                            }
                          )}

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();

                              handleAddOption(
                                q.id,
                                q.options
                              );
                            }}
                            className="text-xs text-indigo-400 font-semibold hover:underline flex items-center gap-1 pt-1"
                          >
                            <Plus className="w-3 h-3" />
                            Add Option
                          </button>

                        </div>
                      )}

                      {/* =================================================
                          DROPDOWN
                          Options remain editable + dropdown is usable.
                      ================================================== */}

                      {q.type === 'dropdown' && (
                        <div className="space-y-3 pt-1">

                          <select
                            value={
                              previewAnswers[q.id] ||
                              ''
                            }
                            onChange={(e) =>
                              handlePreviewAnswer(
                                q.id,
                                e.target.value
                              )
                            }
                            onClick={(e) =>
                              e.stopPropagation()
                            }
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-indigo-500"
                          >
                            <option value="">
                              Select an option...
                            </option>

                            {q.options?.map(
                              (opt) => (
                                <option
                                  key={opt.id}
                                  value={opt.value}
                                >
                                  {opt.label}
                                </option>
                              )
                            )}

                          </select>

                          <div className="space-y-2">

                            {q.options?.map(
                              (
                                opt,
                                optIdx
                              ) => (

                                <div
                                  key={
                                    opt.id ||
                                    optIdx
                                  }
                                  className="flex items-center gap-2"
                                >

                                  <div className="w-4 h-4 rounded border border-slate-700 shrink-0 flex items-center justify-center text-[10px] text-slate-500">
                                    ▼
                                  </div>

                                  <input
                                    type="text"
                                    value={
                                      opt.label
                                    }
                                    onChange={(
                                      e
                                    ) =>
                                      handleUpdateOption(
                                        q.id,
                                        q.options ||
                                          [],
                                        optIdx,
                                        e
                                          .target
                                          .value
                                      )
                                    }
                                    onClick={(e) =>
                                      e.stopPropagation()
                                    }
                                    className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 flex-1"
                                  />

                                  <button
                                    type="button"
                                    onClick={(
                                      e
                                    ) => {
                                      e.stopPropagation();

                                      handleDeleteOption(
                                        q.id,
                                        q.options ||
                                          [],
                                        optIdx
                                      );
                                    }}
                                    className="text-slate-600 hover:text-red-400 p-1"
                                    aria-label="Delete option"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>

                                </div>
                              )
                            )}

                          </div>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();

                              handleAddOption(
                                q.id,
                                q.options
                              );
                            }}
                            className="text-xs text-indigo-400 font-semibold hover:underline flex items-center gap-1 pt-1"
                          >
                            <Plus className="w-3 h-3" />
                            Add Option
                          </button>

                        </div>
                      )}

                      {/* =================================================
                          RATING - NOW INTERACTIVE
                      ================================================== */}

                      {q.type === 'rating' && (
                        <div className="flex gap-2 pt-1">

                          {[1, 2, 3, 4, 5].map(
                            (star) => {

                              const selectedRating =
                                Number(
                                  previewAnswers[
                                    q.id
                                  ] || 0
                                );

                              return (
                                <button
                                  key={star}
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();

                                    handlePreviewAnswer(
                                      q.id,
                                      star
                                    );
                                  }}
                                  className="p-1 transition"
                                  aria-label={`Rate ${star} out of 5`}
                                >
                                  <Star
                                    className={`w-6 h-6 ${
                                      selectedRating >=
                                      star
                                        ? 'text-amber-400 fill-amber-400'
                                        : 'text-slate-700 fill-slate-800 hover:text-slate-500'
                                    }`}
                                  />
                                </button>
                              );
                            }
                          )}

                        </div>
                      )}

                      {/* =================================================
                          DATE - NOW INTERACTIVE
                      ================================================== */}

                      {q.type === 'date' && (
                        <div className="relative">

                          <input
                            type="date"
                            value={
                              previewAnswers[q.id] ||
                              ''
                            }
                            onChange={(e) =>
                              handlePreviewAnswer(
                                q.id,
                                e.target.value
                              )
                            }
                            onClick={(e) =>
                              e.stopPropagation()
                            }
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-indigo-500"
                          />

                          <Calendar className="w-4 h-4 text-slate-500 absolute right-3 top-2.5 pointer-events-none" />

                        </div>
                      )}

                      {/* =================================================
                          FILE UPLOAD - NOW INTERACTIVE
                      ================================================== */}

                      {q.type === 'file_upload' && (
                        <div
                          className="p-4 border border-dashed border-slate-800 rounded-xl text-center bg-slate-950/40"
                          onClick={(e) =>
                            e.stopPropagation()
                          }
                        >

                          <Upload className="w-5 h-5 text-slate-500 mx-auto mb-2" />

                          <label className="cursor-pointer">

                            <span className="text-xs text-indigo-400 hover:text-indigo-300">
                              Choose a file
                            </span>

                            <input
                              type="file"
                              className="hidden"
                              onChange={(e) => {
                                const file =
                                  e.target
                                    .files?.[0];

                                if (file) {
                                  handlePreviewAnswer(
                                    q.id,
                                    file
                                  );
                                }
                              }}
                            />

                          </label>

                          {previewAnswers[q.id] && (
                            <p className="text-[11px] text-slate-500 mt-2">
                              {previewAnswers[q.id].name}
                            </p>
                          )}

                        </div>
                      )}

                      {/* =================================================
                          Metadata
                      ================================================== */}

                      <div className="flex items-center gap-2 text-[10px] text-slate-600">

                        <span>
                          Type:{' '}
                          {q.type.replace(
                            '_',
                            ' '
                          )}
                        </span>

                        <span>•</span>

                        <span>
                          Field {idx + 1}
                        </span>

                      </div>

                    </div>

                    {/* =================================================
                        QUESTION CONTROLS
                    ================================================== */}

                    <div className="flex items-center gap-1 pl-2 shrink-0">

                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={(e) => {
                          e.stopPropagation();

                          reorderQuestionsInActiveForm(
                            idx,
                            idx - 1
                          );
                        }}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-white disabled:opacity-30"
                        aria-label="Move question up"
                      >
                        <ChevronUp className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        disabled={
                          idx ===
                          activeForm.questions
                            .length -
                            1
                        }
                        onClick={(e) => {
                          e.stopPropagation();

                          reorderQuestionsInActiveForm(
                            idx,
                            idx + 1
                          );
                        }}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-white disabled:opacity-30"
                        aria-label="Move question down"
                      >
                        <ChevronDown className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();

                          deleteQuestionFromActiveForm(
                            q.id
                          );

                          if (
                            activeQuestionId ===
                            q.id
                          ) {
                            setActiveQuestionId(
                              null
                            );
                          }

                          /*
                           * Remove its temporary preview
                           * answer as well.
                           */
                          setPreviewAnswers(
                            (previous) => {
                              const updated = {
                                ...previous,
                              };

                              delete updated[
                                q.id
                              ];

                              return updated;
                            }
                          );
                        }}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-red-400"
                        aria-label="Delete question"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                    </div>

                  </div>

                </Card>
              );
            })
          )}

        </div>
      </div>
    </div>
  );
};

export default FormBuilderPage;
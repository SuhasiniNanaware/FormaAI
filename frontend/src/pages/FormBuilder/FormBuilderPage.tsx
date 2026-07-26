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
  GripVertical
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { useFormContext } from '../../context/FormContext';
import type { Question, QuestionType, QuestionOption } from '../../types/form';

export const FormBuilderPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    activeForm,
    addQuestionToActiveForm,
    updateQuestionInActiveForm,
    deleteQuestionFromActiveForm,
    reorderQuestionsInActiveForm
  } = useFormContext();

  const [activeQuestionId, setActiveQuestionId] = useState<string | null>(null);

  if (!activeForm) {
    return (
      <div className="text-center py-20 space-y-4">
        <h2 className="text-xl font-bold text-white">No active form selected</h2>
        <Button onClick={() => navigate('/create-form')}>Create New Form</Button>
      </div>
    );
  }

  // Add new question according to your exact Question schema
  const handleAddQuestion = (type: QuestionType) => {
    const isChoice = type === 'multiple_choice' || type === 'dropdown' || type === 'checkbox';
    
    const newQuestion: Question = {
      id: `q_${Date.now()}`,
      type,
      title: `New ${type.replace('_', ' ')} Question`,
      placeholder: 'Enter response...',
      validation: {
        required: false,
      },
      options: isChoice
        ? [
            { id: `opt_1_${Date.now()}`, label: 'Option 1', value: 'option_1' },
            { id: `opt_2_${Date.now()}`, label: 'Option 2', value: 'option_2' }
          ]
        : undefined,
      order: activeForm.questions.length + 1,
    };

    addQuestionToActiveForm(newQuestion);
    setActiveQuestionId(newQuestion.id);
  };

  // Choice option handlers matching QuestionOption interface
  const handleAddOption = (questionId: string, currentOptions: QuestionOption[] = []) => {
    const nextIdx = currentOptions.length + 1;
    const updatedOptions: QuestionOption[] = [
      ...currentOptions,
      {
        id: `opt_${Date.now()}`,
        label: `Option ${nextIdx}`,
        value: `option_${nextIdx}`
      }
    ];
    updateQuestionInActiveForm(questionId, { options: updatedOptions });
  };

  const handleUpdateOption = (questionId: string, currentOptions: QuestionOption[], index: number, newLabel: string) => {
    const updated = [...currentOptions];
    updated[index] = {
      ...updated[index],
      label: newLabel,
      value: newLabel.toLowerCase().replace(/\s+/g, '_')
    };
    updateQuestionInActiveForm(questionId, { options: updated });
  };

  const handleDeleteOption = (questionId: string, currentOptions: QuestionOption[], index: number) => {
    const updated = currentOptions.filter((_, i) => i !== index);
    updateQuestionInActiveForm(questionId, { options: updated });
  };

  return (
    <div className="space-y-6">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white">{activeForm.title}</h1>
            <Badge variant="indigo" className="text-[10px]">
              <Sparkles className="w-3 h-3 mr-1" /> AI Generated
            </Badge>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">{activeForm.description}</p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" onClick={() => navigate('/preview')}>
            <Eye className="w-4 h-4 mr-1.5" /> Preview
          </Button>
          <Button size="sm" onClick={() => navigate('/publish')}>
            <Send className="w-4 h-4 mr-1.5" /> Publish Form
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Toolbar: Add Field Buttons */}
        <div className="lg:col-span-3 space-y-3">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-1">Add Elements</div>
          <div className="grid grid-cols-1 gap-2">
            {[
              { type: 'short_text' as QuestionType, label: 'Short Text', icon: Type },
              { type: 'long_text' as QuestionType, label: 'Long Answer', icon: AlignLeft },
              { type: 'multiple_choice' as QuestionType, label: 'Multiple Choice', icon: List },
              { type: 'checkbox' as QuestionType, label: 'Checkboxes', icon: CheckSquare },
              { type: 'dropdown' as QuestionType, label: 'Dropdown Menu', icon: ChevronDown },
              { type: 'rating' as QuestionType, label: 'Star Rating', icon: Star },
              { type: 'date' as QuestionType, label: 'Date Picker', icon: Calendar },
              { type: 'file_upload' as QuestionType, label: 'File Upload', icon: Upload },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.type}
                  onClick={() => handleAddQuestion(item.type)}
                  className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-900 text-slate-300 hover:text-white transition group text-xs font-medium w-full text-left"
                >
                  <div className="w-7 h-7 rounded-lg bg-slate-800 group-hover:bg-indigo-600/20 text-slate-400 group-hover:text-indigo-300 flex items-center justify-center transition">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span>{item.label}</span>
                  <Plus className="w-3.5 h-3.5 ml-auto text-slate-600 group-hover:text-indigo-400" />
                </button>
              );
            })}
          </div>
        </div>

        {/* Center Canvas: Question List */}
        <div className="lg:col-span-9 space-y-4">
          {activeForm.questions.length === 0 ? (
            <Card className="p-12 text-center text-slate-500 border-dashed border-slate-800">
              <p>No fields added yet. Choose an element from the left toolbar to start.</p>
            </Card>
          ) : (
            activeForm.questions.map((q, idx) => {
              const isSelected = activeQuestionId === q.id;

              return (
                <Card
                  key={q.id}
                  onClick={() => setActiveQuestionId(q.id)}
                  className={`p-5 transition cursor-pointer relative ${
                    isSelected ? 'border-indigo-500 ring-1 ring-indigo-500/50 bg-slate-900/90' : 'border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="cursor-grab text-slate-600 hover:text-slate-400 pt-1">
                      <GripVertical className="w-5 h-5" />
                    </div>

                    <div className="flex-1 space-y-3">
                      {/* Title & Required Edit */}
                      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                        <input
                          type="text"
                          value={q.title}
                          onChange={(e) => updateQuestionInActiveForm(q.id, { title: e.target.value })}
                          className="bg-transparent text-white font-semibold text-base border-b border-transparent focus:border-indigo-500 focus:outline-none w-full py-1"
                          placeholder="Question Title..."
                        />
                        <div className="flex items-center gap-2 shrink-0">
                          <label className="flex items-center gap-1.5 text-xs text-slate-400 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={q.validation?.required ?? false}
                              onChange={(e) =>
                                updateQuestionInActiveForm(q.id, {
                                  validation: { ...q.validation, required: e.target.checked }
                                })
                              }
                              className="rounded border-slate-700 bg-slate-900 text-indigo-600 focus:ring-indigo-500"
                            />
                            Required
                          </label>
                        </div>
                      </div>

                      {/* Question Content Renderers */}
                      {q.type === 'short_text' && (
                        <input
                          disabled
                          placeholder={q.placeholder || 'Short answer response...'}
                          className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-2 text-xs text-slate-500 cursor-not-allowed"
                        />
                      )}

                      {q.type === 'long_text' && (
                        <textarea
                          disabled
                          placeholder={q.placeholder || 'Long answer response...'}
                          rows={2}
                          className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-2 text-xs text-slate-500 cursor-not-allowed resize-none"
                        />
                      )}

                      {(q.type === 'multiple_choice' || q.type === 'checkbox' || q.type === 'dropdown') && (
                        <div className="space-y-2 pt-1">
                          {q.options?.map((opt, optIdx) => (
                            <div key={opt.id || optIdx} className="flex items-center gap-2">
                              <div className="w-4 h-4 rounded border border-slate-700 shrink-0 flex items-center justify-center text-[10px] text-slate-500">
                                {q.type === 'multiple_choice' ? '○' : q.type === 'checkbox' ? '□' : '▼'}
                              </div>
                              <input
                                type="text"
                                value={opt.label}
                                onChange={(e) => handleUpdateOption(q.id, q.options || [], optIdx, e.target.value)}
                                className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 flex-1"
                              />
                              <button
                                type="button"
                                onClick={() => handleDeleteOption(q.id, q.options || [], optIdx)}
                                className="text-slate-600 hover:text-red-400 p-1"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                          <button
                            type="button"
                            onClick={() => handleAddOption(q.id, q.options)}
                            className="text-xs text-indigo-400 font-semibold hover:underline flex items-center gap-1 pt-1"
                          >
                            <Plus className="w-3 h-3" /> Add Option
                          </button>
                        </div>
                      )}

                      {q.type === 'rating' && (
                        <div className="flex gap-2 text-slate-600 pt-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star key={star} className="w-5 h-5 fill-slate-800 text-slate-700" />
                          ))}
                        </div>
                      )}

                      {q.type === 'date' && (
                        <div className="p-2.5 bg-slate-950/60 border border-slate-800 rounded-xl text-xs text-slate-500 flex items-center gap-2">
                          <Calendar className="w-4 h-4" /> Pick a date
                        </div>
                      )}

                      {q.type === 'file_upload' && (
                        <div className="p-4 border border-dashed border-slate-800 rounded-xl text-center text-xs text-slate-500">
                          User file upload area
                        </div>
                      )}
                    </div>

                    {/* Question Controls */}
                    <div className="flex items-center gap-1 pl-2">
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => reorderQuestionsInActiveForm(idx, idx - 1)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-white disabled:opacity-30"
                      >
                        <ChevronUp className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        disabled={idx === activeForm.questions.length - 1}
                        onClick={() => reorderQuestionsInActiveForm(idx, idx + 1)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-white disabled:opacity-30"
                      >
                        <ChevronDown className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteQuestionFromActiveForm(q.id)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-red-400"
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
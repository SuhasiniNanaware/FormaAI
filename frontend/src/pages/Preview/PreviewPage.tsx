import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, Calendar, Upload, Send, CheckCircle2 } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { useFormContext } from '../../context/FormContext';

export const PreviewPage: React.FC = () => {
  const navigate = useNavigate();
  const { activeForm } = useFormContext();
  const [submitted, setSubmitted] = useState(false);
  const [answers, setAnswers] = useState<Record<string, any>>({});

  if (!activeForm) {
    return (
      <div className="text-center py-20 space-y-4">
        <h2 className="text-xl font-bold text-white">No active form selected</h2>
        <Button onClick={() => navigate('/dashboard')}>Back to Dashboard</Button>
      </div>
    );
  }

  const handleInputChange = (questionId: string, value: any) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 py-4">
      {/* Top Controls */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={() => navigate('/form-builder')}>
          <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to Builder
        </Button>
        <span className="text-xs text-slate-500 bg-slate-900 px-3 py-1 rounded-full border border-slate-800">
          Interactive Preview Mode
        </span>
      </div>

      {submitted ? (
        <Card className="p-12 text-center space-y-4 border-emerald-500/30">
          <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-white">Response Submitted!</h2>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            {activeForm.settings?.customSuccessMessage || 'Thank you for taking the time to complete this form.'}
          </p>
          <Button variant="secondary" size="sm" onClick={() => setSubmitted(false)}>
            Submit Another Response
          </Button>
        </Card>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Form Header */}
          <Card className="p-6 border-slate-800 space-y-2">
            <h1 className="text-2xl font-bold text-white">{activeForm.title}</h1>
            {activeForm.description && (
              <p className="text-xs text-slate-400">{activeForm.description}</p>
            )}
          </Card>

          {/* Form Questions */}
          {activeForm.questions.map((q, idx) => (
            <Card key={q.id} className="p-6 border-slate-800 space-y-3">
              <label className="block text-sm font-medium text-white">
                {idx + 1}. {q.title}
                {q.validation?.required && <span className="text-red-400 ml-1">*</span>}
              </label>

              {q.type === 'short_text' && (
                <input
                  type="text"
                  required={q.validation?.required}
                  placeholder={q.placeholder || 'Your answer'}
                  onChange={(e) => handleInputChange(q.id, e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              )}

              {q.type === 'long_text' && (
                <textarea
                  rows={3}
                  required={q.validation?.required}
                  placeholder={q.placeholder || 'Your response'}
                  onChange={(e) => handleInputChange(q.id, e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs text-white focus:outline-none focus:border-indigo-500 resize-none"
                />
              )}

              {(q.type === 'multiple_choice' || q.type === 'checkbox') && (
                <div className="space-y-2 pt-1">
                  {q.options?.map((opt) => (
                    <label key={opt.id} className="flex items-center gap-2.5 text-xs text-slate-300 cursor-pointer">
                      <input
                        type={q.type === 'multiple_choice' ? 'radio' : 'checkbox'}
                        name={q.id}
                        value={opt.value}
                        onChange={(e) => handleInputChange(q.id, e.target.value)}
                        className="rounded border-slate-700 bg-slate-950 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span>{opt.label}</span>
                    </label>
                  ))}
                </div>
              )}

              {q.type === 'dropdown' && (
                <select
                  required={q.validation?.required}
                  onChange={(e) => handleInputChange(q.id, e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="">Select an option...</option>
                  {q.options?.map((opt) => (
                    <option key={opt.id} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              )}

              {q.type === 'rating' && (
                <div className="flex gap-2 pt-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => handleInputChange(q.id, star)}
                      className={`p-1 transition ${
                        answers[q.id] >= star ? 'text-amber-400' : 'text-slate-700 hover:text-slate-500'
                      }`}
                    >
                      <Star className="w-6 h-6 fill-current" />
                    </button>
                  ))}
                </div>
              )}

              {q.type === 'date' && (
                <div className="relative">
                  <input
                    type="date"
                    required={q.validation?.required}
                    onChange={(e) => handleInputChange(q.id, e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                  <Calendar className="w-4 h-4 text-slate-500 absolute right-3 top-2.5 pointer-events-none" />
                </div>
              )}

              {q.type === 'file_upload' && (
                <div className="border border-dashed border-slate-800 rounded-xl p-6 text-center space-y-2 bg-slate-950/40">
                  <Upload className="w-5 h-5 text-slate-500 mx-auto" />
                  <p className="text-xs text-slate-400">Click to upload or drag files here</p>
                </div>
              )}
            </Card>
          ))}

          <Button type="submit" className="w-full">
            <Send className="w-4 h-4 mr-1.5" /> Submit Response
          </Button>
        </form>
      )}
    </div>
  );
};

export default PreviewPage;
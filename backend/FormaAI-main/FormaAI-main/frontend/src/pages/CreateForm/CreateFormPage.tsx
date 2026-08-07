import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, Lightbulb } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { useFormContext } from '../../context/FormContext';

export const CreateFormPage: React.FC = () => {
  const navigate = useNavigate();
  const { setAiPrompt } = useFormContext();
  const [promptInput, setPromptInput] = useState('');

  const samplePrompts = [
    'Create a customer satisfaction survey with star ratings and feedback text.',
    'Build a event registration form collecting name, email, dietary preferences, and date.',
    'Design a job application form with short text inputs, resume file upload, and checkbox skills.'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promptInput.trim()) return;
    setAiPrompt(promptInput);
    navigate('/ai-processing');
  };

  const handleSelectSample = (prompt: string) => {
    setPromptInput(prompt);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 py-6">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-medium">
          <Sparkles className="w-3.5 h-3.5" /> AI Form Builder
        </div>
        <h1 className="text-3xl font-bold text-white tracking-tight">What kind of form do you want to create?</h1>
        <p className="text-sm text-slate-400 max-w-lg mx-auto">
          Describe your form requirements in plain English, and our AI will generate fields, validation logic, and structure automatically.
        </p>
      </div>

      <Card glow className="p-6 border-indigo-500/30">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <textarea
              rows={4}
              value={promptInput}
              onChange={(e) => setPromptInput(e.target.value)}
              placeholder="e.g., Generate a product feedback form asking users for their experience rating, favorite features, and bug reports..."
              className="w-full bg-slate-950/80 border border-slate-800 rounded-xl p-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-none"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-slate-500">
              {promptInput.length} characters
            </span>
            <Button type="submit" disabled={!promptInput.trim()}>
              Generate with AI <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </div>
        </form>
      </Card>

      {/* Example Suggestions */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
          <Lightbulb className="w-4 h-4 text-amber-400" />
          <span>Or try one of these ideas</span>
        </div>

        <div className="grid grid-cols-1 gap-2">
          {samplePrompts.map((sample, idx) => (
            <button
              key={idx}
              onClick={() => handleSelectSample(sample)}
              className="p-3 text-left bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 hover:bg-slate-900 rounded-xl text-xs text-slate-300 hover:text-white transition group flex items-center justify-between"
            >
              <span>{sample}</span>
              <Sparkles className="w-3.5 h-3.5 text-slate-600 group-hover:text-indigo-400 shrink-0 ml-2" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CreateFormPage;
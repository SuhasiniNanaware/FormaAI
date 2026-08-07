import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Bot, Send } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { useFormContext } from '../../context/FormContext';

export const AIIntroPage: React.FC = () => {
  const navigate = useNavigate();
  const { setAiPrompt } = useFormContext();
  const [input, setInput] = useState('');

  const samplePrompts = [
    "I need a Student Registration Form for Engineering Batch 2026.",
    "Generate an Employee Satisfaction Survey with 5 rating questions.",
    "Create a Hospital Patient Intake Form with symptom description.",
    "Build an Event Registration Form with ticket types and dates."
  ];

  const handleStart = (promptText: string) => {
    if (!promptText.trim()) return;
    setAiPrompt(promptText);
    navigate('/ai-processing');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between p-6">
      <header className="max-w-5xl mx-auto w-full flex items-center justify-between py-4">
        <button onClick={() => navigate('/')} className="flex items-center gap-2 font-bold text-lg">
          <Sparkles className="w-5 h-5 text-indigo-400" />
          <span>Forma AI</span>
        </button>
        <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')}>
          Skip to Dashboard
        </Button>
      </header>

      <div className="max-w-3xl mx-auto w-full space-y-6 my-auto">
        <div className="text-center space-y-2">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">What form do you want to create?</h1>
          <p className="text-slate-400 text-sm">Forma AI will construct questions, validation rules, and layout automatically.</p>
        </div>

        {/* Prompt Input Area */}
        <Card glow className="p-4 border-indigo-500/40">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center shrink-0 text-indigo-300">
              <Bot className="w-5 h-5" />
            </div>
            <textarea
              rows={3}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="e.g. Create a Feedback Form for a software workshop..."
              className="w-full bg-transparent text-white placeholder-slate-500 text-sm focus:outline-none resize-none pt-2"
            />
          </div>
          <div className="flex justify-between items-center mt-3 pt-3 border-t border-slate-800">
            <span className="text-[11px] text-slate-500">Press Enter or click Generate</span>
            <Button size="sm" onClick={() => handleStart(input)} disabled={!input.trim()}>
              Generate <Send className="w-3.5 h-3.5 ml-1" />
            </Button>
          </div>
        </Card>

        {/* Suggested Prompts */}
        <div className="space-y-2">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Try one of these suggestions:</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {samplePrompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleStart(p)}
                className="text-left p-3 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-indigo-500/40 hover:bg-slate-900 text-xs text-slate-300 transition"
              >
                "{p}"
              </button>
            ))}
          </div>
        </div>
      </div>

      <footer className="text-center text-xs text-slate-600 py-4">
        Powered by Forma AI Generative Engine
      </footer>
    </div>
  );
};

export default AIIntroPage;
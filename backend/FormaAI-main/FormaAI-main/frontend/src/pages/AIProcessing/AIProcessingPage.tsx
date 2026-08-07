import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, CheckCircle2, Loader2 } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { useFormContext } from '../../context/FormContext';

export const AIProcessingPage: React.FC = () => {
  const navigate = useNavigate();
  const { aiPrompt, createFromPrompt } = useFormContext();
  const [step, setStep] = useState(0);

  const steps = [
    'Analyzing prompt semantics & domain intent...',
    'Generating structured field architecture...',
    'Configuring validation schemas & input rules...',
    'Rendering live interactive UI components...'
  ];

  useEffect(() => {
    const defaultPrompt = aiPrompt || 'Generate a standard Customer Feedback & Support Form';

    const timer1 = setTimeout(() => setStep(1), 800);
    const timer2 = setTimeout(() => setStep(2), 1600);
    const timer3 = setTimeout(() => setStep(3), 2400);

    const finishTimer = setTimeout(async () => {
      await createFromPrompt(defaultPrompt);
      navigate('/form-builder');
    }, 3200);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(finishTimer);
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute w-96 h-96 bg-indigo-600/15 rounded-full blur-[140px] pointer-events-none" />

      <Card glow className="max-w-lg w-full p-8 border-indigo-500/40 text-center space-y-6">
        <div className="relative inline-flex items-center justify-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-xl shadow-indigo-500/30 animate-pulse">
            <Sparkles className="w-8 h-8" />
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold text-white">Generating Form Structure</h2>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto italic">
            "{aiPrompt || 'Generate a standard Customer Feedback & Support Form'}"
          </p>
        </div>

        {/* Step Progress Checklist */}
        <div className="space-y-3 text-left bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
          {steps.map((text, idx) => (
            <div key={idx} className="flex items-center gap-3 text-xs">
              {idx < step ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : idx === step ? (
                <Loader2 className="w-4 h-4 text-indigo-400 animate-spin shrink-0" />
              ) : (
                <div className="w-4 h-4 rounded-full border border-slate-700 shrink-0" />
              )}
              <span className={idx <= step ? 'text-slate-200 font-medium' : 'text-slate-600'}>
                {text}
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default AIProcessingPage;
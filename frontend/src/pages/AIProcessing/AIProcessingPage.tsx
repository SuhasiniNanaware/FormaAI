import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { useFormContext } from '../../context/FormContext';

export const AIProcessingPage: React.FC = () => {
  const navigate = useNavigate();
  const { aiPrompt, createFromPrompt } = useFormContext();

  const [step, setStep] = useState(0);
  const [error, setError] = useState('');

  const steps = [
    'Analyzing prompt semantics & domain intent...',
    'Generating structured field architecture...',
    'Configuring validation schemas & input rules...',
    'Rendering live interactive UI components...',
  ];

  useEffect(() => {
    let mounted = true;

    const generateForm = async () => {
      const defaultPrompt =
        aiPrompt || 'Generate a standard Customer Feedback & Support Form';

      try {
        // Start the real backend AI generation immediately.
        setStep(0);

        const step1Timer = setTimeout(() => {
          if (mounted) setStep(1);
        }, 700);

        const step2Timer = setTimeout(() => {
          if (mounted) setStep(2);
        }, 1400);

        const step3Timer = setTimeout(() => {
          if (mounted) setStep(3);
        }, 2100);

        // REAL AI BACKEND REQUEST
        await createFromPrompt(defaultPrompt);

        clearTimeout(step1Timer);
        clearTimeout(step2Timer);
        clearTimeout(step3Timer);

        if (!mounted) return;

        // Show completed state briefly before opening builder.
        setStep(4);

        setTimeout(() => {
          if (mounted) {
            navigate('/form-builder');
          }
        }, 500);
      } catch (err: any) {
        console.error('AI form generation failed:', err);

        if (!mounted) return;

        setError(
          err?.response?.data?.message ||
            err?.message ||
            'Failed to generate the form. Please try again.'
        );
      }
    };

    generateForm();

    return () => {
      mounted = false;
    };
  }, [createFromPrompt, navigate, aiPrompt]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute w-96 h-96 bg-indigo-600/15 rounded-full blur-[140px] pointer-events-none" />

      <Card
        glow
        className="max-w-lg w-full p-8 border-indigo-500/40 text-center space-y-6"
      >
        <div className="relative inline-flex items-center justify-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-xl shadow-indigo-500/30 animate-pulse">
            <Sparkles className="w-8 h-8" />
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold text-white">
            {error ? 'Generation Failed' : 'Generating Form Structure'}
          </h2>

          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto italic">
            "
            {aiPrompt ||
              'Generate a standard Customer Feedback & Support Form'}
            "
          </p>
        </div>

        {error ? (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-left">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />

              <div>
                <p className="text-sm font-medium text-red-300">
                  Unable to generate form
                </p>

                <p className="text-xs text-red-400/80 mt-1">
                  {error}
                </p>
              </div>
            </div>

            <button
              onClick={() => navigate('/generate')}
              className="mt-4 text-xs text-indigo-400 hover:text-indigo-300"
            >
              ← Try again
            </button>
          </div>
        ) : (
          <div className="space-y-3 text-left bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
            {steps.map((text, idx) => {
              const completed = idx < step;
              const current = idx === step;

              return (
                <div
                  key={idx}
                  className="flex items-center gap-3 text-xs"
                >
                  {completed || step === 4 ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : current ? (
                    <Loader2 className="w-4 h-4 text-indigo-400 animate-spin shrink-0" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-slate-700 shrink-0" />
                  )}

                  <span
                    className={
                      completed || current || step === 4
                        ? 'text-slate-200 font-medium'
                        : 'text-slate-600'
                    }
                  >
                    {text}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {!error && (
          <p className="text-[11px] text-slate-500">
            Forma AI is creating your form using the AI generation engine...
          </p>
        )}
      </Card>
    </div>
  );
};

export default AIProcessingPage;
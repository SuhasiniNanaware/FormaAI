import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  CheckCircle2,
  Loader2,
  AlertCircle,
  ArrowLeft,
} from 'lucide-react';

import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { useFormContext } from '../../context/FormContext';


const steps = [
  'Analyzing prompt semantics & domain intent...',
  'Generating structured field architecture...',
  'Configuring validation schemas & input rules...',
  'Rendering live interactive UI components...',
];

type ProcessingStatus = 'processing' | 'success' | 'error';

export const AIProcessingPage: React.FC = () => {
  const navigate = useNavigate();

  const {
    aiPrompt,
    createFromPrompt,
  } = useFormContext();

  const [currentStep, setCurrentStep] = useState(0);

  const [status, setStatus] =
    useState<ProcessingStatus>('processing');

  const [errorMessage, setErrorMessage] = useState('');

  /*
   * ------------------------------------------------------------
   * DUPLICATE REQUEST PROTECTION
   * ------------------------------------------------------------
   *
   * React development mode / StrictMode can run effects more
   * than once.
   *
   * Without this guard, one prompt could potentially create:
   *
   * POST /api/forms/generate
   * POST /api/forms/generate
   *
   * and eventually trigger the 429 rate limiter.
   */
  const generationStartedRef = useRef(false);

  /*
   * ------------------------------------------------------------
   * FUNCTION REF
   * ------------------------------------------------------------
   *
   * FormContext may recreate createFromPrompt when the provider
   * renders.
   *
   * Keeping the latest function inside a ref allows this page's
   * generation effect to remain stable and prevents unnecessary
   * re-generation.
   */
  const createFromPromptRef = useRef(createFromPrompt);

  useEffect(() => {
    createFromPromptRef.current = createFromPrompt;
  }, [createFromPrompt]);

  /*
   * Timer used for the visual progress steps.
   */
  const stepTimerRef = useRef<number | null>(null);

  /*
   * Timer used before navigating to Form Builder after success.
   */
  const navigationTimerRef = useRef<number | null>(null);

  /*
   * ------------------------------------------------------------
   * CLEANUP HELPERS
   * ------------------------------------------------------------
   */

  const clearStepTimer = () => {
    if (stepTimerRef.current !== null) {
      window.clearInterval(stepTimerRef.current);
      stepTimerRef.current = null;
    }
  };

  const clearNavigationTimer = () => {
    if (navigationTimerRef.current !== null) {
      window.clearTimeout(navigationTimerRef.current);
      navigationTimerRef.current = null;
    }
  };

  /*
   * ------------------------------------------------------------
   * REAL AI GENERATION
   * ------------------------------------------------------------
   */
  useEffect(() => {
    /*
     * No prompt means there is nothing to send to Gemini.
     */
    if (!aiPrompt.trim()) {
      navigate('/create-form', {
        replace: true,
      });

      return;
    }

    /*
     * ----------------------------------------------------------
     * PREVENT DUPLICATE GEMINI REQUESTS
     * ----------------------------------------------------------
     */
    if (generationStartedRef.current) {
      return;
    }

    generationStartedRef.current = true;

    /*
     * Start fresh.
     */
    setStatus('processing');
    setCurrentStep(0);
    setErrorMessage('');

    /*
     * ----------------------------------------------------------
     * VISUAL PROGRESS
     * ----------------------------------------------------------
     *
     * This animation runs while the REAL Gemini request is
     * running.
     *
     * It does NOT fake the result.
     */
    stepTimerRef.current = window.setInterval(() => {
      setCurrentStep((previousStep) => {
        /*
         * Once we reach the final step, remain there until
         * Gemini actually responds.
         */
        if (previousStep >= steps.length - 1) {
          return previousStep;
        }

        return previousStep + 1;
      });
    }, 1600);

    /*
     * ----------------------------------------------------------
     * REAL REQUEST
     * ----------------------------------------------------------
     *
     * This is the important part.
     *
     * The request ultimately goes to:
     *
     * POST /api/forms/generate
     *
     * and your backend calls Gemini.
     */
    const generateForm = async () => {
      try {
        console.log(
          '[AI Processing] Starting real AI generation...'
        );

        console.log(
          '[AI Processing] Prompt:',
          aiPrompt
        );

        /*
         * Call the real FormContext function.
         */
        const generatedForm =
          await createFromPromptRef.current(aiPrompt);

        /*
         * At this point:
         *
         * Gemini responded
         *        ↓
         * Backend normalized response
         *        ↓
         * Form saved
         *        ↓
         * FormContext received newForm
         *        ↓
         * activeForm updated
         *
         * Therefore it is safe to open Form Builder.
         */
        console.log(
          '[AI Processing] Real form generated successfully:',
          generatedForm
        );

        /*
         * Stop visual progress.
         */
        clearStepTimer();

        /*
         * Mark ALL visual stages complete.
         */
        setCurrentStep(steps.length);

        /*
         * Show success state.
         */
        setStatus('success');

        /*
         * ------------------------------------------------------
         * OPEN FORM BUILDER
         * ------------------------------------------------------
         *
         * We wait a short moment so the user can actually see
         * "Form Generated Successfully".
         */
        navigationTimerRef.current =
          window.setTimeout(() => {
            console.log(
              '[AI Processing] Opening Form Builder...'
            );

            navigate('/form-builder', {
              replace: true,
            });
          }, 900);
      } catch (error: unknown) {
        /*
         * Stop visual progress.
         */
        clearStepTimer();

        console.error(
          '[AI Processing] Real AI generation failed:',
          error
        );

        setStatus('error');

        /*
         * ------------------------------------------------------
         * EXTRACT BACKEND ERROR
         * ------------------------------------------------------
         *
         * Axios errors generally look like:
         *
         * error.response.data.message
         *
         * We safely inspect the unknown error.
         */
        let message =
          'Unable to generate the form. Please try again.';

        if (
          typeof error === 'object' &&
          error !== null
        ) {
          const errorObject =
            error as {
              message?: string;
              response?: {
                data?: {
                  message?: string;
                  error?: string;
                };
              };
            };

          message =
            errorObject.response?.data?.message ||
            errorObject.response?.data?.error ||
            errorObject.message ||
            message;
        }

        setErrorMessage(message);
      }
    };

    /*
     * Start the real request.
     */
    generateForm();

    /*
     * ----------------------------------------------------------
     * CLEANUP
     * ----------------------------------------------------------
     *
     * IMPORTANT:
     *
     * We clean up timers.
     *
     * We DO NOT cancel the Gemini request.
     *
     * Gemini may take 10-30 seconds depending on the API.
     * We want the real request to finish.
     */
    return () => {
      clearStepTimer();
      clearNavigationTimer();
    };
  }, [aiPrompt, navigate]);

  /*
   * ------------------------------------------------------------
   * ERROR SCREEN
   * ------------------------------------------------------------
   */
  if (status === 'error') {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <Card className="w-full max-w-xl p-8 text-center border-red-500/30 bg-slate-900/80">

          {/* Error Icon */}
          <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-red-400" />
          </div>

          {/* Heading */}
          <h1 className="text-2xl font-bold text-white mb-2">
            Generation Failed
          </h1>

          {/* Error */}
          <p className="text-sm text-slate-400 mb-6 max-w-md mx-auto">
            {errorMessage}
          </p>

          {/* Buttons */}
          <div className="flex justify-center gap-3">

            <Button
              variant="secondary"
              onClick={() => {
                clearStepTimer();
                clearNavigationTimer();

                navigate('/create-form', {
                  replace: true,
                });
              }}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Change Prompt
            </Button>

            <Button
              onClick={() => {
                clearStepTimer();
                clearNavigationTimer();

                /*
                 * Go back to Create Form.
                 *
                 * When AIProcessingPage mounts again,
                 * generationStartedRef starts as false,
                 * allowing another real Gemini request.
                 */
                navigate('/create-form', {
                  replace: true,
                });
              }}
            >
              Try Again
            </Button>

          </div>
        </Card>
      </div>
    );
  }

  /*
   * ------------------------------------------------------------
   * PROCESSING / SUCCESS UI
   * ------------------------------------------------------------
   */
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">

      <Card className="w-full max-w-xl p-8 text-center border-indigo-500/20 bg-slate-900/80">

        {/* ----------------------------------------------------
            AI ICON
        ----------------------------------------------------- */}
        <div
          className={`
            w-16
            h-16
            mx-auto
            mb-5
            rounded-2xl
            flex
            items-center
            justify-center
            shadow-lg
            transition-all
            duration-300
            ${
              status === 'success'
                ? 'bg-emerald-600 shadow-emerald-500/20'
                : 'bg-indigo-600 shadow-indigo-500/20'
            }
          `}
        >
          {status === 'success' ? (
            <CheckCircle2 className="w-8 h-8 text-white" />
          ) : (
            <Sparkles className="w-8 h-8 text-white" />
          )}
        </div>

        {/* ----------------------------------------------------
            HEADING
        ----------------------------------------------------- */}
        <h1 className="text-2xl font-bold text-white mb-2">
          {status === 'success'
            ? 'Form Generated Successfully'
            : 'Generating Form Structure'}
        </h1>

        {/* ----------------------------------------------------
            USER PROMPT
        ----------------------------------------------------- */}
        <p className="text-sm text-slate-400 italic mb-7 max-w-lg mx-auto">
          "{aiPrompt}"
        </p>

        {/* ----------------------------------------------------
            PROCESSING STEPS
        ----------------------------------------------------- */}
        <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-5 text-left space-y-4">

          {steps.map((step, index) => {

            /*
             * Step is completed when:
             *
             * 1. Gemini has successfully returned
             * OR
             * 2. The visual progress has moved past it.
             */
            const completed =
              status === 'success' ||
              index < currentStep;

            /*
             * Current active step.
             */
            const active =
              status === 'processing' &&
              index === currentStep;

            return (
              <div
                key={step}
                className="flex items-center gap-3"
              >

                {/* Step status icon */}
                <div className="w-5 h-5 flex items-center justify-center shrink-0">

                  {completed ? (
                    <CheckCircle2
                      className="w-5 h-5 text-emerald-400"
                    />
                  ) : active ? (
                    <Loader2
                      className="w-5 h-5 text-indigo-400 animate-spin"
                    />
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-slate-700" />
                  )}

                </div>

                {/* Step label */}
                <span
                  className={`
                    text-sm transition-colors duration-300
                    ${
                      completed || active
                        ? 'text-slate-200'
                        : 'text-slate-600'
                    }
                  `}
                >
                  {step}
                </span>

              </div>
            );
          })}

        </div>

        {/* ----------------------------------------------------
            BOTTOM STATUS
        ----------------------------------------------------- */}
        <p className="text-xs text-slate-500 mt-6">
          {status === 'success'
            ? 'Opening your generated form...'
            : 'Forma AI is creating your form...'}
        </p>

        {/* ----------------------------------------------------
            REAL AI INDICATOR
        ----------------------------------------------------- */}
        {status === 'processing' && (
          <div className="mt-3 flex items-center justify-center gap-2 text-[11px] text-indigo-400">

            <Loader2 className="w-3 h-3 animate-spin" />

            <span>
              Gemini AI is generating your form
            </span>

          </div>
        )}

        {/* ----------------------------------------------------
            SUCCESS INDICATOR
        ----------------------------------------------------- */}
        {status === 'success' && (
          <div className="mt-3 flex items-center justify-center gap-2 text-[11px] text-emerald-400">

            <CheckCircle2 className="w-3 h-3" />

            <span>
              AI generation completed successfully
            </span>

          </div>
        )}

      </Card>
    </div>
  );
};

export default AIProcessingPage;
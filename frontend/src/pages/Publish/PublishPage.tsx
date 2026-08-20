import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  CheckCircle2,
  Copy,
  ExternalLink,
  Globe2,
  Loader2,
  Send,
  Sparkles,
} from 'lucide-react';

import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { useFormContext } from '../../context/FormContext';
import { formService } from '../../services/formService';

export const PublishPage: React.FC = () => {
  const navigate = useNavigate();

  const {
    activeForm,
    setActiveForm,
    loadForms,
  } = useFormContext();

  const [publishing, setPublishing] = useState(false);
  const [published, setPublished] = useState(
    activeForm?.status === 'published'
  );
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  if (!activeForm) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <Card className="w-full max-w-lg p-8 text-center">
          <h2 className="text-xl font-bold text-white mb-2">
            No active form selected
          </h2>

          <p className="text-sm text-slate-400 mb-6">
            Create or select a form before publishing it.
          </p>

          <Button onClick={() => navigate('/dashboard')}>
            Back to Dashboard
          </Button>
        </Card>
      </div>
    );
  }

  const getPublicUrl = () => {
    const slug = activeForm.slug || activeForm.id;

    return `${window.location.origin}/form/${slug}`;
  };

  const handlePublish = async () => {
    try {
      setPublishing(true);
      setError('');

      const updatedForm = await formService.updateForm(
        activeForm.id,
        {
          status: 'published',
        }
      );

      setActiveForm(updatedForm);
      setPublished(true);

      // Refresh user's forms from MongoDB.
      await loadForms();
    } catch (error: any) {
      console.error(
        '[PUBLISH FORM]',
        error
      );

      setError(
        error?.response?.data?.message ||
        error?.message ||
        'Unable to publish this form.'
      );
    } finally {
      setPublishing(false);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(
        getPublicUrl()
      );

      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error(
        '[COPY LINK]',
        error
      );
    }
  };

  const handleOpenForm = () => {
    window.open(
      getPublicUrl(),
      '_blank',
      'noopener,noreferrer'
    );
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 py-6">

      {/* Back */}
      <div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/form-builder')}
        >
          <ArrowLeft className="w-4 h-4 mr-1.5" />
          Back to Builder
        </Button>
      </div>

      {/* Header */}
      <div className="text-center space-y-3">

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-medium">
          <Sparkles className="w-3.5 h-3.5" />
          Forma AI
        </div>

        <h1 className="text-3xl font-bold text-white">
          {published
            ? 'Your form is live!'
            : 'Publish your form'}
        </h1>

        <p className="text-sm text-slate-400 max-w-lg mx-auto">
          {published
            ? 'Anyone with the public link can now open and submit this form.'
            : 'Make your AI-generated form available for real responses.'}
        </p>

      </div>

      {/* Form Information */}
      <Card className="p-6 border-slate-800">

        <div className="flex items-start justify-between gap-4">

          <div>
            <div className="flex items-center gap-2 mb-2">

              <h2 className="text-lg font-semibold text-white">
                {activeForm.title}
              </h2>

              {published && (
                <Badge
                  variant="indigo"
                  className="text-[10px]"
                >
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  Published
                </Badge>
              )}

            </div>

            <p className="text-sm text-slate-400">
              {activeForm.description ||
                'No description provided.'}
            </p>
          </div>

          <div className="shrink-0 w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
            <Globe2 className="w-5 h-5 text-indigo-400" />
          </div>

        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mt-6">

          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4">
            <p className="text-xs text-slate-500">
              Questions
            </p>

            <p className="text-xl font-bold text-white mt-1">
              {activeForm.questions.length}
            </p>
          </div>

          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4">
            <p className="text-xs text-slate-500">
              Current status
            </p>

            <p className="text-xl font-bold text-white mt-1 capitalize">
              {published ? 'Published' : 'Draft'}
            </p>
          </div>

        </div>

      </Card>

      {/* Publish */}
      {!published && (
        <Card className="p-6 border-indigo-500/30 bg-indigo-500/5">

          <div className="flex items-start gap-4">

            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 flex items-center justify-center shrink-0">
              <Send className="w-5 h-5 text-indigo-400" />
            </div>

            <div className="flex-1">

              <h3 className="font-semibold text-white">
                Ready to publish?
              </h3>

              <p className="text-sm text-slate-400 mt-1 mb-5">
                Publishing will make this form available
                through a public URL. Responses will be
                stored in your Forma AI database.
              </p>

              {error && (
                <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                  {error}
                </div>
              )}

              <Button
                onClick={handlePublish}
                disabled={publishing}
                className="w-full sm:w-auto"
              >
                {publishing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Publishing...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Publish Form
                  </>
                )}
              </Button>

            </div>

          </div>

        </Card>
      )}

      {/* Public Link */}
      {published && (
        <Card className="p-6 border-emerald-500/30">

          <div className="flex items-center gap-3 mb-4">

            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            </div>

            <div>
              <h3 className="font-semibold text-white">
                Form published successfully
              </h3>

              <p className="text-xs text-slate-400">
                Share this link with respondents.
              </p>
            </div>

          </div>

          <div className="flex flex-col sm:flex-row gap-2">

            <div className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-slate-300 truncate">
              {getPublicUrl()}
            </div>

            <Button
              variant="secondary"
              onClick={handleCopyLink}
            >
              <Copy className="w-4 h-4 mr-1.5" />
              {copied ? 'Copied!' : 'Copy'}
            </Button>

            <Button
              onClick={handleOpenForm}
            >
              <ExternalLink className="w-4 h-4 mr-1.5" />
              Open
            </Button>

          </div>

        </Card>
      )}

      {/* Navigation */}
      {published && (
        <div className="flex flex-col sm:flex-row justify-center gap-3">

          <Button
            variant="secondary"
            onClick={() => navigate('/form-builder')}
          >
            Edit Form
          </Button>

          <Button
            onClick={handleOpenForm}
          >
            <Globe2 className="w-4 h-4 mr-1.5" />
            View Live Form
          </Button>

        </div>
      )}

    </div>
  );
};

export default PublishPage;
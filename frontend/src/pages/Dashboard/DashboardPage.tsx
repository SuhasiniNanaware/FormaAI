import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  FileText,
  Users,
  Eye,
  BarChart3,
  ArrowUpRight,
  Sparkles,
  Clock3,
  ChevronRight,
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { useFormContext } from '../../context/FormContext';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { forms, setActiveForm } = useFormContext();

  const totalViews = forms.reduce(
    (acc, f) => acc + (f.viewsCount || 0),
    0
  );

  const totalResponses = forms.reduce(
    (acc, f) => acc + (f.responsesCount || 0),
    0
  );

  const publishedForms = forms.filter(
    (form) => form.status === 'published'
  ).length;

  const responseRate =
    totalViews > 0
      ? Math.round((totalResponses / totalViews) * 100)
      : 0;

  return (
    <div className="space-y-8 pb-8">

      {/* =========================================================
          DASHBOARD HEADER
      ========================================================= */}

      <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/70 p-6 sm:p-7">

        <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-indigo-600/10 blur-3xl" />
        <div className="absolute -left-20 -bottom-24 h-48 w-48 rounded-full bg-purple-600/5 blur-3xl" />

        <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

          <div>
            <div className="flex items-center gap-2 mb-3">

              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600/15 border border-indigo-500/20">
                <Sparkles className="w-4 h-4 text-indigo-400" />
              </div>

              <span className="text-[10px] uppercase tracking-[0.16em] font-semibold text-indigo-400">
                FormaAI Workspace
              </span>

            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Dashboard Overview
            </h1>

            <p className="text-xs sm:text-sm text-slate-400 mt-2 max-w-2xl">
              Create AI-powered forms, manage your active forms,
              and monitor responses from one place.
            </p>
          </div>

          <Button
            onClick={() => navigate('/create-form')}
            size="sm"
            className="self-start lg:self-center"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Create New Form
          </Button>

        </div>
      </div>


      {/* =========================================================
          OVERVIEW STATS
      ========================================================= */}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">

        {/* Forms */}

        <Card className="p-5 border-slate-800 hover:border-indigo-500/30 transition">

          <div className="flex items-start justify-between">

            <div className="w-10 h-10 rounded-xl bg-indigo-600/15 border border-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>

            <span className="text-[10px] text-slate-600 uppercase tracking-wider">
              Workspace
            </span>

          </div>

          <div className="mt-5">

            <p className="text-xs text-slate-400">
              Total Forms
            </p>

            <p className="text-2xl font-bold text-white mt-1">
              {forms.length}
            </p>

            <p className="text-[10px] text-slate-500 mt-1">
              {publishedForms} published
            </p>

          </div>

        </Card>


        {/* Views */}

        <Card className="p-5 border-slate-800 hover:border-purple-500/30 transition">

          <div className="flex items-start justify-between">

            <div className="w-10 h-10 rounded-xl bg-purple-600/15 border border-purple-500/10 text-purple-400 flex items-center justify-center">
              <Eye className="w-5 h-5" />
            </div>

            <ArrowUpRight className="w-4 h-4 text-slate-600" />

          </div>

          <div className="mt-5">

            <p className="text-xs text-slate-400">
              Total Views
            </p>

            <p className="text-2xl font-bold text-white mt-1">
              {totalViews}
            </p>

            <p className="text-[10px] text-slate-500 mt-1">
              Across all your forms
            </p>

          </div>

        </Card>


        {/* Responses */}

        <Card className="p-5 border-slate-800 hover:border-emerald-500/30 transition">

          <div className="flex items-start justify-between">

            <div className="w-10 h-10 rounded-xl bg-emerald-600/15 border border-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>

            <ArrowUpRight className="w-4 h-4 text-slate-600" />

          </div>

          <div className="mt-5">

            <p className="text-xs text-slate-400">
              Total Responses
            </p>

            <p className="text-2xl font-bold text-white mt-1">
              {totalResponses}
            </p>

            <p className="text-[10px] text-slate-500 mt-1">
              Collected submissions
            </p>

          </div>

        </Card>


        {/* Conversion */}

        <Card className="p-5 border-slate-800 hover:border-amber-500/30 transition">

          <div className="flex items-start justify-between">

            <div className="w-10 h-10 rounded-xl bg-amber-600/15 border border-amber-500/10 text-amber-400 flex items-center justify-center">
              <BarChart3 className="w-5 h-5" />
            </div>

            <span className="text-[10px] text-slate-600 uppercase tracking-wider">
              Analytics
            </span>

          </div>

          <div className="mt-5">

            <p className="text-xs text-slate-400">
              Response Rate
            </p>

            <p className="text-2xl font-bold text-white mt-1">
              {responseRate}%
            </p>

            <p className="text-[10px] text-slate-500 mt-1">
              Responses vs. views
            </p>

          </div>

        </Card>

      </div>


      {/* =========================================================
          ACTIVE FORMS HEADER
      ========================================================= */}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">

        <div>

          <div className="flex items-center gap-2">

            <h2 className="text-sm font-semibold text-white">
              Your Forms
            </h2>

            <Badge
              variant="slate"
              className="text-[9px]"
            >
              {forms.length}
            </Badge>

          </div>

          <p className="text-[11px] text-slate-500 mt-1">
            Manage and monitor your AI-generated forms.
          </p>

        </div>

        {forms.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/forms')}
          >
            View All
            <ChevronRight className="w-3.5 h-3.5 ml-1" />
          </Button>
        )}

      </div>


      {/* =========================================================
          FORMS LIST
      ========================================================= */}

      {forms.length === 0 ? (

        <Card className="relative overflow-hidden p-10 sm:p-14 text-center border-dashed border-slate-800">

          <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/[0.03] to-transparent pointer-events-none" />

          <div className="relative">

            <div className="mx-auto w-14 h-14 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-indigo-400" />
            </div>

            <h3 className="mt-5 text-base font-semibold text-white">
              Start building your first form
            </h3>

            <p className="text-xs text-slate-500 max-w-md mx-auto mt-2 leading-relaxed">
              Describe what you need in natural language and
              FormaAI will generate a structured form for you.
            </p>

            <Button
              size="sm"
              className="mt-5"
              onClick={() => navigate('/create-form')}
            >
              <Plus className="w-4 h-4 mr-1.5" />
              Generate Your First Form
            </Button>

          </div>

        </Card>

      ) : (

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">

          {forms.map((form) => (

            <Card
              key={form.id}
              className="p-5 border-slate-800 hover:border-indigo-500/30 transition-all duration-200 flex flex-col justify-between gap-5"
            >

              {/* Form Header */}

              <div>

                <div className="flex items-start justify-between gap-3">

                  <div className="min-w-0">

                    <div className="flex items-center gap-2">

                      <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center shrink-0">
                        <FileText className="w-4 h-4 text-indigo-400" />
                      </div>

                      <h3 className="font-semibold text-white text-sm sm:text-base truncate">
                        {form.title}
                      </h3>

                    </div>

                  </div>

                  <Badge
                    variant={
                      form.status === 'published'
                        ? 'emerald'
                        : 'slate'
                    }
                    className="capitalize shrink-0 text-[9px]"
                  >
                    {form.status}
                  </Badge>

                </div>

                <p className="text-xs text-slate-400 mt-4 line-clamp-2 leading-relaxed">
                  {form.description}
                </p>

              </div>


              {/* Form Metrics */}

              <div className="grid grid-cols-3 gap-2 border-y border-slate-800/70 py-3">

                <div className="text-center">

                  <p className="text-sm font-semibold text-white">
                    {form.questions.length}
                  </p>

                  <p className="text-[9px] text-slate-600 mt-0.5 uppercase tracking-wider">
                    Questions
                  </p>

                </div>

                <div className="text-center border-x border-slate-800/70">

                  <p className="text-sm font-semibold text-white">
                    {form.viewsCount || 0}
                  </p>

                  <p className="text-[9px] text-slate-600 mt-0.5 uppercase tracking-wider">
                    Views
                  </p>

                </div>

                <div className="text-center">

                  <p className="text-sm font-semibold text-white">
                    {form.responsesCount || 0}
                  </p>

                  <p className="text-[9px] text-slate-600 mt-0.5 uppercase tracking-wider">
                    Responses
                  </p>

                </div>

              </div>


              {/* Form Actions */}

              <div className="flex items-center justify-between gap-3">

                <div className="flex items-center gap-1.5 text-[10px] text-slate-600">

                  <Clock3 className="w-3.5 h-3.5" />

                  <span>
                    {form.status === 'published'
                      ? 'Live form'
                      : 'Draft form'}
                  </span>

                </div>

                <div className="flex items-center gap-2">

                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      setActiveForm(form);
                      navigate('/form-builder');
                    }}
                  >
                    Edit
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setActiveForm(form);
                      navigate('/analytics');
                    }}
                  >
                    <BarChart3 className="w-3.5 h-3.5 mr-1" />
                    Analytics
                  </Button>

                </div>

              </div>

            </Card>

          ))}

        </div>

      )}

    </div>
  );
};

export default DashboardPage;
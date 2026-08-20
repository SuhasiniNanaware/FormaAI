import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Cpu,
  Code2,
  Zap,
  ShieldCheck,
  ArrowRight,
  Layers,
  CheckCircle2,
} from 'lucide-react';

import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';

export const AboutPage: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Cpu,
      color: 'text-indigo-400',
      title: 'AI-Powered Generation',
      description:
        'Transforms natural language prompts into complete, validated form schemas instantly using Google Gemini.',
    },
    {
      icon: Code2,
      color: 'text-purple-400',
      title: 'Type-Safe Architecture',
      description:
        'Built with React 18, TypeScript, and Tailwind CSS for seamless integration and zero-runtime errors.',
    },
    {
      icon: Zap,
      color: 'text-amber-400',
      title: 'Instant Deployment',
      description:
        'Publish forms with shareable URLs or embed clean HTML snippets directly into your app or website.',
    },
    {
      icon: ShieldCheck,
      color: 'text-emerald-400',
      title: 'Real-Time Analytics',
      description:
        'Track submission conversion rates, view field completion stats, and export responses securely.',
    },
  ];

  const techStack = [
    { name: 'React 18', role: 'UI Library' },
    { name: 'TypeScript', role: 'Type Safety' },
    { name: 'Tailwind CSS', role: 'Styling' },
    { name: 'Google Gemini AI', role: 'Form Generation' },
    { name: 'Lucide Icons', role: 'Iconography' },
    { name: 'React Router v6', role: 'Client Routing' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-12 py-4">

      {/* ==================================================
          HERO SECTION
      ================================================== */}

      <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/40 px-6 py-10 sm:px-10 sm:py-14">

        {/* Background decoration */}

        <div className="absolute -top-32 -right-24 w-80 h-80 rounded-full bg-indigo-600/10 blur-3xl" />

        <div className="absolute -bottom-40 -left-24 w-80 h-80 rounded-full bg-purple-600/10 blur-3xl" />

        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/[0.03] via-transparent to-purple-500/[0.03] pointer-events-none" />

        <div className="relative text-center space-y-5">

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[11px] font-semibold tracking-wide">

            <Sparkles className="w-3.5 h-3.5" />

            Next-Gen Form Platform

          </div>

          <div className="space-y-3">

            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">

              Building Forms at the{' '}

              <span className="block bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Speed of Thought
              </span>

            </h1>

            <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto leading-relaxed">
              FormaAI eliminates the hassle of manually placing fields and
              configuring validation rules. Simply describe what you need,
              and our AI constructs a production-ready form in seconds.
            </p>

          </div>

          <div className="pt-2 flex items-center justify-center gap-3 flex-wrap">

            <Button
              size="sm"
              onClick={() =>
                navigate('/create-form')
              }
            >
              Create a Form

              <ArrowRight className="w-4 h-4 ml-1.5" />

            </Button>

            <Button
              size="sm"
              variant="secondary"
              onClick={() =>
                navigate('/templates')
              }
            >
              Explore Templates
            </Button>

          </div>

        </div>

      </div>

      {/* ==================================================
          METRICS COUNTER BAR
      ================================================== */}

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">

        {[
          {
            label: 'Forms Generated',
            value: '50,000+',
          },
          {
            label: 'Submissions Processed',
            value: '1.2M+',
          },
          {
            label: 'Avg Generation Time',
            value: '< 3s',
          },
          {
            label: 'Schema Accuracy',
            value: '99.4%',
          },
        ].map((stat, idx) => (

          <Card
            key={idx}
            className="group relative overflow-hidden p-5 border-slate-800 text-center space-y-1.5 hover:border-indigo-500/20 transition-all duration-200"
          >

            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

            <p className="text-lg sm:text-2xl font-bold text-white font-mono tracking-tight">
              {stat.value}
            </p>

            <p className="text-[10px] sm:text-[11px] text-slate-500">
              {stat.label}
            </p>

          </Card>

        ))}

      </div>

      {/* ==================================================
          CORE CAPABILITIES
      ================================================== */}

      <div className="space-y-5">

        <div className="text-center">

          <div className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-indigo-400 mb-2">
            <span className="w-5 h-px bg-indigo-500/40" />
            Capabilities
            <span className="w-5 h-px bg-indigo-500/40" />
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-white">
            Why Choose FormaAI?
          </h2>

          <p className="text-xs text-slate-400 mt-1.5">
            Engineered for developers, designers, and growth teams.
          </p>

        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          {features.map((feat, idx) => {

            const Icon = feat.icon;

            return (

              <Card
                key={idx}
                glow
                className="group relative overflow-hidden p-5 border-slate-800 space-y-3 hover:border-slate-700 transition-all duration-200"
              >

                <div className="absolute -right-8 -top-8 w-20 h-20 rounded-full bg-indigo-500/[0.03] blur-2xl group-hover:bg-indigo-500/[0.08] transition-all" />

                <div className="relative flex items-center gap-3">

                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 group-hover:border-slate-700 transition-colors">

                    <Icon
                      className={`w-5 h-5 ${feat.color}`}
                    />

                  </div>

                  <h3 className="text-sm font-bold text-white">
                    {feat.title}
                  </h3>

                </div>

                <p className="text-xs text-slate-400 leading-relaxed pl-1">
                  {feat.description}
                </p>

              </Card>

            );
          })}

        </div>

      </div>

      {/* ==================================================
          TECH STACK GRID
      ================================================== */}

      <Card className="relative overflow-hidden p-6 border-slate-800 space-y-5">

        <div className="absolute -right-24 -top-24 w-56 h-56 rounded-full bg-indigo-500/[0.04] blur-3xl" />

        <div className="relative flex items-center justify-between border-b border-slate-800 pb-4">

          <div>

            <h3 className="text-sm font-bold text-white flex items-center gap-2">

              <div className="w-7 h-7 rounded-lg bg-indigo-600/10 border border-indigo-500/10 flex items-center justify-center">

                <Layers className="w-4 h-4 text-indigo-400" />

              </div>

              Technical Architecture

            </h3>

            <p className="text-[10px] text-slate-500 mt-1 ml-9">
              Technologies powering the FormaAI experience.
            </p>

          </div>

          <Badge
            variant="indigo"
            className="text-[10px]"
          >
            Modern Stack
          </Badge>

        </div>

        <div className="relative grid grid-cols-2 sm:grid-cols-3 gap-3">

          {techStack.map((item, idx) => (

            <div
              key={idx}
              className="group p-3.5 bg-slate-950/60 rounded-xl border border-slate-800/80 flex items-center gap-2.5 hover:border-indigo-500/20 hover:bg-slate-950 transition-all duration-200"
            >

              <div className="w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">

                <CheckCircle2 className="w-4 h-4 text-emerald-400" />

              </div>

              <div className="min-w-0">

                <p className="text-xs font-semibold text-white truncate">
                  {item.name}
                </p>

                <p className="text-[10px] text-slate-500 mt-0.5 truncate">
                  {item.role}
                </p>

              </div>

            </div>

          ))}

        </div>

      </Card>

      {/* ==================================================
          FINAL CTA
      ================================================== */}

      <div className="relative overflow-hidden rounded-2xl border border-indigo-500/15 bg-indigo-500/[0.035] p-6 sm:p-7 text-center">

        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-64 h-40 bg-indigo-500/10 blur-3xl rounded-full" />

        <div className="relative space-y-3">

          <div className="mx-auto w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/15 flex items-center justify-center">

            <Sparkles className="w-4 h-4 text-indigo-400" />

          </div>

          <h2 className="text-base sm:text-lg font-bold text-white">
            Ready to build your next form?
          </h2>

          <p className="text-[11px] sm:text-xs text-slate-500 max-w-md mx-auto">
            Turn your idea into a structured, production-ready form with
            FormaAI.
          </p>

          <div className="pt-1">

            <Button
              size="sm"
              onClick={() =>
                navigate('/create-form')
              }
            >
              Start Creating

              <ArrowRight className="w-4 h-4 ml-1.5" />

            </Button>

          </div>

        </div>

      </div>

    </div>
  );
};

export default AboutPage;
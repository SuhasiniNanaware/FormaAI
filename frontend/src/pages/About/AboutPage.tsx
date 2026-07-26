import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  Cpu, 
  Code2, 
  Zap, 
  ShieldCheck, 
  Users, 
  ArrowRight,
  Layers,
  LayoutDashboard,
  CheckCircle2
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
      description: 'Transforms natural language prompts into complete, validated form schemas instantly using Google Gemini.'
    },
    {
      icon: Code2,
      color: 'text-purple-400',
      title: 'Type-Safe Architecture',
      description: 'Built with React 18, TypeScript, and Tailwind CSS for seamless integration and zero-runtime errors.'
    },
    {
      icon: Zap,
      color: 'text-amber-400',
      title: 'Instant Deployment',
      description: 'Publish forms with shareable URLs or embed clean HTML snippets directly into your app or website.'
    },
    {
      icon: ShieldCheck,
      color: 'text-emerald-400',
      title: 'Real-Time Analytics',
      description: 'Track submission conversion rates, view field completion stats, and export responses securely.'
    }
  ];

  const techStack = [
    { name: 'React 18', role: 'UI Library' },
    { name: 'TypeScript', role: 'Type Safety' },
    { name: 'Tailwind CSS', role: 'Styling' },
    { name: 'Google Gemini AI', role: 'Form Generation' },
    { name: 'Lucide Icons', role: 'Iconography' },
    { name: 'React Router v6', role: 'Client Routing' }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-12 py-4">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-medium">
          <Sparkles className="w-3.5 h-3.5" /> Next-Gen Form Platform
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
          Building Forms at the <br />
          <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Speed of Thought
          </span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto leading-relaxed">
          FormaAI eliminates the hassle of manually placing fields and configuring validation rules. 
          Simply describe what you need, and our AI constructs a production-ready form in seconds.
        </p>
        <div className="pt-2 flex items-center justify-center gap-3">
          <Button size="sm" onClick={() => navigate('/create-form')}>
            Create a Form <ArrowRight className="w-4 h-4 ml-1.5" />
          </Button>
          <Button size="sm" variant="secondary" onClick={() => navigate('/templates')}>
            Explore Templates
          </Button>
        </div>
      </div>

      {/* Metrics Counter Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Forms Generated', value: '50,000+' },
          { label: 'Submissions Processed', value: '1.2M+' },
          { label: 'Avg Generation Time', value: '< 3s' },
          { label: 'Schema Accuracy', value: '99.4%' }
        ].map((stat, idx) => (
          <Card key={idx} className="p-4 border-slate-800 text-center space-y-1">
            <p className="text-lg sm:text-2xl font-bold text-white font-mono">{stat.value}</p>
            <p className="text-[11px] text-slate-400">{stat.label}</p>
          </Card>
        ))}
      </div>

      {/* Core Capabilities */}
      <div className="space-y-4">
        <div className="text-center">
          <h2 className="text-xl font-bold text-white">Why Choose FormaAI?</h2>
          <p className="text-xs text-slate-400 mt-1">Engineered for developers, designers, and growth teams.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <Card key={idx} glow className="p-5 border-slate-800 space-y-2">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                    <Icon className={`w-5 h-5 ${feat.color}`} />
                  </div>
                  <h3 className="text-sm font-bold text-white">{feat.title}</h3>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed pl-1">
                  {feat.description}
                </p>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Tech Stack Grid */}
      <Card className="p-6 border-slate-800 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-400" /> Technical Architecture
          </h3>
          <Badge variant="indigo" className="text-[10px]">Modern Stack</Badge>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {techStack.map((item, idx) => (
            <div key={idx} className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <div>
                <p className="text-xs font-semibold text-white">{item.name}</p>
                <p className="text-[10px] text-slate-500">{item.role}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default AboutPage;
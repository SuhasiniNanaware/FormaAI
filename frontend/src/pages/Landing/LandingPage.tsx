import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  ArrowRight, 
  Zap, 
  BarChart3, 
  ShieldCheck, 
  Terminal, 
  Play, 
  Cpu, 
  Power,
  X
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [activePromptIndex, setActivePromptIndex] = useState(0);

  // Intro Boot Sequence States
  const [showIntro, setShowIntro] = useState(true);
  const [bootStep, setBootStep] = useState<0 | 1 | 2 | 3>(0); 
  const [aiText, setAiText] = useState('');

  // Floating AI Support Widget Toggle
  const [showSupportWidget, setShowSupportWidget] = useState(true);

  const fullAiMessage = "SYSTEM ONLINE. I AM FORMA AI. TELL ME WHAT FORM YOU NEED, AND I WILL BUILD IT INSTANTLY.";

  const samplePrompts = [
    "Create a customer feedback survey for an e-commerce store with star ratings and conditional follow-up questions.",
    "Generate a high-converting software job application form with resume file upload and technical skill tags.",
    "Build a modern event registration form with ticket tier selector, contact info, and dietary preference options."
  ];

  // Exact paths to your downloaded GIFs inside public/ folder
  const botWavingGif = "/Robot Says Hi.gif"; 

  useEffect(() => {
    const hasSeenIntro = sessionStorage.getItem('forma_intro_seen');
    if (hasSeenIntro) {
      setShowIntro(false);
      return;
    }

    const timer1 = setTimeout(() => setBootStep(1), 400);

    const timer2 = setTimeout(() => {
      setBootStep(2);
      let charIndex = 0;
      let currentString = '';
      const typingInterval = setInterval(() => {
        if (charIndex < fullAiMessage.length) {
          currentString += fullAiMessage.charAt(charIndex);
          setAiText(currentString);
          charIndex++;
        } else {
          clearInterval(typingInterval);
          setTimeout(() => handleSkipIntro(), 1800);
        }
      }, 30);
    }, 1200);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  const handleSkipIntro = () => {
    setBootStep(3);
    setTimeout(() => {
      setShowIntro(false);
      sessionStorage.setItem('forma_intro_seen', 'true');
    }, 700);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-indigo-500 selection:text-white overflow-x-hidden relative font-sans">
      
      {/* ================= 🌌 1ST ANIMATION: INTRO OVERLAY (Robot Says Hi GIF) ================= */}
      {showIntro && (
        <div 
          className={`fixed inset-0 z-50 bg-slate-950 flex flex-col items-center justify-center transition-all duration-700 ease-in-out ${
            bootStep === 3 ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100'
          }`}
        >
          {/* Cybernetic Grid Overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(#6366f115_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

          {/* Skip Intro Button */}
          <button 
            onClick={handleSkipIntro}
            className="absolute top-8 right-8 text-xs font-mono text-slate-500 hover:text-indigo-400 border border-slate-800 hover:border-indigo-500/40 px-4 py-2 rounded-full transition duration-300 backdrop-blur-md bg-slate-950/50 flex items-center gap-2 z-10"
          >
            <span>SKIP INTRO</span>
            <Power className="w-3.5 h-3.5 text-indigo-400" />
          </button>

          {/* Waving Bot GIF Container */}
          <div className="relative flex items-center justify-center mb-6">
            <div className="absolute w-56 h-56 rounded-full bg-indigo-500/20 blur-3xl animate-pulse" />
            <div 
              className={`relative z-10 transition-all duration-700 ${
                bootStep >= 1 ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
              }`}
            >
              <img 
                src={botWavingGif} 
                alt="Robot Says Hi" 
                className="w-44 h-44 sm:w-52 sm:h-52 object-contain drop-shadow-[0_0_30px_rgba(99,102,241,0.6)]"
              />
            </div>
          </div>

          {/* Intro Dialogue Text */}
          <div className="max-w-xl mx-auto px-6 text-center space-y-3 z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-[11px] font-mono text-indigo-400">
              <Cpu className="w-3.5 h-3.5 animate-spin" />
              <span>AI CORE INITIALIZED</span>
            </div>

            <p className="text-sm sm:text-lg font-mono text-indigo-100 min-h-[56px] leading-relaxed tracking-wide">
              {aiText}
              {bootStep === 2 && <span className="inline-block w-2 h-5 bg-indigo-400 ml-1 animate-ping" />}
            </p>
          </div>

        </div>
      )}

      {/* Background Lighting & Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />
      <div className="absolute top-[-5%] left-1/2 -translate-x-1/2 w-[1000px] h-[550px] bg-gradient-to-tr from-indigo-600/20 via-purple-600/15 to-pink-600/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Header Bar */}
      <header className="max-w-7xl mx-auto w-full px-6 py-6 flex items-center justify-between z-20">
        <div className="flex items-center gap-2.5 group cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition duration-200">
            <Sparkles className="w-5 h-5 text-indigo-100" />
          </div>
          <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-300 bg-clip-text text-transparent">
            Forma<span className="text-indigo-400">AI</span>
          </span>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => navigate('/login')}>Sign In</Button>
          <Button size="sm" className="shadow-lg shadow-indigo-500/20" onClick={() => navigate('/register')}>Get Started</Button>
        </div>
      </header>

      {/* Main Landing Hero Section */}
      <main className="max-w-6xl mx-auto w-full px-6 pt-12 pb-20 text-center space-y-12 z-10 flex-1 flex flex-col items-center justify-center">
        
        {/* Release Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-indigo-500/30 text-xs font-medium text-indigo-300 shadow-xl backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
          <span>Forma Engine v2.4 Released</span>
          <span className="w-1 h-1 rounded-full bg-indigo-400" />
          <span className="text-slate-400">Zero-code schema generation</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-7xl font-extrabold tracking-tight text-white max-w-5xl mx-auto leading-[1.1]">
          Build intelligent, adaptive forms with <br />
          <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">
            AI Prompts in Seconds
          </span>
        </h1>

        <p className="text-base sm:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Transform simple text prompts into production-ready forms complete with dynamic validation, clean UI themes, and real-time response analytics.
        </p>

        {/* Hero CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2 w-full sm:w-auto">
          <Button 
            size="lg" 
            className="w-full sm:w-auto px-8 py-6 text-sm font-semibold shadow-xl shadow-indigo-500/25 bg-gradient-to-r from-indigo-600 to-purple-600 border-none" 
            onClick={() => navigate('/create-form')}
          >
            Start Building Free <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
          <Button 
            variant="secondary" 
            size="lg" 
            className="w-full sm:w-auto px-7 py-6 text-sm border-slate-800 hover:bg-slate-900" 
            onClick={() => navigate('/login')}
          >
            Explore Live Demo
          </Button>
        </div>

        {/* ================= 🌊 2ND ANIMATION: LANDING PAGE TERMINAL (Voice Wave Bar Animation) ================= */}
        <div className="w-full max-w-4xl pt-4">
          <Card glow className="p-1 bg-slate-900/90 border-slate-800 backdrop-blur-xl shadow-2xl text-left overflow-hidden">
            {/* Terminal Top Window Controls */}
            <div className="flex items-center justify-between px-4 py-3 bg-slate-950/80 border-b border-slate-800/80">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
                <span className="text-xs text-slate-500 font-mono ml-2 flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-indigo-400" /> FormaAI Prompt Engine
                </span>
              </div>

              {/* ===== Voice Audio Wave Bar ===== */}
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20">
                <span className="w-1 h-3 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                <span className="w-1 h-4 bg-purple-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                <span className="w-1 h-5 bg-pink-400 rounded-full animate-bounce" />
                <span className="w-1 h-3.5 bg-purple-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                <span className="w-1 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                <span className="text-[10px] font-mono text-indigo-300 ml-1">AI Voice Listening</span>
              </div>
            </div>

            {/* Prompt Selector Tabs */}
            <div className="p-4 sm:p-6 space-y-4">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Try an AI Prompt Example:</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {samplePrompts.map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActivePromptIndex(idx)}
                    className={`p-3 text-left rounded-xl text-xs transition border ${
                      activePromptIndex === idx
                        ? 'bg-indigo-600/15 border-indigo-500/50 text-white shadow-lg'
                        : 'bg-slate-950/50 border-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-950'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-[11px] text-indigo-400">Preset 0{idx + 1}</span>
                      {activePromptIndex === idx && <Sparkles className="w-3 h-3 text-indigo-400" />}
                    </div>
                    <p className="line-clamp-2 text-[11px] leading-relaxed">{p}</p>
                  </button>
                ))}
              </div>

              {/* Terminal Input Box */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3 w-full">
                  <Sparkles className="w-5 h-5 text-indigo-400 shrink-0" />
                  <p className="text-xs text-slate-200 font-mono">
                    "{samplePrompts[activePromptIndex]}"
                  </p>
                </div>
                <Button 
                  size="sm" 
                  onClick={() => navigate('/create-form')}
                  className="w-full sm:w-auto shrink-0 bg-indigo-600 hover:bg-indigo-500 text-xs gap-1.5"
                >
                  <Play className="w-3 h-3 fill-current" /> Generate Form
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Feature Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 text-left w-full">
          <Card glow className="p-6 space-y-4 border-slate-800 hover:border-indigo-500/40 transition group">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center group-hover:scale-110 transition duration-300">
              <Zap className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-white">Instant AI Schema Engine</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Automatically infers field types, validation constraints, labels, placeholder hints, and multi-step pages.
              </p>
            </div>
          </Card>

          <Card glow className="p-6 space-y-4 border-slate-800 hover:border-purple-500/40 transition group">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center group-hover:scale-110 transition duration-300">
              <BarChart3 className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-white">Real-Time Telemetry</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Monitor form completion velocity, conversion rates, drop-off questions, and device demographics.
              </p>
            </div>
          </Card>

          <Card glow className="p-6 space-y-4 border-slate-800 hover:border-cyan-500/40 transition group">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center group-hover:scale-110 transition duration-300">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-white">Embed & API Ready</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Seamlessly export JSON schemas, embed clean standard HTML iframe tags, or integrate directly with React.
              </p>
            </div>
          </Card>
        </section>

        {/* Stats Boxes */}
        <div className="w-full pt-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 text-center">
            <Card className="p-6 border-slate-800 bg-slate-900/60 flex flex-col justify-center items-center space-y-1">
              <p className="text-2xl sm:text-4xl font-extrabold text-white font-mono tracking-tight">50,000+</p>
              <p className="text-xs text-slate-400 font-medium">Forms Generated</p>
            </Card>
            <Card className="p-6 border-slate-800 bg-slate-900/60 flex flex-col justify-center items-center space-y-1">
              <p className="text-2xl sm:text-4xl font-extrabold text-white font-mono tracking-tight">1.2M+</p>
              <p className="text-xs text-slate-400 font-medium">Submissions Processed</p>
            </Card>
            <Card className="p-6 border-slate-800 bg-slate-900/60 flex flex-col justify-center items-center space-y-1">
              <p className="text-2xl sm:text-4xl font-extrabold text-white font-mono tracking-tight">&lt; 3s</p>
              <p className="text-xs text-slate-400 font-medium">Avg Generation Time</p>
            </Card>
            <Card className="p-6 border-slate-800 bg-slate-900/60 flex flex-col justify-center items-center space-y-1">
              <p className="text-2xl sm:text-4xl font-extrabold text-white font-mono tracking-tight">99.9%</p>
              <p className="text-xs text-slate-400 font-medium">Uptime & Reliability</p>
            </Card>
          </div>
        </div>

        {/* CTA Banner */}
        <Card glow className="w-full p-8 sm:p-12 border border-indigo-500/30 bg-gradient-to-br from-indigo-950/40 via-slate-900/90 to-purple-950/40 text-center space-y-6 shadow-2xl">
          <div className="max-w-2xl mx-auto space-y-3">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Ready to revolutionize your form building?
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Join thousands of teams crafting interactive, high-converting forms powered by AI.
            </p>
          </div>

          <div className="flex justify-center pt-2">
            <Button 
              size="lg" 
              className="px-8 py-6 shadow-lg shadow-indigo-500/25 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold" 
              onClick={() => navigate('/create-form')}
            >
              Build Your First Form Now <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </Card>

      </main>

     {/* ================= 🤖 3RD ANIMATION: FLOATING AI HELP ASSISTANT ================= */}
{showSupportWidget && (
  <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2 group">
    {/* Chat Tooltip Popover */}
    <div className="bg-slate-900/90 border border-indigo-500/30 text-xs font-mono text-indigo-200 px-4 py-2.5 rounded-2xl shadow-2xl backdrop-blur-md flex items-center gap-2 animate-bounce">
      <Sparkles className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
      <span>Need help creating a form? Ask AI!</span>
      <button 
        onClick={() => setShowSupportWidget(false)}
        className="text-slate-500 hover:text-white ml-2"
      >
        <X className="w-3 h-3" />
      </button>
    </div>

    {/* Floating AI Bot Button - routed correctly to /ai-assistant */}
    <button 
      onClick={() => navigate('/ai-assistant')}
      className="relative w-16 h-16 rounded-full bg-slate-900/90 border-2 border-indigo-500/50 shadow-[0_0_25px_rgba(99,102,241,0.5)] flex items-center justify-center overflow-hidden hover:scale-110 transition duration-300 cursor-pointer"
    >
      <img 
        src="/Live chatbot.gif" 
        alt="Live Chatbot" 
        className="w-12 h-12 object-contain"
      />
    </button>
  </div>
)}
      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950/80 backdrop-blur-md py-6 px-6 text-xs text-slate-500 z-10">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} FormaAI. All rights reserved.</p>
          <div className="flex items-center gap-6 text-slate-400">
            <span className="hover:text-white cursor-pointer" onClick={() => navigate('/about')}>About</span>
            <span className="hover:text-white cursor-pointer" onClick={() => navigate('/help')}>Docs & Help</span>
            <span className="hover:text-white cursor-pointer" onClick={() => navigate('/settings')}>Settings</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
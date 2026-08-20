import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Mail,
  Lock,
  User,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Eye,
  EyeOff,
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { authService } from '../../services/authService';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await authService.register({
        username: name,
        email,
        password,
      });

      setEmailSent(true);
    } catch (error: any) {
      alert(
        error.response?.data?.message ||
          'Registration Failed'
      );
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 py-8 sm:px-6 relative overflow-hidden">

      {/* Ambient Background */}

      <div className="absolute -top-32 -right-32 w-96 h-96 bg-indigo-600/15 rounded-full blur-[140px] pointer-events-none" />

      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-purple-600/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-500/[0.025] rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-5xl relative z-10">

        {/* Main Register Container */}

        <div className="grid grid-cols-1 lg:grid-cols-2 rounded-3xl border border-slate-800 bg-slate-900/60 backdrop-blur-xl overflow-hidden shadow-2xl shadow-black/20">

          {/* =====================================================
              LEFT BRAND PANEL
          ====================================================== */}

          <div className="hidden lg:flex relative flex-col justify-between p-10 xl:p-12 bg-gradient-to-br from-indigo-600/[0.12] via-slate-900/60 to-purple-600/[0.08] border-r border-slate-800">

            <div>

              {/* Logo */}

              <button
                type="button"
                onClick={() => navigate('/')}
                className="flex items-center gap-3 group"
              >

                <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/20 group-hover:bg-indigo-500 transition">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>

                <div className="text-left">
                  <p className="text-sm font-bold text-white">
                    FormaAI
                  </p>

                  <p className="text-[10px] text-slate-500">
                    AI Form Platform
                  </p>
                </div>

              </button>

              {/* Introduction */}

              <div className="mt-20">

                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-semibold uppercase tracking-wider">
                  <Sparkles className="w-3 h-3" />
                  Build Smarter
                </div>

                <h2 className="mt-5 text-3xl xl:text-4xl font-bold text-white leading-tight">
                  Turn your ideas into
                  <span className="block bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                    powerful forms.
                  </span>
                </h2>

                <p className="mt-5 text-sm text-slate-400 leading-relaxed max-w-md">
                  Create intelligent, production-ready forms
                  with the help of AI. Describe what you need
                  and let FormaAI handle the structure.
                </p>

              </div>

              {/* Feature Points */}

              <div className="mt-10 space-y-4">

                {[
                  'AI-powered form generation',
                  'Flexible form builder',
                  'Real-time response analytics',
                ].map((feature) => (
                  <div
                    key={feature}
                    className="flex items-center gap-3"
                  >

                    <div className="w-6 h-6 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    </div>

                    <span className="text-xs text-slate-300">
                      {feature}
                    </span>

                  </div>
                ))}

              </div>

            </div>

            {/* Bottom */}

            <div className="flex items-center gap-2 text-[10px] text-slate-600">
              <ShieldCheck className="w-3.5 h-3.5" />
              Secure account creation
            </div>

          </div>


          {/* =====================================================
              RIGHT REGISTER PANEL
          ====================================================== */}

          <div className="p-6 sm:p-8 lg:p-10">

            {/* Mobile Logo */}

            <div className="lg:hidden flex justify-center mb-7">

              <button
                type="button"
                onClick={() => navigate('/')}
                className="w-11 h-11 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20"
              >
                <Sparkles className="w-5 h-5 text-white" />
              </button>

            </div>


            {/* Header */}

            <div className="text-center lg:text-left mb-7">

              <p className="text-[10px] uppercase tracking-[0.18em] font-semibold text-indigo-400 mb-2">
                Get Started
              </p>

              <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Create your account
              </h1>

              <p className="text-xs sm:text-sm text-slate-400 mt-2">
                Start building AI-powered forms in seconds.
              </p>

            </div>


            {/* Form Card */}

            <Card
              glow
              className="p-5 sm:p-6 border-slate-800 bg-slate-950/50"
            >

              {emailSent ? (

                /* =================================================
                   EMAIL VERIFICATION
                ================================================== */

                <div className="text-center py-6 space-y-5">

                  <div className="mx-auto w-16 h-16 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center">
                    <Mail className="w-7 h-7 text-indigo-400" />
                  </div>

                  <div>

                    <h2 className="text-xl font-bold text-white">
                      Verify your email
                    </h2>

                    <p className="text-xs text-slate-400 mt-2">
                      Your account was created successfully.
                    </p>

                  </div>

                  <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">

                    <p className="text-[11px] text-slate-500">
                      Verification link sent to
                    </p>

                    <p className="text-sm font-semibold text-indigo-400 break-all mt-1">
                      {email}
                    </p>

                  </div>

                  <div className="flex items-start gap-3 text-left rounded-xl bg-amber-500/5 border border-amber-500/10 p-4">

                    <Mail className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />

                    <p className="text-[11px] leading-relaxed text-slate-400">
                      Please check your inbox and click the
                      verification link to activate your account.
                      If you don't see it, check your spam folder.
                    </p>

                  </div>

                </div>

              ) : (

                /* =================================================
                   REGISTER FORM
                ================================================== */

                <form
                  onSubmit={handleRegister}
                  className="space-y-5"
                >

                  {/* Name */}

                  <div className="space-y-1.5">

                    <label className="text-xs font-semibold text-slate-300">
                      Full Name
                    </label>

                    <div className="relative">

                      <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />

                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) =>
                          setName(e.target.value)
                        }
                        placeholder="Jane Doe"
                        className="w-full bg-slate-900/80 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition"
                      />

                    </div>

                  </div>


                  {/* Email */}

                  <div className="space-y-1.5">

                    <label className="text-xs font-semibold text-slate-300">
                      Email Address
                    </label>

                    <div className="relative">

                      <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />

                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) =>
                          setEmail(e.target.value)
                        }
                        placeholder="you@example.com"
                        className="w-full bg-slate-900/80 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition"
                      />

                    </div>

                  </div>


                  {/* Password */}

                  <div className="space-y-1.5">

                    <div className="flex items-center justify-between">

                      <label className="text-xs font-semibold text-slate-300">
                        Password
                      </label>

                      <span className="text-[10px] text-slate-600">
                        Keep it secure
                      </span>

                    </div>

                    <div className="relative">

                      <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />

                      <input
                        type={
                          showPassword
                            ? 'text'
                            : 'password'
                        }
                        required
                        value={password}
                        onChange={(e) =>
                          setPassword(e.target.value)
                        }
                        placeholder="••••••••"
                        className="w-full bg-slate-900/80 border border-slate-800 rounded-xl pl-10 pr-10 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowPassword(
                            !showPassword
                          )
                        }
                        className="absolute right-3.5 top-2.5 text-slate-500 hover:text-white transition"
                        aria-label={
                          showPassword
                            ? 'Hide password'
                            : 'Show password'
                        }
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>

                    </div>

                  </div>


                  {/* Terms */}

                  <div className="flex items-start gap-2 pt-1">

                    <ShieldCheck className="w-3.5 h-3.5 text-slate-600 mt-0.5 shrink-0" />

                    <p className="text-[10px] text-slate-600 leading-relaxed">
                      Your account information is used to
                      provide access to your FormaAI workspace.
                    </p>

                  </div>


                  {/* Submit */}

                  <Button
                    type="submit"
                    className="w-full mt-1"
                  >
                    Create Account
                    <ArrowRight className="w-4 h-4 ml-1.5" />
                  </Button>

                </form>

              )}

            </Card>


            {/* Login */}

            <p className="text-center text-xs sm:text-sm text-slate-500 mt-6">

              Already have an account?{' '}

              <button
                type="button"
                onClick={() => navigate('/login')}
                className="text-indigo-400 hover:text-indigo-300 font-semibold transition"
              >
                Sign In
              </button>

            </p>


            {/* Footer */}

            <p className="text-center text-[10px] text-slate-700 mt-6">
              By creating an account, you can start using
              FormaAI's form generation workspace.
            </p>

          </div>

        </div>

      </div>
    </div>
  );
};

export default RegisterPage;
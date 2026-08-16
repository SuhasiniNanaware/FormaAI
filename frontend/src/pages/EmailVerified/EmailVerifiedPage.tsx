import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export const EmailVerifiedPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/80 p-8 text-center shadow-2xl shadow-indigo-950/40">
        <div className="mb-6 flex justify-center">
          <div className="rounded-full bg-emerald-500/15 p-4 text-emerald-400">
            <CheckCircle2 className="h-12 w-12" />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-white">Email Verified</h1>
        <p className="mt-4 text-slate-300">
          Your account has been successfully activated. You can now continue to your dashboard.
        </p>

        <div className="mt-8">
          <Button onClick={() => navigate('/login')} className="w-full">
            Continue to Login
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EmailVerifiedPage;

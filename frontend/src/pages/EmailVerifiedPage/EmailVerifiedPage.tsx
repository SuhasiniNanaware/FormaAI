import React from "react";

const EmailVerifiedPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950">
      <div className="bg-slate-900 p-8 rounded-2xl shadow-lg text-center">
        <h1 className="text-3xl font-bold text-green-400">
          Email Verified ✅
        </h1>

        <p className="text-slate-300 mt-4">
          Your email has been verified successfully.
        </p>

        <p className="text-slate-400 mt-2">
          You can now log in to your Forma AI account.
        </p>
      </div>
    </div>
  );
};

export default EmailVerifiedPage;
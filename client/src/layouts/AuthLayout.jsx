import React from 'react';
import { Sparkles } from 'lucide-react';

const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#09090b] text-[#f4f4f5] flex items-center justify-center p-6 relative overflow-hidden">
      
      {/* Decorative Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-violet-600/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-600/20 blur-[120px] pointer-events-none" />
      <div className="absolute top-[30%] right-[20%] w-[300px] h-[300px] rounded-full bg-pink-500/10 blur-[100px] pointer-events-none" />

      {/* Auth Card wrapper */}
      <div className="w-full max-w-md relative z-10">
        
        {/* Top Header */}
        <div className="text-center mb-8">
          <div className="inline-flex p-3 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-600 text-white shadow-xl shadow-indigo-600/30 mb-4 animate-bounce">
            <Sparkles className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            AI WORKSPACE
          </h1>
          <p className="text-sm text-gray-400 mt-2">
            The next-generation workspace powered by AI.
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-[#18181b]/50 border border-[#27272a] rounded-3xl p-8 backdrop-blur-xl shadow-2xl">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;

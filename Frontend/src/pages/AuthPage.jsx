import React, { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import LoginForm from '../components/auth/LoginForm';
import SignupForm from '../components/auth/SignupForm';

const AuthPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(location.pathname !== '/signup');

  useEffect(() => {
    setIsLogin(location.pathname !== '/signup');
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-surface font-body-md text-on-surface antialiased flex flex-col justify-between relative overflow-x-hidden selection:bg-secondary-container selection:text-on-secondary-container">
      {/* Subtle ambient decorative glow behind the card */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center -z-10 overflow-hidden">
        <div className="w-[520px] h-[520px] rounded-full bg-primary-fixed opacity-35 blur-3xl transform -translate-y-6"></div>
      </div>

      {/* Global Header */}
      <header className="w-full pt-8 pb-4 px-6 max-w-6xl mx-auto flex items-center justify-between">
        <a href="/" className="inline-flex items-center gap-2.5 transition-opacity hover:opacity-85 focus:outline-none group">
          <div className="w-8 h-8 rounded-lg bg-secondary-container flex items-center justify-center transition-transform group-hover:scale-105 shadow-[0_2px_8px_rgba(126,87,194,0.12)]">
            <span className="material-symbols-outlined text-[18px] text-primary">spa</span>
          </div>
          <span className="font-title-lg text-title-lg font-bold tracking-tight text-on-surface">Calorie<span className="text-primary">Mate</span></span>
        </a>

        <div className="text-body-sm font-body-sm text-on-surface-variant flex items-center gap-1.5">
          <span>{isLogin ? "Don't have an account?" : "Already have an account?"}</span>
          <button 
            onClick={() => navigate(isLogin ? '/signup' : '/login')} 
            className="font-medium text-primary hover:text-primary-container transition-colors"
          >
            {isLogin ? 'Sign up →' : 'Log in →'}
          </button>
        </div>
      </header>

      {/* Main Center Auth Area */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-8 sm:px-6 z-10">
        <div className="w-full max-w-[420px] sm:max-w-[440px] mx-auto">
          
          {/* View Switcher Pill */}
          <div className="flex items-center justify-center mb-6">
            <div className="inline-flex p-1 bg-surface-container-high/50 rounded-xl border border-outline-variant/50">
              <button 
                onClick={() => navigate('/signup')} 
                className={`px-4 py-1.5 text-label-md font-label-md rounded-lg transition-all ${!isLogin ? 'bg-surface-container-lowest text-on-surface shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}
              >
                Sign Up
              </button>
              <button 
                onClick={() => navigate('/login')} 
                className={`px-4 py-1.5 text-label-md font-label-md rounded-lg transition-all ${isLogin ? 'bg-surface-container-lowest text-on-surface shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}
              >
                Login
              </button>
            </div>
          </div>

          <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-7 sm:p-8 shadow-[0_4px_20px_-2px_rgba(23,23,23,0.03)] relative">
            {isLogin ? <LoginForm /> : <SignupForm />}
          </div>
        </div>
      </main>
      
      {/* Footer spacer for layout balance */}
      <footer className="w-full py-4 text-center text-label-sm font-label-sm text-outline">
        © 2026 CalorieMate. All rights reserved.
      </footer>
    </div>
  );
};

export default AuthPage;

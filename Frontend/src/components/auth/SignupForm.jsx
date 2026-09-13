import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Button from '../ui/Button';

const SignupForm = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      return setError("Passwords don't match");
    }

    setLoading(true);
    const result = await register(name, email, password);
    setLoading(false);

    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message);
    }
  };

  return (
    <>
      <div className="text-center mb-7 sm:mb-8">
        <h1 className="font-headline-md text-[28px] font-bold text-on-surface tracking-tight mb-2">
          Create your account
        </h1>
        <p className="font-body-sm text-[15px] text-on-surface-variant leading-relaxed max-w-sm mx-auto">
          Start tracking your nutrition and reach your goals with CalorieMate.
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-error-container text-on-error-container rounded-xl text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-[18px]">
        <div>
          <label className="block font-label-md text-[13px] font-medium text-on-surface-variant mb-1.5">
            Full Name
          </label>
          <input 
            type="text" 
            placeholder="Enter your full name" 
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full h-[50px] px-4 bg-surface-container-lowest border border-outline-variant/60 rounded-xl text-[14px] sm:text-[15px] text-on-surface placeholder:text-outline transition-all focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            required
          />
        </div>

        <div>
          <label className="block font-label-md text-[13px] font-medium text-on-surface-variant mb-1.5">
            Email
          </label>
          <input 
            type="email" 
            placeholder="Enter your email" 
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full h-[50px] px-4 bg-surface-container-lowest border border-outline-variant/60 rounded-xl text-[14px] sm:text-[15px] text-on-surface placeholder:text-outline transition-all focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            required
          />
        </div>

        <div>
          <label className="block font-label-md text-[13px] font-medium text-on-surface-variant mb-1.5">
            Password
          </label>
          <input 
            type="password" 
            placeholder="Create a password" 
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full h-[50px] px-4 bg-surface-container-lowest border border-outline-variant/60 rounded-xl text-[14px] sm:text-[15px] text-on-surface placeholder:text-outline transition-all focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            required
          />
        </div>

        <div>
          <label className="block font-label-md text-[13px] font-medium text-on-surface-variant mb-1.5">
            Confirm Password
          </label>
          <input 
            type="password" 
            placeholder="Confirm your password" 
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            className="w-full h-[50px] px-4 bg-surface-container-lowest border border-outline-variant/60 rounded-xl text-[14px] sm:text-[15px] text-on-surface placeholder:text-outline transition-all focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            required
          />
        </div>

        <div className="pt-2">
          <Button type="submit" disabled={loading} variant="primary" className="w-full h-[50px] text-[15px] rounded-xl flex items-center justify-center gap-2">
            {loading ? 'Creating Account...' : 'Create Account'} <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </Button>
        </div>
      </form>
    </>
  );
};

export default SignupForm;

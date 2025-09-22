
import React, { useState } from 'react';

interface EmailModalProps {
  onSubmit: (email: string) => void;
  onClose: () => void;
}

export const EmailModal: React.FC<EmailModalProps> = ({ onSubmit, onClose }) => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      onSubmit(email);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-sky-100 dark:bg-dark-surface p-8 rounded-xl border border-sky-200 dark:border-dark-border shadow-2xl max-w-md w-full text-center transition-colors duration-300">
        <h2 className="text-2xl font-bold mb-2">Unlock More Content!</h2>
        <p className="text-slate-600 dark:text-dark-text-secondary mb-6">You've reached your anonymous free generation limit. Enter your email to unlock 3 more content packages, completely free.</p>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your.email@example.com"
            required
            className="w-full bg-white dark:bg-dark-bg border border-slate-300 dark:border-dark-border rounded-lg p-3 mb-4 focus:ring-2 focus:ring-brand-purple focus:border-brand-purple transition"
          />
          <button
            type="submit"
            className="w-full text-white font-bold py-3 px-6 rounded-lg bg-gradient-to-r from-brand-purple to-brand-pink hover:opacity-90 transition-opacity"
          >
            Unlock More Generations
          </button>
        </form>
        <button onClick={onClose} className="mt-4 text-sm text-slate-500 dark:text-dark-text-secondary hover:underline">
          No thanks
        </button>
      </div>
    </div>
  );
};

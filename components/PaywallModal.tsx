
import React from 'react';

interface PaywallModalProps {
  onClose: () => void;
}

export const PaywallModal: React.FC<PaywallModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-sky-100 dark:bg-dark-surface p-8 rounded-xl border border-sky-200 dark:border-dark-border shadow-2xl max-w-md w-full text-center transition-colors duration-300">
        <h2 className="text-2xl font-bold mb-2">You're a Content Pro!</h2>
        <p className="text-slate-600 dark:text-dark-text-secondary mb-6">You've used all your free generations! Subscribe for unlimited access and advanced features to keep creating amazing content.</p>
        <button
          onClick={() => alert("Pricing page coming soon!")}
          className="w-full text-white font-bold py-3 px-6 rounded-lg bg-gradient-to-r from-brand-purple to-brand-pink hover:opacity-90 transition-opacity"
        >
          See Pricing Plans (Coming Soon)
        </button>
        <button onClick={onClose} className="mt-4 text-sm text-slate-500 dark:text-dark-text-secondary hover:underline">
          Maybe later
        </button>
      </div>
    </div>
  );
};

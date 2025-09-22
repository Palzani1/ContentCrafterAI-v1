
import React from 'react';

export const LoadingSpinner: React.FC = () => {
  return (
    <div className="mt-12 flex flex-col items-center justify-center text-center">
      <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-brand-purple"></div>
      <p className="mt-4 text-lg text-slate-500 dark:text-dark-text-secondary">Generating your package... This might take a moment!</p>
    </div>
  );
};

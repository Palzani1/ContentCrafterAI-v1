import React from 'react';
import { ErrorIcon, CloseIcon } from './IconComponents';

interface ErrorAlertProps {
  message: string;
  onDismiss: () => void;
}

export const ErrorAlert: React.FC<ErrorAlertProps> = ({ message, onDismiss }) => {
  if (!message) return null;

  return (
    <div className="mt-6 p-4 bg-red-100 dark:bg-red-900/50 border border-red-300 dark:border-red-700 text-red-800 dark:text-red-300 rounded-lg flex items-center justify-between animate-fade-in" role="alert">
      <div className="flex items-center">
        <ErrorIcon />
        <span className="ml-3">{message}</span>
      </div>
      <button onClick={onDismiss} aria-label="Dismiss error message" className="p-1 rounded-full hover:bg-red-200 dark:hover:bg-red-800/50 transition-colors">
        <CloseIcon />
      </button>
    </div>
  );
};
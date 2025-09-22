import React, { useState } from 'react';
import type { ContentType } from '../types';
import { CONTENT_TYPE_OPTIONS } from '../constants';
import { LockIcon } from './IconComponents';

interface InputFormProps {
  topic: string;
  setTopic: (topic: string) => void;
  contentType: ContentType | '';
  setContentType: (contentType: ContentType | '') => void;
  onGenerate: () => void;
  isLoading: boolean;
  isDisabled: boolean;
}

export const InputForm: React.FC<InputFormProps> = ({
  topic,
  setTopic,
  contentType,
  setContentType,
  onGenerate,
  isLoading,
  isDisabled,
}) => {
  const [errors, setErrors] = useState<{ topic?: string; contentType?: string }>({});

  const validate = (): boolean => {
    const newErrors: { topic?: string; contentType?: string } = {};

    if (!topic.trim()) {
      newErrors.topic = "Please enter a topic to generate content.";
    }

    if (!contentType) {
      newErrors.contentType = "Please select a content type.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleGenerate = () => {
    if (validate()) {
      onGenerate();
    }
  };

  return (
    <section className="p-6 bg-sky-100 dark:bg-dark-surface rounded-xl border border-sky-200 dark:border-dark-border shadow-md transition-colors duration-300">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="topic" className="block text-sm font-medium text-slate-600 dark:text-dark-text-secondary mb-2">Topic</label>
          <input
            type="text"
            id="topic"
            value={topic}
            onChange={(e) => {
              setTopic(e.target.value);
              if (errors.topic) {
                setErrors(prev => ({ ...prev, topic: undefined }));
              }
            }}
            placeholder="e.g., 'Sustainable living tips for beginners'"
            className={`w-full bg-white dark:bg-dark-bg border rounded-lg p-3 focus:ring-2 focus:ring-brand-purple focus:border-brand-purple transition ${errors.topic ? 'border-red-500' : 'border-slate-300 dark:border-dark-border'}`}
            aria-required="true"
            aria-invalid={!!errors.topic}
            aria-describedby={errors.topic ? 'topic-error' : undefined}
          />
          {errors.topic && <p id="topic-error" className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.topic}</p>}
        </div>
        <div>
          <label htmlFor="content-type" className="block text-sm font-medium text-slate-600 dark:text-dark-text-secondary mb-2">Content Type</label>
          <select
            id="content-type"
            value={contentType}
            onChange={(e) => {
              setContentType(e.target.value as ContentType);
              if (errors.contentType) {
                setErrors(prev => ({ ...prev, contentType: undefined }));
              }
            }}
            className={`w-full bg-white dark:bg-dark-bg border rounded-lg p-3 focus:ring-2 focus:ring-brand-purple focus:border-brand-purple transition ${errors.contentType ? 'border-red-500' : 'border-slate-300 dark:border-dark-border'}`}
            aria-required="true"
            aria-invalid={!!errors.contentType}
            aria-describedby={errors.contentType ? 'content-type-error' : undefined}
          >
            <option value="" disabled>Select a content type...</option>
            {CONTENT_TYPE_OPTIONS.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
          {errors.contentType && <p id="content-type-error" className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.contentType}</p>}
        </div>
      </div>
      <div className="mt-6 relative">
          <label htmlFor="visual-preference" className="block text-sm font-medium text-slate-600 dark:text-dark-text-secondary mb-2">Visual & B-Roll Preference</label>
          <div className="relative">
            <select
                id="visual-preference"
                disabled
                className="w-full bg-sky-50 dark:bg-dark-bg border border-slate-300 dark:border-dark-border rounded-lg p-3 appearance-none cursor-not-allowed opacity-50"
            >
                <option>Royalty-Free Stock Media Links</option>
            </select>
            <div 
                className="absolute inset-y-0 right-0 flex items-center px-4 text-slate-500 dark:text-dark-text-secondary tooltip-container"
                data-tooltip="Coming soon in a future update!"
            >
                <LockIcon />
            </div>
          </div>
      </div>
      <div className="mt-8 flex justify-center">
        <button
          onClick={handleGenerate}
          disabled={isLoading || isDisabled}
          className="w-full md:w-1/2 text-white font-bold py-3 px-6 rounded-lg bg-gradient-to-r from-brand-purple to-brand-pink hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity duration-300 transform hover:scale-105"
        >
          {isLoading ? 'Generating...' : 'Create My Content Package!'}
        </button>
      </div>
    </section>
  );
};

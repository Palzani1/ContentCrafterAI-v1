import React from 'react';
import App from './App';
import { CheckCircleIcon } from './components/IconComponents';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-blue-50 dark:bg-dark-bg text-slate-900 dark:text-dark-text font-sans flex flex-col items-center p-4 sm:p-6 lg:p-8 transition-colors duration-300">
      <div className="w-full max-w-4xl text-center">
        
        {/* Hero Section */}
        <header className="my-8 md:my-12">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                Generate Your Content Package
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-purple to-brand-pink"> Instantly with AI</span>
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-600 dark:text-dark-text-secondary">
                Tired of pre-production headaches? Go from a simple topic to a full content package—scripts, titles, and royalty-free visuals—in minutes.
            </p>
        </header>

        {/* Integrated App */}
        <main>
          <App />
        </main>

        {/* Value Proposition Section */}
        <section className="mt-16 md:mt-24 text-left">
            <h2 className="text-3xl font-bold text-center mb-8 text-slate-800 dark:text-dark-text">Why ContentCrafter AI?</h2>
            <div className="grid md:grid-cols-3 gap-8">
                <div className="p-6 bg-white dark:bg-dark-surface rounded-xl border border-slate-200 dark:border-dark-border">
                    <CheckCircleIcon />
                    <h3 className="text-xl font-semibold mt-4 mb-2 text-slate-900 dark:text-white">Save Hours of Work</h3>
                    <p className="text-slate-600 dark:text-dark-text-secondary">Eliminate writer's block and endless brainstorming. Get a complete script and visual plan in seconds.</p>
                </div>
                <div className="p-6 bg-white dark:bg-dark-surface rounded-xl border border-slate-200 dark:border-dark-border">
                    <CheckCircleIcon />
                    <h3 className="text-xl font-semibold mt-4 mb-2 text-slate-900 dark:text-white">Boost Your Creativity</h3>
                    <p className="text-slate-600 dark:text-dark-text-secondary">Discover new angles and ideas for your topics, complete with catchy titles and engaging talking points.</p>
                </div>
                <div className="p-6 bg-white dark:bg-dark-surface rounded-xl border border-slate-200 dark:border-dark-border">
                    <CheckCircleIcon />
                    <h3 className="text-xl font-semibold mt-4 mb-2 text-slate-900 dark:text-white">Streamline Your Workflow</h3>
                    <p className="text-slate-600 dark:text-dark-text-secondary">Get royalty-free media suggestions alongside your script, making asset gathering a breeze.</p>
                </div>
            </div>
        </section>

      </div>
    </div>
  );
};
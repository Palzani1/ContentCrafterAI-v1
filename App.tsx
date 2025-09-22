
import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { InputForm } from './components/InputForm';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ResultsDisplay } from './components/ResultsDisplay';
import { EmailModal } from './components/EmailModal';
import { PaywallModal } from './components/PaywallModal';
import { useGenerationTracker } from './hooks/useGenerationTracker';
import { useTheme } from './hooks/useTheme';
import { generateContentPackage } from './services/geminiService';
import type { ContentPackage, ContentType } from './types';
import { TOTAL_FREE_GENERATIONS } from './constants';

const App: React.FC = () => {
  const {
    generationsUsed,
    userTier,
    isLimitReached,
    incrementGenerations,
    startEmailTier,
  } = useGenerationTracker();

  const [theme, toggleTheme] = useTheme();
  const [topic, setTopic] = useState('');
  const [contentType, setContentType] = useState<ContentType | ''>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [contentPackage, setContentPackage] = useState<ContentPackage | null>(null);
  
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showPaywallModal, setShowPaywallModal] = useState(false);

  const handleGenerate = useCallback(async () => {
    if (!topic || !contentType || isLimitReached()) {
      if(isLimitReached()) {
        if(userTier === 'anonymous') setShowEmailModal(true);
        if(userTier === 'email') setShowPaywallModal(true);
      }
      return;
    }

    setIsLoading(true);
    setError(null);
    setContentPackage(null);

    try {
      const result = await generateContentPackage(topic, contentType);
      setContentPackage(result);
      incrementGenerations();
      if (generationsUsed + 1 === TOTAL_FREE_GENERATIONS) {
         setShowPaywallModal(true);
      } else if (userTier === 'anonymous' && generationsUsed + 1 === 3) {
         setShowEmailModal(true);
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [topic, contentType, isLimitReached, incrementGenerations, userTier, generationsUsed]);
  
  const handleEmailSubmit = (email: string) => {
    // In a real app, you'd call a backend here.
    // For this frontend-only example, we'll just simulate success.
    console.log(`Email submitted: ${email}`);
    startEmailTier();
    setShowEmailModal(false);
  };


  const generationsLeft = TOTAL_FREE_GENERATIONS - generationsUsed;

  return (
    <div className="min-h-screen bg-sky-50 dark:bg-dark-bg text-slate-900 dark:text-dark-text font-sans flex flex-col items-center p-4 sm:p-6 lg:p-8 transition-colors duration-300">
      <div className="w-full max-w-4xl">
        <Header 
            generationsLeft={generationsLeft} 
            theme={theme}
            toggleTheme={toggleTheme}
        />
        <main className="mt-8">
          <InputForm
            topic={topic}
            setTopic={setTopic}
            contentType={contentType}
            setContentType={setContentType}
            onGenerate={handleGenerate}
            isLoading={isLoading}
            isDisabled={isLimitReached()}
          />

          {error && <div className="mt-6 p-4 bg-red-100 text-red-800 border border-red-300 dark:bg-red-900/50 dark:text-red-300 dark:border-red-700 rounded-lg text-center">{error}</div>}

          {isLoading && <LoadingSpinner />}
          
          {contentPackage && !isLoading && (
            <ResultsDisplay contentPackage={contentPackage} />
          )}

          {!isLoading && !contentPackage && (
             <div className="mt-12 text-center text-slate-500 dark:text-dark-text-secondary">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-dark-text mb-2">Welcome to ContentCrafter AI</h2>
                <p>Enter a topic and select a content type to begin your creation journey.</p>
            </div>
          )}
        </main>
      </div>

      {showEmailModal && <EmailModal onSubmit={handleEmailSubmit} onClose={() => setShowEmailModal(false)} />}
      {showPaywallModal && <PaywallModal onClose={() => setShowPaywallModal(false)} />}
    </div>
  );
};

export default App;

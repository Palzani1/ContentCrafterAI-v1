import React, { useState, useCallback, useEffect } from 'react';
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
import { ErrorAlert } from './components/ErrorAlert';

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

  const [tempApiKey, setTempApiKey] = useState('');
  const [isApiKeyMissing, setIsApiKeyMissing] = useState(false);

  useEffect(() => {
    if (!process.env.API_KEY) {
      setIsApiKeyMissing(true);
    }
  }, []);

  const handleGenerate = useCallback(async () => {
    if (isLimitReached()) {
        if(userTier === 'anonymous') setShowEmailModal(true);
        if(userTier === 'email' || userTier === 'limit-reached') setShowPaywallModal(true);
        return;
    }
    if (!topic || !contentType || (isApiKeyMissing && !tempApiKey)) {
      return;
    }

    setIsLoading(true);
    setError(null);
    setContentPackage(null);

    try {
      const result = await generateContentPackage(topic, contentType, tempApiKey);
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
  }, [topic, contentType, isLimitReached, incrementGenerations, userTier, generationsUsed, startEmailTier, tempApiKey, isApiKeyMissing]);
  
  const handleEmailSubmit = (email: string) => {
    // In a real app, you'd call a backend here.
    // For this frontend-only example, we'll just simulate success.
    console.log(`Email submitted: ${email}`);
    startEmailTier();
    setShowEmailModal(false);
  };


  const generationsLeft = TOTAL_FREE_GENERATIONS - generationsUsed;

  return (
    <div className="w-full max-w-4xl">
        <Header 
            generationsLeft={generationsLeft} 
            theme={theme}
            toggleTheme={toggleTheme}
        />
        <div className="mt-8">
          <InputForm
            topic={topic}
            setTopic={setTopic}
            contentType={contentType}
            setContentType={setContentType}
            onGenerate={handleGenerate}
            isLoading={isLoading}
            isDisabled={isLimitReached()}
            tempApiKey={tempApiKey}
            setTempApiKey={setTempApiKey}
            isApiKeyMissing={isApiKeyMissing}
          />

          {error && <ErrorAlert message={error} onDismiss={() => setError(null)} />}

          {isLoading && <LoadingSpinner />}
          
          {contentPackage && !isLoading && (
            <ResultsDisplay contentPackage={contentPackage} />
          )}

        </div>

      {showEmailModal && <EmailModal onSubmit={handleEmailSubmit} onClose={() => setShowEmailModal(false)} />}
      {showPaywallModal && <PaywallModal onClose={() => setShowPaywallModal(false)} />}
    </div>
  );
};

export default App;
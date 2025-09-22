
import { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ANONYMOUS_GENERATIONS_LIMIT, TOTAL_FREE_GENERATIONS } from '../constants';

type UserTier = 'anonymous' | 'email' | 'limit-reached';

const getTodaysDateKey = () => {
    const now = new Date();
    return `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
};

export const useGenerationTracker = () => {
    const [userIdentifier, setUserIdentifier] = useState<string | null>(null);
    const [generationsUsed, setGenerationsUsed] = useState(0);
    const [userTier, setUserTier] = useState<UserTier>('anonymous');
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        // --- Initialization ---
        const todayKey = getTodaysDateKey();
        
        // 1. Get or create UUID
        let uuid = localStorage.getItem('userUUID');
        if (!uuid) {
            uuid = uuidv4();
            localStorage.setItem('userUUID', uuid);
        }
        setUserIdentifier(uuid);

        // 2. Load today's usage data from localStorage
        const storedDataRaw = localStorage.getItem('generationData');
        let todaysGenerations = 0;
        let storedTier: UserTier = 'anonymous';

        if (storedDataRaw) {
            try {
                const storedData = JSON.parse(storedDataRaw);
                if (storedData.date === todayKey) {
                    todaysGenerations = storedData.count || 0;
                    storedTier = storedData.tier || 'anonymous';
                } else {
                    // It's a new day, reset the data
                    localStorage.removeItem('generationData');
                }
            } catch (e) {
                console.error("Failed to parse generation data, resetting.");
                localStorage.removeItem('generationData');
            }
        }
        
        setGenerationsUsed(todaysGenerations);
        setUserTier(storedTier);
        if (todaysGenerations >= TOTAL_FREE_GENERATIONS) {
            setUserTier('limit-reached');
        }

        setIsInitialized(true);
    }, []);

    const updateLocalStorage = useCallback((count: number, tier: UserTier) => {
        const todayKey = getTodaysDateKey();
        const dataToStore = {
            date: todayKey,
            count,
            tier,
        };
        localStorage.setItem('generationData', JSON.stringify(dataToStore));
    }, []);

    const incrementGenerations = useCallback(() => {
        if (!isInitialized) return;
        const newCount = generationsUsed + 1;
        setGenerationsUsed(newCount);
        
        let newTier = userTier;
        if (newCount >= TOTAL_FREE_GENERATIONS) {
            newTier = 'limit-reached';
        } else if (newCount >= ANONYMOUS_GENERATIONS_LIMIT && userTier === 'anonymous') {
            // This state is handled by the modal trigger, but we ensure tier is correct
            newTier = 'email';
        }
        setUserTier(newTier);
        updateLocalStorage(newCount, newTier);

    }, [generationsUsed, isInitialized, userTier, updateLocalStorage]);
    
    const startEmailTier = useCallback(() => {
        if (!isInitialized) return;
        setUserTier('email');
        updateLocalStorage(generationsUsed, 'email');
    }, [generationsUsed, isInitialized, updateLocalStorage]);

    const isLimitReached = useCallback(() => {
        if (!isInitialized) return true; // Prevent actions before init
        return generationsUsed >= TOTAL_FREE_GENERATIONS;
    }, [generationsUsed, isInitialized]);


    return {
        userIdentifier,
        generationsUsed,
        userTier,
        isLimitReached,
        incrementGenerations,
        startEmailTier
    };
};

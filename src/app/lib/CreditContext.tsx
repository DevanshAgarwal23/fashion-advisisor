import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

interface CreditsContextProps {
    credits: number;
    fetchCredits: () => void;
}

const CreditsContext = createContext<CreditsContextProps | undefined>(undefined);

export const useCredits = () => {
    const context = useContext(CreditsContext);
    if (!context) {
        throw new Error('useCredits must be used within a CreditsProvider');
    }
    return context;
};

export const CreditsProvider =  ({ children }: { children: ReactNode }) => {
    const [credits, setCredits] = useState<any>(0);

    const fetchCredits = async () => {
        try {
            const response = await axios.get('/api/user/credits');
            setCredits(response.data.credits);
        } catch (error) {
            console.error('Failed to fetch credits:', error);
        }
    };

    useEffect(() => {
        fetchCredits();
    }, [credits]);

    return (
        <CreditsContext.Provider value={{ credits, fetchCredits }}>
            {children}
        </CreditsContext.Provider>
    );
};

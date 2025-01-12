// src/context/GameContext.tsx
import React, { createContext, useContext, useEffect, useCallback } from 'react';
import { useGameLogic } from '../hooks/useGameLogic';
import { useAuth } from '../hooks/useAuth';
import { User } from 'firebase/auth';

interface GameContextType extends ReturnType<typeof useGameLogic> {
    isAuthenticated: boolean;
    user: User | null;
    signIn: (email: string, password: string) => Promise<boolean>;
    signUp: (email: string, password: string, username: string) => Promise<boolean>;
    signOut: () => Promise<boolean>;
}

const GameContext = createContext<GameContextType | null>(null);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const gameLogic = useGameLogic();
    const { 
        isAuthenticated, 
        user,
        balance: firebaseBalance, 
        updateUserBalance, 
        signIn,
        signUp,
        signOut 
    } = useAuth();

    const syncBalance = useCallback(async () => {
        if (isAuthenticated && gameLogic.balance !== firebaseBalance) {
            await updateUserBalance(gameLogic.balance);
        }
    }, [isAuthenticated, gameLogic.balance, firebaseBalance, updateUserBalance]);

    const initializeBalance = useCallback(() => {
        if (isAuthenticated && firebaseBalance !== gameLogic.balance) {
            gameLogic.setBalance(firebaseBalance);
        }
    }, [isAuthenticated, firebaseBalance, gameLogic]);

    useEffect(() => {
        syncBalance();
    }, [syncBalance]);

    useEffect(() => {
        initializeBalance();
    }, [initializeBalance]);

    const contextValue = {
        ...gameLogic,
        isAuthenticated,
        user,
        signIn,
        signUp,
        signOut,
    };
    
    return (
        <GameContext.Provider value={contextValue}>
            {children}
        </GameContext.Provider>
    );
};

export const useGame = () => {
    const context = useContext(GameContext);
    if (!context) {
        throw new Error('useGame must be used within a GameProvider');
    }
    return context;
};
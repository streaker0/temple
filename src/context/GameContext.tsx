// src/context/GameContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useGameLogic } from '../hooks/useGameLogic';
import { GameState, PlayerAction, SpotCard, SpotBet } from '../types/game.types';
import { doc, onSnapshot, updateDoc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
} from 'firebase/auth';

interface GameContextType {
  // Auth state
  isAuthenticated: boolean;
  isLoading: boolean;
  username: string | null;
  authError: string | null;

  // Game state
  balance: number;
  gameState: GameState;
  bet: number;
  lastBet: number;
  anteBet: number;
  selectedDenomination: number;
  showChipButtons: boolean;
  currentSpotIndex: number;
  isAnimating: boolean;
  isEndingGame: boolean;
  message: string;
  gameOutcome: 'win' | 'lose' | 'tie' | 'bust' | null;

  // Board state
  anteCard: SpotCard;
  dealerCard: SpotCard;
  spotCards: SpotCard[];
  spotBets: SpotBet[];
  dealerCards: SpotCard[];
  dealerTotal: number;

  // Auth functions
  signIn: (email: string, password: string) => Promise<boolean>;
  signUp: (email: string, password: string, username: string) => Promise<boolean>;
  signOut: () => Promise<void>;

  // Game functions
  setShowChipButtons: (show: boolean) => void;
  setSelectedDenomination: (denomination: number) => void;
  calculateHandTotal: () => number;
  placeBet: (amount: number) => Promise<void>;
  clearBet: () => void;
  startGame: () => Promise<boolean>;
  handlePlayerAction: (action: PlayerAction) => void;
  handleRebet: () => void;
  startNewGame: () => void;
  setBalance: (newBalance: number) => Promise<void>;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [username, setUsername] = useState<string | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  const handleSetBalance = async (newBalance: number) => {
    if (!isAuthenticated || !auth.currentUser) return;

    try {
      const userDoc = doc(db, 'users', auth.currentUser.uid);
      await updateDoc(userDoc, { balance: newBalance });
    } catch (error) {
      console.error('Error updating balance:', error);
      throw new Error('Failed to update balance');
    }
  };
  const gameLogic = useGameLogic(0,handleSetBalance); // Initialize with 0, will be updated from Firestore

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setIsAuthenticated(!!user);
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            setUsername(userDoc.data().username);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      } else {
        setUsername(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Subscribe to balance updates from Firestore when authenticated
  useEffect(() => {
    if (!isAuthenticated || !auth.currentUser) return;

    const userDoc = doc(db, 'users', auth.currentUser.uid);
    const unsubscribe = onSnapshot(userDoc, (snapshot) => {
      if (snapshot.exists()) {
        const userData = snapshot.data();
        gameLogic.setBalance(userData.balance);
      }
    }, (error) => {
      console.error('Error in balance subscription:', error);
    });

    return () => unsubscribe();
  }, [isAuthenticated]);

  const handleSignIn = async (email: string, password: string) => {
    setAuthError(null);
    setIsLoading(true);
    try {
		const userCredential = await signInWithEmailAndPassword(auth, email, password);
		if (userCredential.user) {
			return true;
		  }
		  setAuthError('Failed to sign in');
		  return false;
    } catch (error: any) {
      console.error('Sign in error:', error);
      setAuthError(error.message || 'Failed to sign in');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (email: string, password: string, displayName: string) => {
    setAuthError(null);
    setIsLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const { user } = userCredential;

      // Create user document in Firestore
      await setDoc(doc(db, 'users', user.uid), {  // Changed from updateDoc to setDoc
        username: displayName,
        email: email,
        balance: 1000, // Initial balance for new users
        createdAt: new Date().toISOString()
      });

      return true;  // Add return true for success

    } catch (error: any) {
      console.error('Sign up error:', error);
      setAuthError(error.message || 'Failed to sign up');
      throw error;
    } finally {
      setIsLoading(false);
    }
};

  const handleSignOut = async () => {
    try {
      await firebaseSignOut(auth);
      // Reset game state after sign out
      gameLogic.startNewGame();
    } catch (error: any) {
      console.error('Sign out error:', error);
      setAuthError(error.message || 'Failed to sign out');
      throw error;
    }
  };



  const value: GameContextType = {
    // Auth state
    isAuthenticated,
    isLoading,
    username,
    authError,

    // Game state
    balance: gameLogic.balance,
    gameState: gameLogic.gameState,
    bet: gameLogic.bet,
    lastBet: gameLogic.lastBet,
    anteBet: gameLogic.anteBet,
    selectedDenomination: gameLogic.selectedDenomination,
    showChipButtons: gameLogic.showChipButtons,
    currentSpotIndex: gameLogic.currentSpotIndex,
    isAnimating: gameLogic.isAnimating,
    isEndingGame: gameLogic.isEndingGame,
    message: gameLogic.message,
    gameOutcome: gameLogic.gameOutcome,

    // Board state
    anteCard: gameLogic.anteCard,
    dealerCard: gameLogic.dealerCard,
    spotCards: gameLogic.spotCards,
    spotBets: gameLogic.spotBets,
    dealerCards: gameLogic.dealerCards,
    dealerTotal: gameLogic.dealerTotal,

    // Auth functions
    signIn: handleSignIn,
    signUp: handleSignUp,
    signOut: handleSignOut,

    // Game functions
    setShowChipButtons: (show: boolean) => 
      gameLogic.setChipState({ showChipButtons: show }),
    setSelectedDenomination: (denomination: number) => 
      gameLogic.setChipState({ selectedDenomination: denomination }),
    calculateHandTotal: gameLogic.calculateHandTotal,
    placeBet: gameLogic.placeBet,
    clearBet: gameLogic.clearBet,
    startGame: gameLogic.startGame,
    handlePlayerAction: gameLogic.handlePlayerAction,
    handleRebet: gameLogic.handleRebet,
    startNewGame: gameLogic.startNewGame,
    setBalance: handleSetBalance,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
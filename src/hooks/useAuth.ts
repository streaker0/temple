// src/hooks/useAuth.ts
import { useState, useEffect, useCallback } from 'react';
import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { auth, db } from '../config/firebase';
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc
} from 'firebase/firestore';

const INITIAL_BALANCE = 1000;

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  balance: number;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    balance: INITIAL_BALANCE,
  });

  const fetchUserData = useCallback(async (user: User) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        return userData.balance || INITIAL_BALANCE;
      }
      return INITIAL_BALANCE;
    } catch (error) {
      console.error('Error fetching user data:', error);
      return INITIAL_BALANCE;
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const balance = await fetchUserData(user);
        setAuthState({
          isAuthenticated: true,
          user,
          balance,
        });
      } else {
        setAuthState({
          isAuthenticated: false,
          user: null,
          balance: INITIAL_BALANCE,
        });
      }
    });

    return () => unsubscribe();
  }, [fetchUserData]);

  const updateUserBalance = useCallback(async (newBalance: number) => {
    if (!authState.user) return false;

    try {
      await updateDoc(doc(db, 'users', authState.user.uid), {
        balance: newBalance
      });
      
      setAuthState(prev => ({
        ...prev,
        balance: newBalance,
      }));
      
      return true;
    } catch (error) {
      console.error('Error updating balance:', error);
      return false;
    }
  }, [authState.user]);

  const signUp = async (email: string, password: string, username: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const userData = {
        username,
        email,
        balance: INITIAL_BALANCE,
        createdAt: new Date().toISOString()
      };

      await setDoc(doc(db, 'users', user.uid), userData);

      setAuthState({
        isAuthenticated: true,
        user,
        balance: INITIAL_BALANCE,
      });

      return true;
    } catch (error: any) {
      console.error('Signup error:', error);
      throw new Error(error.message || 'Failed to create account');
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const balance = await fetchUserData(userCredential.user);
      
      setAuthState({
        isAuthenticated: true,
        user: userCredential.user,
        balance,
      });
      
      return true;
    } catch (error) {
      console.error('Sign in error:', error);
      return false;
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      setAuthState({
        isAuthenticated: false,
        user: null,
        balance: INITIAL_BALANCE,
      });
      return true;
    } catch (error) {
      console.error('Sign out error:', error);
      return false;
    }
  };

  return {
    isAuthenticated: authState.isAuthenticated,
    user: authState.user,
    balance: authState.balance,
    updateUserBalance,
    signIn,
    signUp,
    signOut,
  };
};
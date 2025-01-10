import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useGameLogic } from '../hooks/useGameLogic';
import { INITIAL_BALANCE, MAX_BET, MIN_BET } from '../constants/game.constants';

// Mock localStorage
const localStorageMock = (() => {
    let store: { [key: string]: string } = {};
    return {
        getItem: vi.fn((key: string) => store[key] || null),
        setItem: vi.fn((key: string, value: string) => {
            store[key] = value.toString();
        }),
        clear: vi.fn(() => {
            store = {};
        })
    };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mock sleep function to speed up tests
vi.mock('../hooks/useGameLogic', async () => {
    const actual = await vi.importActual('../hooks/useGameLogic');
    return {
        ...actual,
        sleep: () => Promise.resolve()
    };
});

describe('useGameLogic', () => {
    const ACTUAL_INITIAL_BALANCE = 4472;  // Explicitly set to match game.constants.ts

    beforeEach(() => {
        localStorageMock.clear();
        vi.clearAllMocks();
    });

    it('initializes with correct default values', () => {
        const { result } = renderHook(() => useGameLogic());
        
        expect(result.current.balance).toBe(ACTUAL_INITIAL_BALANCE);
        expect(result.current.bet).toBe(0);
        expect(result.current.gameState).toBe('betting');
        expect(result.current.spotCards).toHaveLength(4);
        expect(result.current.spotBets).toHaveLength(4);
        expect(result.current.isAnimating).toBe(false);
    });

    it('loads balance from localStorage if available', () => {
        localStorageMock.setItem('gameBalance', '1000');
        const { result } = renderHook(() => useGameLogic());
        expect(result.current.balance).toBe(1000);
    });

    it('places bet correctly', async () => {
        const { result } = renderHook(() => useGameLogic());

        await act(async () => {
            result.current.placeBet(10);
        });

        expect(result.current.bet).toBe(10);
        expect(result.current.balance).toBe(ACTUAL_INITIAL_BALANCE - 10);
    });

    it('prevents betting more than MAX_BET', async () => {
        const { result } = renderHook(() => useGameLogic());
        
        await act(async () => {
            result.current.placeBet(MAX_BET + 100);
        });

        expect(result.current.bet).toBe(0);
        expect(result.current.balance).toBe(ACTUAL_INITIAL_BALANCE);
    });

    it('prevents betting less than MIN_BET', async () => {
        const { result } = renderHook(() => useGameLogic());
        
        await act(async () => {
            result.current.placeBet(MIN_BET - 1);
        });

        expect(result.current.bet).toBe(0);
        expect(result.current.balance).toBe(INITIAL_BALANCE);
    });

    it('clears bet correctly', async () => {
        const { result } = renderHook(() => useGameLogic());
        const initialBalance = result.current.balance;
        const betAmount = 50;

        await act(async () => {
            result.current.placeBet(betAmount);
        });

        // Verify bet was placed
        expect(result.current.bet).toBe(betAmount);
        expect(result.current.balance).toBe(initialBalance - betAmount);

        await act(async () => {
            result.current.clearBet();
        });

        // Verify bet was cleared and balance restored
        expect(result.current.bet).toBe(0);
        expect(result.current.balance).toBe(initialBalance);
    });



    it('transitions game state correctly when starting game', async () => {
        const { result } = renderHook(() => useGameLogic());
        const betAmount = 50;

        await act(async () => {
            // Place initial bet
            result.current.placeBet(betAmount);
        });

        expect(result.current.gameState).toBe('betting');

        await act(async () => {
            // Need to await the startGame promise
            const startGameResult = await result.current.startGame();
            expect(startGameResult).toBe(true);
        });

        // Now check the state has transitioned
        expect(result.current.gameState).toBe('playing');
        expect(result.current.anteCard).not.toBeNull();
        expect(result.current.dealerCard).not.toBeNull();
    })

    it('handles face up action correctly', async () => {
        const { result } = renderHook(() => useGameLogic());

        await act(async () => {
            result.current.placeBet(50);
            await result.current.startGame();
            await result.current.handlePlayerAction('faceUp');
        });

        const spotCard = result.current.spotCards[0];
        expect(spotCard).not.toBeNull();
        expect(spotCard?.isFaceUp).toBe(true);
    });

    it('handles face down action correctly', async () => {
        const { result } = renderHook(() => useGameLogic());

        await act(async () => {
            result.current.placeBet(50);
            await result.current.startGame();
            await result.current.handlePlayerAction('faceDown');
        });

        const spotCard = result.current.spotCards[0];
        expect(spotCard).not.toBeNull();
        expect(spotCard?.isFaceUp).toBe(false);
    });

    it('prevents concurrent actions during operations', async () => {
        const { result } = renderHook(() => useGameLogic());
        const betAmount = 50;

        // Place initial bet
        await act(async () => {
            result.current.placeBet(betAmount);
            await result.current.startGame();
        });

        // Try to make multiple rapid actions
        await act(async () => {
            // Start multiple actions almost simultaneously
            const action1 = result.current.handlePlayerAction('faceUp');
            const action2 = result.current.handlePlayerAction('faceUp');
            const action3 = result.current.handlePlayerAction('faceUp');
            
            await Promise.all([action1, action2, action3]);
        });

        // Only the first spot should have a card, others should be null
        expect(result.current.spotCards[0]).not.toBeNull();
        expect(result.current.spotCards[1]).toBeNull();
        expect(result.current.spotCards[2]).toBeNull();
    });


    it('calculates hand total correctly', async () => {
        const { result } = renderHook(() => useGameLogic());

        await act(async () => {
            result.current.placeBet(50);
            await result.current.startGame();
            await result.current.handlePlayerAction('faceUp');
        });

        const total = result.current.calculateHandTotal();
        expect(typeof total).toBe('number');
        expect(total).toBeGreaterThanOrEqual(0);
    });
});
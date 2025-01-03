import { SpotCard } from '../types/game.types';
import { RANKS, SUITS } from '../constants/game.constants';

export const getCardValue = (rank: string): number => {
    switch (rank.toLowerCase()) {
        case 'ace': return 1;
        case 'jack':
        case 'queen':
        case 'king': return 0;
        default: return parseInt(rank);
    }
};

export const dealRandomCard = (): SpotCard => {
    const ranks = RANKS;
    const suits = SUITS;
    return {
        suit: suits[Math.floor(Math.random() * suits.length)],
        rank: ranks[Math.floor(Math.random() * ranks.length)],
        isFaceUp: false
    };
};
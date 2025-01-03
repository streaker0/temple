export type GameState = 'betting' | 'playing' | 'gameOver';
export type PlayerAction = 'stand' | 'faceUp' | 'faceDown';
export type SpotCard = {
    suit: string;
    rank: string;
    isFaceUp: boolean;
} | null;

export interface SpotBet {
    faceUp: number;
    faceDown: number;
}

export interface GameState {
    balance: number;
    bet: number;
    anteBet: number;
    selectedDenomination: number;
    showChipButtons: boolean;
    gameState: GameState;
    currentSpotIndex: number;
    anteCard: SpotCard;
    dealerCard: SpotCard;
    spotCards: SpotCard[];
    spotBets: SpotBet[];
    dealerCards: SpotCard[];
}
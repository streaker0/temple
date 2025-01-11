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


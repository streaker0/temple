import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { GameBoard } from '../components/BettingPage/GameBoard';
import { SpotCard } from '../types/game.types';

// Mock the Card component
vi.mock('../components/CardProps/CardProps', () => ({
    default: vi.fn(({ suit, rank, isFaceUp, className }) => (
        <div data-testid="mocked-card"  className={className}>
            {isFaceUp ? `${rank} of ${suit}` : 'Face down card'}
        </div>
    ))
}));

describe('GameBoard', () => {
    const defaultSpotBets = Array(4).fill({ faceUp: 0, faceDown: 0 });
    const defaultSpotCards = Array(4).fill(null);

    const defaultProps = {
        gameState: 'betting' as const,
        anteCard: null,
        dealerCard: null,
        dealerCards: [],
        spotCards: defaultSpotCards,
        spotBets: defaultSpotBets,
        handTotal: 0,
        dealerTotal: 0,
        anteBet: 0,
        onBetClick: vi.fn(),
        outcome: null as 'win' | 'lose' | 'tie' | 'bust' | null
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('displays "PLACE YOUR BETS" message in betting state', () => {
        render(<GameBoard {...defaultProps} />);
        expect(screen.getByText('PLACE YOUR BETS')).toBeInTheDocument();
    });

    it('shows hand total when not in betting state', () => {
        render(<GameBoard {...defaultProps} gameState="playing" handTotal={15} />);
        expect(screen.getByText('15')).toBeInTheDocument();
    });

    it('shows dealer total in playing state', () => {
        render(<GameBoard {...defaultProps} gameState="playing" dealerTotal={17} />);
        expect(screen.getByText('17')).toBeInTheDocument();
    });

    it('displays ante bet amount correctly', () => {
        render(<GameBoard {...defaultProps} anteBet={50} />);
        expect(screen.getByText('$50')).toBeInTheDocument();
    });

    it('displays "Face Up" and "Face Down" text for zero bet spots', () => {
        render(<GameBoard {...defaultProps} />);
        const faceUpSpots = screen.getAllByText('Face up');
        const faceDownSpots = screen.getAllByText('Face Down');
        expect(faceUpSpots).toHaveLength(4);
        expect(faceDownSpots).toHaveLength(4);
    });

    it('calls onBetClick when clicking ante circle in betting state', () => {
        render(<GameBoard {...defaultProps} />);
        const anteCircle = screen.getByText('$0');
        anteCircle.click();
        expect(defaultProps.onBetClick).toHaveBeenCalled();
    });

    it('does not call onBetClick when not in betting state', () => {
        render(<GameBoard {...defaultProps} gameState="playing" />);
        const anteCircle = screen.getByText('$0');
        anteCircle.click();
        expect(defaultProps.onBetClick).not.toHaveBeenCalled();
    });

    it('displays dealer card correctly', () => {
        const dealerCard: SpotCard = {
            suit: 'heart',
            rank: 'king',
            isFaceUp: true
        };
        render(<GameBoard {...defaultProps} gameState="playing" dealerCard={dealerCard} />);
        expect(screen.getByText('king of heart')).toBeInTheDocument();
    });

    it('shows dealer cards in game over state', () => {
        const dealerCards = [
            { suit: 'heart', rank: 'king', isFaceUp: true },
            { suit: 'spade', rank: 'queen', isFaceUp: true }
        ];
        render(<GameBoard {...defaultProps} gameState="gameOver" dealerCards={dealerCards} />);
        
        expect(screen.getByText('king of heart')).toBeInTheDocument();
        expect(screen.getByText('queen of spade')).toBeInTheDocument();
    });

	it.each([
        ['win', true],
        ['lose', true],
        ['tie', false],
        ['bust', false]
    ])('applies correct CSS classes for %s outcome', (outcome, shouldHaveClass) => {
        const spotCards = [{ suit: 'heart', rank: '10', isFaceUp: true }];
        render(
            <GameBoard 
                {...defaultProps} 
                gameState="gameOver" 
                spotCards={spotCards} 
                outcome={outcome as 'win' | 'lose' | 'tie' | 'bust'} 
            />
        );
        
        const card = screen.getByTestId('mocked-card');
        if (shouldHaveClass) {
            expect(card.parentElement).toHaveClass('outcome-revealed');
        } else {
            expect(card.parentElement).not.toHaveClass('outcome-revealed');
        }
    });


    it('shows dealer total as dash when total is 0', () => {
        render(<GameBoard {...defaultProps} gameState="playing" dealerTotal={0} />);
        const dealerTotal = screen.getByText('-', { selector: '.dealer-total' });
        expect(dealerTotal).toBeInTheDocument();
    });

    it('shows hand total as dash when total is 0', () => {
        render(<GameBoard {...defaultProps} gameState="playing" handTotal={0} />);
		const handTotal = screen.getByText('-', { selector: '.hand-total' });
        expect(handTotal).toBeInTheDocument();
    });
});
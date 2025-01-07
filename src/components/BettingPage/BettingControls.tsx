import React from 'react';
import { GameState } from '../../types/game.types';

interface BettingControlsProps {
    gameState: GameState;
    balance: number;
    bet: number;
    lastBet: number;
    onRebet: () => void;
    onClearBet: () => void;
    onToggleChips: () => void;
    selectedDenomination: number;
    onDeal: () => void;
    onStand: () => void;
    onFaceUp: () => void;
    onFaceDown: () => void;
    onNewGame: () => void;
    isAnimating: boolean;
}

export const BettingControls: React.FC<BettingControlsProps> = ({
    gameState,
    balance,
    bet,
    lastBet,
    onRebet,
    onClearBet,
    onToggleChips,
    selectedDenomination,
    onDeal,
    onStand,
    onFaceUp,
    onFaceDown,
    onNewGame,
    isAnimating
}) => {
    const renderGameControls = () => {
        if (gameState === 'betting') {
            return (
                <>
                    <button 
                        onClick={onRebet}
                        disabled={isAnimating || lastBet === 0 || balance < lastBet}
                        className={`betting-button ${isAnimating ? 'disabled' : ''}`}
                    >
                        Rebet
                    </button>
                    <button 
                        onClick={onClearBet}
                        disabled={isAnimating || bet === 0}
                        className={`betting-button ${isAnimating ? 'disabled' : ''}`}
                    >
                        Clear Bet
                    </button>

                    <button 
                        onClick={onToggleChips}
                        disabled={isAnimating}
                        className={`betting-button ${isAnimating ? 'disabled' : ''}`}
                    >
                        Chip Selector (${selectedDenomination})
                    </button>

                    <button 
                        onClick={onDeal}
                        disabled={isAnimating || bet === 0}
                        className={`betting-button deal-button ${isAnimating ? 'disabled' : ''}`}
                    >
                        Deal
                    </button>
                </>
            );
        } else if (gameState === 'playing') {
            return (
                <>
                    <button 
                        onClick={onStand}
                        disabled={isAnimating}
                        className={`action-button ${isAnimating ? 'disabled' : ''}`}
                    >
                        Stand
                    </button>
                    <button 
                        onClick={onFaceUp}
                        disabled={isAnimating || balance < bet}
                        className={`action-button ${isAnimating ? 'disabled' : ''}`}
                    >
                        Face Up
                    </button>
                    <button 
                        onClick={onFaceDown}
                        disabled={isAnimating || balance < bet}
                        className={`action-button ${isAnimating ? 'disabled' : ''}`}
                    >
                        Face Down
                    </button>
                </>
            );
        } else if (gameState === 'gameOver') {
            return (
                <button 
                    onClick={onNewGame}
                    disabled={isAnimating}
                    className={`new-game-button ${isAnimating ? 'disabled' : ''}`}
                >
                    New Game
                </button>
            );
        }
        return null;
    };

    return (
        <div className={`controls ${isAnimating ? 'animating' : ''}`}>
            <div className="balance-bet-container">
                <div className="balance-display">
                    <div className="balance-label">BALANCE</div>
                    <div className="balance-value">${balance.toFixed(2)}</div>
                </div>
                <div className="bet-display">
                    <div className="bet-label">BET</div>
                    <div className="bet-value">${bet.toFixed(2)}</div>
                </div>
            </div>

            <div className="actions">
                {renderGameControls()}
            </div>
        </div>
    );
};
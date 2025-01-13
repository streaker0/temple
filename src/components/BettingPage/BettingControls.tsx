import React from 'react';
import { GameState } from '../../types/game.types';

interface BettingControlsProps {
    gameState: GameState;
	anteBet:number;
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
	isEndingGame: boolean;
}

export const BettingControls: React.FC<BettingControlsProps> = ({
    gameState,
    balance,
    bet,
	anteBet,
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
    isAnimating,
	isEndingGame
}) => {
	const isControlsDisabled = isAnimating || isEndingGame;
    const renderGameControls = () => {
        if (gameState === 'betting') {
            return (
                <>
                    <button 
                        onClick={onRebet}
                        disabled={isControlsDisabled || lastBet === 0 || balance < lastBet}
                        className={`betting-button ${isControlsDisabled ? 'disabled' : ''}`}
                    >
                        Rebet
                    </button>
                    <button 
                        onClick={onClearBet}
                        disabled={isControlsDisabled || bet === 0}
                        className={`betting-button ${isControlsDisabled ? 'disabled' : ''}`}
                    >
                        Clear Bet
                    </button>

                    <button 
                        onClick={onToggleChips}
                        disabled={isControlsDisabled}
                        className={`betting-button ${isControlsDisabled ? 'disabled' : ''}`}
                    >
                        Chip Selector (${selectedDenomination})
                    </button>

                    <button 
                        onClick={onDeal}
                        disabled={isControlsDisabled || bet === 0}
                        className={`betting-button deal-button ${isControlsDisabled ? 'disabled' : ''}`}
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
                        disabled={isControlsDisabled}
                        className={`action-button ${isControlsDisabled ? 'disabled' : ''}`}
                    >
                        Stand
                    </button>
                    <button 
                        onClick={onFaceUp}
                        disabled={isControlsDisabled || balance < anteBet}
                        className={`action-button ${isControlsDisabled ? 'disabled' : ''}`}
                    >
                        Face Up
                    </button>
                    <button 
                        onClick={onFaceDown}
                        disabled={isControlsDisabled || balance < anteBet}
                        className={`action-button ${isControlsDisabled ? 'disabled' : ''}`}
                    >
                        Face Down
                    </button>
                </>
            );
        } else if (gameState === 'gameOver') {
            return (
                <button 
                    onClick={onNewGame}
                    disabled={isControlsDisabled}
                    className={`new-game-button ${isControlsDisabled? 'disabled' : ''}`}
                >
                    New Game
                </button>
            );
        }
        return null;
    };

    return (
        <div className={`controls ${isControlsDisabled ? 'animating' : ''}`}>
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
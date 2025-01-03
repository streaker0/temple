import React from 'react';
import { GameState } from '../../types/game.types';

interface BettingControlsProps {
    gameState: GameState;
    balance: number;
    bet: number;
    onRebet: () => void;
    onClearBet: () => void;
    onToggleChips: () => void;
    selectedDenomination: number;
    onDeal: () => void;
    onStand: () => void;
    onFaceUp: () => void;
    onFaceDown: () => void;
}

export const BettingControls: React.FC<BettingControlsProps> = ({
    gameState,
    balance,
    bet,
    onRebet,
    onClearBet,
    onToggleChips,
    selectedDenomination,
    onDeal,
    onStand,
    onFaceUp,
    onFaceDown
}) => {
    return (
        <div className="controls">
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
                {gameState === 'betting' ? (
                    <>
                        <button onClick={onRebet}>Rebet</button>
                        <button onClick={onClearBet}>Clear Bet</button>
                        <button onClick={onToggleChips}>
                            Chip Selector (${selectedDenomination})
                        </button>
                        <button onClick={onDeal}>Deal</button>
                    </>
                ) : gameState === 'playing' ? (
                    <>
                        <button onClick={onStand}>Stand</button>
                        <button onClick={onFaceUp}>Face Up</button>
                        <button onClick={onFaceDown}>Face Down</button>
                    </>
                ) : null}
            </div>
        </div>
    );
};
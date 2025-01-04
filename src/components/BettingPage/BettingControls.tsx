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
	onNewGame
}) => {
	const renderGameControls = () =>{
		if (gameState === 'betting') {
			return (
				<>
					<button 
						onClick={onRebet}
						disabled={lastBet === 0 || balance < lastBet}
					>
						Rebet
					</button>
					<button onClick={onClearBet}>Clear Bet</button>

					<button 
						onClick={onToggleChips}
					>
						Chip Selector (${selectedDenomination})
					</button>

					<button 
						onClick={onDeal}
						disabled={bet === 0}
					>
						Deal
					</button>
				</>
			);
		} else if (gameState === 'playing') {
			return (
				<>
					<button onClick={onStand}>Stand</button>
					<button onClick={onFaceUp}>Face Up</button>
					<button onClick={onFaceDown}>Face Down</button>
				</>
			);
		}
		else if (gameState === 'gameOver') {
            return (
                <button 
                    onClick={onNewGame}
                    className="p-2 bg-green-700 text-white rounded hover:bg-green-600"
                >
                    New Game
                </button>
            );
        }
        return null;

	}
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
               {renderGameControls()}
            </div>
        </div>
    );
};
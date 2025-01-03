import React from 'react';
import Card from '../CardProps/CardProps';
import { SpotCard } from '../../types/game.types';

interface GameBoardProps {
    gameState: 'betting' | 'playing' | 'gameOver';
    anteCard: SpotCard;
    dealerCard: SpotCard;
    dealerCards: SpotCard[];
    spotCards: SpotCard[];
    spotBets: Array<{ faceUp: number; faceDown: number }>;
    handTotal: number;
    anteBet: number;
    onBetClick: () => void;
}

export const GameBoard: React.FC<GameBoardProps> = ({
    gameState,
    anteCard,
    dealerCard,
    dealerCards,
    spotCards,
    spotBets,
    handTotal,
    anteBet,
    onBetClick
}) => {
    return (
        <>
            <div className={`dealer-area ${gameState === 'playing' || gameState === 'gameOver' ? 'visible' : 'hidden'}`}>
                <div className="dealer-cards">
				{(gameState === 'playing' || gameState === 'gameOver') && (
                    <div className="dealer-total">
                        {handTotal > 0 ? handTotal : '-'}
                    </div>
                )}
                    {gameState === 'gameOver' ? (
                        dealerCards.map((card, index) => (
                            <Card
                                key={index}
                                suit={card?.suit}
                                rank={card?.rank}
                                isFaceUp={card?.isFaceUp}
                                className="dealer-card"
                            />
                        ))
                    ) : (
                        dealerCard && (
                            <Card
                                suit={dealerCard.suit}
                                rank={dealerCard.rank}
                                isFaceUp={dealerCard.isFaceUp}
                                className="dealer-card"
                            />
                        )
                    )}
                </div>
            </div>

            <div className={`middle-section ${gameState === 'playing' ? 'game-active' : ''}`}>
                {gameState === 'betting' && (
                    <div className="place-your-bets">PLACE YOUR BETS</div>
                )}
                {(gameState === 'playing' || gameState === 'gameOver') && (
                    <div className="hand-total">
                        {handTotal > 0 ? handTotal : '-'}
                    </div>
                )}

                <div className="betting-area">
                    <div className="betting-row">
                        <div className="ante-container">
                            <div className="ante-label">Ante</div>
                            <div
                                className={`ante-circle ${gameState === 'betting' ? 'active' : ''}`}
                                onClick={gameState === 'betting' ? onBetClick : undefined}
                            >
                                ${anteBet}
                            </div>
                            {anteCard && (
                                <Card
                                    suit={anteCard.suit}
                                    rank={anteCard.rank}
                                    isFaceUp={anteCard.isFaceUp}
                                    className="ante-card"
                                />
                            )}
                        </div>

                        {Array(4).fill(null).map((_, spotIndex) => (
                            <div key={spotIndex} className="bet-spot-column">
                                <div className="card-space">
                                    {spotCards[spotIndex] && (
                                        <Card
                                            suit={spotCards[spotIndex]!.suit}
                                            rank={spotCards[spotIndex]!.rank}
                                            isFaceUp={spotCards[spotIndex]!.isFaceUp}
                                        />
                                    )}
                                </div>

                                <div className="spot-circle face-down">
                                    ${spotBets[spotIndex].faceDown}
                                </div>

                                <div className="spot-circle face-up">
                                    ${spotBets[spotIndex].faceUp}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};
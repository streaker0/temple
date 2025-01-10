import React, { useState, useEffect } from 'react';
import Card from '../CardProps/CardProps';
import './BettingPage.css';
import { SpotCard } from '../../types/game.types';

interface GameBoardProps {
    gameState: 'betting' | 'playing' | 'gameOver';
    anteCard: SpotCard;
    dealerCard: SpotCard;
    dealerCards: SpotCard[];
    spotCards: SpotCard[];
    spotBets: Array<{ faceUp: number; faceDown: number }>;
    handTotal: number;
    dealerTotal: number;
    anteBet: number;
    onBetClick: () => void;
    outcome?: 'win' | 'lose' | 'tie' | 'bust' | null;
}

export const GameBoard: React.FC<GameBoardProps> = ({
    gameState,
    anteCard,
    dealerCard,
    dealerCards,
    spotCards,
    spotBets,
    handTotal,
    dealerTotal,
    anteBet,
    onBetClick,
    outcome
}) => {
    const [showDealer, setShowDealer] = useState(false);
    const [animateSpots, setAnimateSpots] = useState<boolean[]>([]);

    useEffect(() => {
        if (gameState === 'playing' || gameState === 'gameOver') {
            setShowDealer(true);
        }
    }, [gameState]);

    useEffect(() => {
        // Reset animation state when cards change or game state changes
        setAnimateSpots(Array(4).fill(false));
        
        if (gameState === 'playing') {
            // Animate spots sequentially with proper timing
            const animationTimeout = setTimeout(() => {
                spotCards.forEach((_, index) => {
                    setTimeout(() => {
                        setAnimateSpots(prev => {
                            const newState = [...prev];
                            newState[index] = true;
                            return newState;
                        });
                    }, index * 300); // Increased delay between spots for smoother animation
                });
            }, 100); // Small initial delay

            return () => clearTimeout(animationTimeout);
        }
    }, [spotCards, gameState]);


    return (
        <>
            <div className={`dealer-area ${showDealer ? 'visible' : 'hidden'}`}>
                <div className="dealer-cards">
                    {(gameState === 'playing' || gameState === 'gameOver') && (
                        <div className="dealer-total">
                            {dealerTotal > 0 ? dealerTotal : '-'}
                        </div>
                    )}
                    {gameState === 'gameOver' ? (
                        dealerCards.map((card, index) => {
                            // Determine if this card contributed to a winning/losing hand
                            const isWinningDealer = outcome === 'lose';
                            const isLosingDealer = outcome === 'win'
                            return (
                                <Card
                                    key={index}
                                    suit={card?.suit}
                                    rank={card?.rank}
                                    isFaceUp={card?.isFaceUp}
                                    className={`dealer-card revealed ${outcome ? 'outcome-revealed' : ''} ${isWinningDealer ? 'winning-card pulse' : ''} ${isLosingDealer ? 'losing-card' : ''}`}
                                    isDealt={true}
                                    isWinning={isWinningDealer}
                                    isLosing={isLosingDealer}
                                />
                            );
                        })
                    ) : (
                        dealerCard && (
                            <Card
                                suit={dealerCard.suit}
                                rank={dealerCard.rank}
                                isFaceUp={dealerCard.isFaceUp}
                                className="dealer-card"
                                isDealt={true}
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
                                className={`ante-circle ${gameState === 'betting' ? 'active' : ''} ${anteBet > 0 ? 'chip-placed' : ''}`}
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
                                    isDealt={true}
                                    isWinning={outcome === 'win'}
                                    isLosing={outcome === 'lose'}
                                />
                            )}
                        </div>

                        {Array(4).fill(null).map((_, spotIndex) => (
                            <div key={spotIndex} className="bet-spot-column">
                                <div className="card-space">
                                    {spotCards[spotIndex] && (
                                          <div className={outcome && outcome !== 'tie' && outcome !== 'bust' ? 'outcome-revealed' : ''}>
										  <Card
											  suit={spotCards[spotIndex]!.suit}
											  rank={spotCards[spotIndex]!.rank}
											  isFaceUp={spotCards[spotIndex]!.isFaceUp}
											  isDealt={animateSpots[spotIndex]}
											  isWinning={outcome === 'win'}
											  isLosing={outcome === 'lose'}
											  className={outcome === 'win' ? 'pulse' : ''}
										  />
									  </div>
                                    )}
                                </div>

                                <div className={`spot-circle face-down ${spotBets[spotIndex].faceDown > 0 ? 'chip-placed' : ''}`}>
                                    {spotBets[spotIndex].faceDown === 0 ? "Face Down":" $"+ spotBets[spotIndex].faceDown}
                                </div>

                                <div className={`spot-circle face-up ${spotBets[spotIndex].faceUp > 0 ? 'chip-placed' : ''}`}>
                                    {spotBets[spotIndex].faceUp === 0 ? "Face up":" $"+ spotBets[spotIndex].faceUp }
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};
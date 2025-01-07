import React from 'react';
import { BettingControls } from './BettingControls';
import { ChipSelector } from './ChipSelector';
import { GameBoard } from './GameBoard';
import { Header } from './Header';
import { MessageDisplay } from '../Modal/MessageDisplay';
import { useGame } from '../../context/GameContext';
import './BettingPage.css';


const BettingPage: React.FC = () => {
    const {
        balance,
        bet,
        lastBet,
        anteBet,
        selectedDenomination,
        showChipButtons,
        setShowChipButtons,
        gameState,
        anteCard,
        dealerCard,
        spotCards,
        spotBets,
        dealerCards,
        dealerTotal,
        gameOutcome,
        isAnimating,
        message,
        setSelectedDenomination,
        calculateHandTotal,
        placeBet,
        clearBet,
        startGame,
        handlePlayerAction,
        handleRebet,
        startNewGame
    } = useGame();

    return (
        <div className="container">
            <Header 
                onHomeClick={() => {
                    if (bet > 0) {
                        clearBet();
						startNewGame() // Return any current bets to balance
                    }
                    window.location.href = '/';
                }}
            />
            <MessageDisplay message={message} isAnimating={isAnimating} />
            <GameBoard
                gameState={gameState}
                anteCard={anteCard}
                dealerCard={dealerCard}
                dealerCards={dealerCards}
                spotCards={spotCards}
                spotBets={spotBets}
                handTotal={calculateHandTotal()}
                dealerTotal={dealerTotal}
                anteBet={anteBet}
                onBetClick={() => !isAnimating && placeBet(selectedDenomination)}
                outcome={gameOutcome}
            />
            <ChipSelector
                show={showChipButtons && gameState === 'betting' && !isAnimating}
                selectedDenomination={selectedDenomination}
                onSelect={setSelectedDenomination}
            />
            <BettingControls
                gameState={gameState}
                balance={balance}
                bet={bet}
                lastBet={lastBet}
                onRebet={() => !isAnimating && handleRebet()}
                onClearBet={() => !isAnimating && clearBet()}
                onToggleChips={() => !isAnimating && setShowChipButtons(!showChipButtons)}
                selectedDenomination={selectedDenomination}
                onDeal={() => !isAnimating && startGame()}
                onStand={() => !isAnimating && handlePlayerAction('stand')}
                onFaceUp={() => !isAnimating && handlePlayerAction('faceUp')}
                onFaceDown={() => !isAnimating && handlePlayerAction('faceDown')}
                onNewGame={() => !isAnimating && startNewGame()}
                isAnimating={isAnimating}
            />
        </div>
    );
};

export default BettingPage;
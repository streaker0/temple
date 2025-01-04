import React from 'react';
import { useGameLogic } from '../../hooks/useGameLogic';
import { BettingControls } from './BettingControls';
import { ChipSelector } from './ChipSelector';
import { GameBoard } from './GameBoard';
import { Header } from './Header';
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
        setSelectedDenomination,
        calculateHandTotal,
        placeBet,
        clearBet,
        startGame,
        handlePlayerAction,
		handleRebet,
		startNewGame
    } = useGameLogic();

    return (
        <div className="container">
            <Header />
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
                onBetClick={() => placeBet(selectedDenomination)}
            />
            <ChipSelector
                show={showChipButtons && gameState === 'betting'}
                selectedDenomination={selectedDenomination}
                onSelect={setSelectedDenomination}
            />
            <BettingControls
                gameState={gameState}
                balance={balance}
                bet={bet}
				lastBet={lastBet}
                onRebet={() => handleRebet()}
                onClearBet={clearBet}
                onToggleChips={() => setShowChipButtons(!showChipButtons)}
                selectedDenomination={selectedDenomination}
                onDeal={startGame}
                onStand={() => handlePlayerAction('stand')}
                onFaceUp={() => handlePlayerAction('faceUp')}
                onFaceDown={() => handlePlayerAction('faceDown')}
				onNewGame={()=>startNewGame()}
            />
        </div>
    );
};

export default BettingPage;
import React from 'react';
import { BettingControls } from './BettingControls';
import { ChipSelector } from './ChipSelector';
import { GameBoard } from './GameBoard';
import { Header } from './Header';
import { MessageDisplay } from '../Modal/MessageDisplay';
import TableBackground from './TableBackground';
import { useGame } from '../../context/GameContext';
import './BettingPage.css';

const Layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="w-screen h-screen overflow-hidden bg-gradient-to-b from-emerald-900 via-emerald-800 to-emerald-900">
            <div className="w-full h-full overflow-auto flex items-center justify-center p-4">
                {children}
            </div>
        </div>
    )
}

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
	
    const handleClickOutside = () => {
        setShowChipButtons(false);
    };

    return (
        <Layout>
            <div className="w-full max-w-5xl min-h-[700px] relative overflow-hidden rounded-xl border-4 border-yellow-600">
                <div className="absolute inset-0">
                    <TableBackground />
                </div>
                <div className="relative z-10 h-full flex flex-col p-6">
                    <Header 
                        onHomeClick={() => {
                            if (bet > 0) {
                                clearBet();
                                startNewGame();
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
                        onClickOutside={handleClickOutside}
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
            </div>
        </Layout>
    );
};

export default BettingPage;
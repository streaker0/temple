import { useState } from 'react';
import { useBalanceEffect } from './useBalanceEffect';
import { GameState, PlayerAction, SpotCard, SpotBet } from '../types/game.types';
import { dealRandomCard, getCardValue } from '../utils/cardUtils';
import { determineGameOutcome } from '../utils/gameEndUtils';
import { INITIAL_BALANCE, MAX_BET, MIN_BET, DEALER_MIN_TOTAL, MAX_CARDS, NUM_SPOTS } from '../constants/game.constants';

export const useGameLogic = () => {
	const [balance, setBalance] = useState(() => {
		const savedBalance = localStorage.getItem('gameBalance');
		return savedBalance ? parseFloat(savedBalance) : INITIAL_BALANCE;
	});
	const [bet, setBet] = useState(0);
	const [anteBet, setAnteBet] = useState(0);
	const [selectedDenomination, setSelectedDenomination] = useState(10);
	const [showChipButtons, setShowChipButtons] = useState(false);
	const [gameState, setGameState] = useState<GameState>('betting');
	const [currentSpotIndex, setCurrentSpotIndex] = useState(0);
	const [anteCard, setAnteCard] = useState<SpotCard>(null);
	const [dealerCard, setDealerCard] = useState<SpotCard>(null);
	const [spotCards, setSpotCards] = useState<SpotCard[]>(Array(NUM_SPOTS).fill(null));
	const [spotBets, setSpotBets] = useState<SpotBet[]>(
		Array(4).fill({ faceUp: 0, faceDown: 0 })
	);
	const [dealerCards, setDealerCards] = useState<SpotCard[]>([]);
	const [dealerTotal, setDealerTotal] = useState(0);
	const [lastBet, setLastBet] = useState(0);
	const [gameOutcome, setGameOutcome] = useState<'win' | 'lose' | 'tie' | 'bust' | null>(null);
	const [isAnimating, setIsAnimating] = useState(false);
	const [message, setMessage] = useState<string>('');
	const [frontBet, setFrontBet] = useState(0);
	const [backBet, setBackBet] = useState(0)

	useBalanceEffect(balance);

	const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

	const startNewGame = () => {
		setGameState('betting');
		setCurrentSpotIndex(0);
		setAnteCard(null);
		setDealerCard(null);
		setSpotCards(Array(NUM_SPOTS).fill(null));
		setSpotBets(Array(4).fill({ faceUp: 0, faceDown: 0 }));
		setDealerCards([]);
		setDealerTotal(0);
		setBet(0);
		setAnteBet(0);
		setBackBet(0);
		setFrontBet(0);
		setIsAnimating(false);
		setMessage(''); // Clear any existing messages
		setGameOutcome(null); // Reset game outcome
	}

	const handleGameOver = async (updatedSpotCards: SpotCard[], finalBets: SpotBet[]) => {
		await sleep(500)
		setGameState('gameOver');
		let currentDealerCards: SpotCard[] = [];
		let finalDealerTotal = dealerTotal;

		// Handle dealer's cards first
		setMessage("Dealer's turn...");
		if (dealerCard) {
			currentDealerCards = [{ ...dealerCard, isFaceUp: true }];
			setDealerCards(currentDealerCards);
			await sleep(1000);
		}

		while (finalDealerTotal < DEALER_MIN_TOTAL && currentDealerCards.length < MAX_CARDS) {
			setMessage("Dealer draws a card...");
			await sleep(1000);
			const newCard = dealRandomCard();
			newCard!.isFaceUp = true;
			currentDealerCards.push(newCard);
			finalDealerTotal += getCardValue(newCard!.rank);
			setDealerCards([...currentDealerCards]);
			setDealerTotal(finalDealerTotal);
			await sleep(1000);
		}

		// Now reveal player's cards
		setMessage("Revealing player's cards...");
		await sleep(1000);

		// First reveal ante card if face down
		if (anteCard && !anteCard.isFaceUp) {
			await sleep(1000);
			setAnteCard(prev => prev ? { ...prev, isFaceUp: true } : null);
		}

		// Reveal all spot cards
		if (updatedSpotCards.some(card => card && !card.isFaceUp)) {
			const newSpotCards = updatedSpotCards.map(card => 
				card && !card.isFaceUp ? { ...card, isFaceUp: true } : card
			);
			setSpotCards(newSpotCards);
			await sleep(1000);
		}

		// Calculate final total after all cards are revealed
		const playerTotal = calculateFinalTotal(updatedSpotCards);
		const outcome = determineGameOutcome(playerTotal, finalDealerTotal);
		setGameOutcome(outcome);


		// Set and display the outcome message first
		let winnerMessage = '';
		if (outcome === 'win') {
			winnerMessage = 'Player wins!';
		} else if (outcome === 'lose') {
			winnerMessage = 'Dealer wins!';
		} else if (outcome === 'tie') {
			winnerMessage = "It's a tie!";
		} else if (outcome === 'bust') {
			winnerMessage = 'Both bust!!';
		}
		setMessage(winnerMessage);
		
		await sleep(2000); // Give time for outcome message to be seen
		
		// Now start the winning animation
		setIsAnimating(true);

		const totalFrontBet = frontBet + finalBets[3].faceUp ;  // Face up bets
		const totalBackBet = backBet + finalBets[3].faceDown;;    // Face down bets
		const totalBet = totalFrontBet + totalBackBet  //
		

		switch (outcome) {
			 //
			case 'win':
				const winnings = (totalFrontBet * 2) + (totalBackBet * 3); // Double the bet for a win
				setBalance(prev => prev + winnings);
				await sleep(1500);
				setMessage(`Congratulations! You won $${winnings.toFixed(2)}!`);
				break;
			case 'lose':
				await sleep(1500);
				setMessage(`Sorry, you lost $${totalBet.toFixed(2)}.`);
				break;
			case 'tie':
				await sleep(1500);
				setBalance(prev => prev + bet); // Return the original bet
				setMessage("It's a tie! Your bet has been returned.");
				break;
			case 'bust':
				await sleep(1500);
				setBalance(prev => prev + (bet * 0.5));
				setMessage(`Both Bust!! You lost $${(bet * 0.5).toFixed(2)}.`);
				break;

			default:
				await sleep(1500);
				setMessage("Dealer wins. Better luck next time!");
		}

		setLastBet(anteBet);
		await sleep(3000); // Give time for message to be seen
		setIsAnimating(false);



		// On lose, bet is already deducted
	};
	const handleRebet = () => {
		if (gameState !== 'betting' || lastBet === 0 || balance < lastBet) return;
		const newBalace = balance - lastBet;
		if (newBalace >= 0) {
			setBalance(newBalace);
			setBet(lastBet);
			setAnteBet(lastBet);
		}
	}

	const calculateHandTotal = () => {
		const spotTotal = spotCards.reduce((total, card) => {
			if (!card || !card.isFaceUp) return total;
			return total + getCardValue(card.rank);
		}, 0);

		const anteValue = anteCard && anteCard.isFaceUp ? getCardValue(anteCard.rank) : 0;

		return spotTotal + anteValue;
	};

	const calculateFinalTotal = (cards: SpotCard[]) => {
		// Calculate total including all cards regardless of face-up status
		const spotTotal = cards.reduce((total, card) => {
			if (!card) return total;
			const value = getCardValue(card.rank);
			return total + value;
		}, 0);
	
		const anteValue = anteCard ? getCardValue(anteCard.rank) : 0;
		return spotTotal + anteValue;
	};

	const placeBet = (amount: number) => {
		if (gameState !== 'betting') return;

		const newBet = bet + amount;
		const newBalance = balance - amount;

		if (newBet <= balance && newBet <= MAX_BET && newBalance >= 0 && newBet >= MIN_BET) {
			setAnteBet(newBet);
			setBet(newBet);
			setBalance(newBalance);
		}
	};

	const clearBet = () => {
		if (gameState !== 'betting') return;
		setBalance(prev => prev + bet);
		setBet(0);
		setAnteBet(0);
	};

	const startGame = async () => {
		if (bet <= 0) return false;
		setBackBet(prev => prev + anteBet)



		setMessage("Dealing cards...");
		setIsAnimating(true);

		// Deal ante card with animation
		const newAnteCard = dealRandomCard();
		setAnteCard(newAnteCard);
		await sleep(1000);

		// Deal dealer's card with animation
		setMessage("Dealer's card...");
		let newDealerCard = dealRandomCard();
		newDealerCard!.isFaceUp = true;
		setDealerCard(newDealerCard);
		setDealerTotal(getCardValue(newDealerCard!.rank));
		await sleep(1000);

		setGameState('playing');
		setCurrentSpotIndex(0);
		setIsAnimating(false);
		return true;
	};

// In useGameLogic.ts


const placeCard = async (action: PlayerAction) => {
    const newCard = dealRandomCard();
    newCard!.isFaceUp = action === 'faceUp';
    
    // Create our final objects that we'll return
    const finalCards = [...spotCards];
    finalCards[currentSpotIndex] = newCard;
    
    const finalBets = [...spotBets];
    finalBets[currentSpotIndex] = {
        ...finalBets[currentSpotIndex],
        [action === 'faceUp' ? 'faceUp' : 'faceDown']: anteBet
    };
    
    // Use callbacks for state updates (for UI)
    setSpotCards(prevCards => {
        const updatedCards = [...prevCards];
        updatedCards[currentSpotIndex] = newCard;
        return updatedCards;
    });
    
    setSpotBets(prevBets => {
        const updatedBets = [...prevBets];
        updatedBets[currentSpotIndex] = {
            ...updatedBets[currentSpotIndex],
            [action === 'faceUp' ? 'faceUp' : 'faceDown']: anteBet
        };
        return updatedBets;
    });
    
    if (action === 'faceUp') {
        setFrontBet(prev => prev + anteBet);
    } else {
        setBackBet(prev => prev + anteBet);
    }
    
    setBalance(prev => prev - anteBet);
    setBet(prev => prev + anteBet);
    
    return { finalCards, finalBets, newCard };
};

const handlePlayerAction = async (action: PlayerAction) => {
    if (isAnimating) return;

    switch (action) {
        case 'stand':
            await handleGameOver(spotCards, spotBets);
            break;
            
        case 'faceUp':
        case 'faceDown':
            if (balance >= anteBet && currentSpotIndex < 4) {
                setIsAnimating(true);
                
                try {
                    const { finalCards, finalBets} = await placeCard(action);
                    
                    // Handle last position (index 3)
                    if (currentSpotIndex === 3) {
                        setCurrentSpotIndex(prev => {
                            if (prev === 3) {
                                setTimeout(async () => {
                                    // Pass both finalCards and finalBets to handleGameOver
                                    await handleGameOver(finalCards, finalBets);
                                }, 0);
                                return 4;
                            }
                            return prev;
                        });
                    } else {
                        setTimeout(() => {
                            setCurrentSpotIndex(prev => prev + 1);
                            setIsAnimating(false);
                        }, 100);
                    }
                } catch (error) {
                    console.error('Error in handlePlayerAction:', error);
                    setIsAnimating(false);
                }
            }
            break;
    }
};

	return {
		balance,
		bet,
		anteBet,
		selectedDenomination,
		showChipButtons,
		setShowChipButtons,
		gameState,
		currentSpotIndex,
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
		lastBet,
		handleRebet,
		startNewGame,
		gameOutcome,
		isAnimating,
		message,
		setBalance
	};
};
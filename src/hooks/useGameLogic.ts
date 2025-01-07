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

	const handleGameOver = async () => {
		setGameState('gameOver');
		setIsAnimating(true); // Ensure animation state is true for message display and button locking
		let currentDealerCards: SpotCard[] = [];
		let finalDealerTotal = dealerTotal;

		setMessage("Revealing player's cards...");

		if (anteCard && !anteCard.isFaceUp) {
			await sleep(1000);
			setAnteCard(prev => prev ? { ...prev, isFaceUp: true } : null);
		}

		// Ensure all spot cards are revealed properly
		const revealSpotCards = async () => {
			for (let i = 0; i < spotCards.length; i++) {
				const card = spotCards[i];
				if (card && !card.isFaceUp) {
					await sleep(1000); // Wait before flipping each card
					setSpotCards(prev => {
						const newCards = [...prev];
						if (newCards[i]) {
							newCards[i] = { ...newCards[i]!, isFaceUp: true };
						}
						return newCards;
					});
				}
			}
		};
		await revealSpotCards();



		await sleep(1000);
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



		const playerTotal = calculateFinalTotal();
		const outcome = determineGameOutcome(playerTotal, finalDealerTotal);
		setGameOutcome(outcome);

		// Set the appropriate winner message
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

		await sleep(1500); // Increased delay for better timing
		// Keep isAnimating true until message is displayed and all animations complete
		
		
		
		switch (outcome) {
			case 'win':
				const winnings = (frontBet *2 ) + (backBet * 3); // Double the bet for a win
				setBalance(prev => prev + winnings);
				setMessage(`Congratulations! You won $${winnings.toFixed(2)}!`);
				break;
			case 'lose':
				setMessage(`Sorry, you lost $${bet.toFixed(2)}.`);
				break;
			case 'tie':
				setBalance(prev => prev + bet); // Return the original bet
				setMessage("It's a tie! Your bet has been returned.");
				break;
			case 'bust':
				setBalance(prev => prev + (bet*0.5));
				setMessage(`Both Bust!! You lost $${(bet * 0.5).toFixed(2)}.`);
				break;
			
			default:
				setMessage("Dealer wins. Better luck next time!");
		}

		setLastBet(anteBet);
		await sleep(1000); // Give time for message to be seen
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

	const calculateFinalTotal = () => {
		// Calculate total including all cards regardless of face-up status
		const spotTotal = spotCards.reduce((total, card) => {
			if (!card) return total;
			return total + getCardValue(card.rank);
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
		setBackBet(prev =>prev + anteBet)
		


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

	const handlePlayerAction = async (action: PlayerAction) => {
		if (isAnimating) return;

		if (currentSpotIndex >= 4) {
			await handleGameOver();
			return;
		}

		switch (action) {
			case 'stand':
				await handleGameOver();
				break;
			case 'faceUp':
			case 'faceDown':
				if (balance >= anteBet) {
					setIsAnimating(true);
					try {
						const newCard = dealRandomCard();
						if (action === 'faceUp') {
							newCard!.isFaceUp = true;
						}

						// Update cards while preserving existing bets
						const updatedCards = [...spotCards];
						const oppositeAction = action === 'faceUp' ? 'faceDown' : 'faceUp';
						
						// Only allow one card per spot
						if (spotBets[currentSpotIndex][oppositeAction] > 0) {
							setIsAnimating(false);
							return;
						}
						
						// Set message and update card
						setMessage("Dealing card...");
						updatedCards[currentSpotIndex] = newCard;
						setSpotCards(updatedCards);

						// Update bets while preserving existing bets
						const updatedBets = [...spotBets];
						updatedBets[currentSpotIndex] = {
							...updatedBets[currentSpotIndex],
							[action === 'faceUp' ? 'faceUp' : 'faceDown']: anteBet
						};
						setSpotBets(updatedBets);
						action === 'faceUp' ? setFrontBet(prev => prev + anteBet) : setBackBet(prev => prev + anteBet);
					
						

						setBalance(prev => prev - anteBet);
						setBet(prev => prev + anteBet);
						
						// Wait for animation to complete
						await sleep(1000);
						setMessage("");
						
						setCurrentSpotIndex(prev => prev + 1);

						if (currentSpotIndex === 3) {
							await handleGameOver();
						} else {
							setIsAnimating(false);
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
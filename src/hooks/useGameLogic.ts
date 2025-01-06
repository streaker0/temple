import { useState } from 'react';
import { GameState, PlayerAction, SpotCard, SpotBet } from '../types/game.types';
import { dealRandomCard, getCardValue } from '../utils/cardUtils';
import { determineGameOutcome } from '../utils/gameEndUtils';
import { INITIAL_BALANCE, MAX_BET, MIN_BET, DEALER_MIN_TOTAL, MAX_CARDS, NUM_SPOTS } from '../constants/game.constants';

export const useGameLogic = () => {
	const [balance, setBalance] = useState(INITIAL_BALANCE);
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

	}

	const handleGameOver = () => {
		setGameState('gameOver');
		let currentDealerCards: SpotCard[] = [];
		let finalDealerTotal = dealerTotal;
		console.log(finalDealerTotal);


		if (dealerCard) {
			currentDealerCards = [{ ...dealerCard, isFaceUp: true }];
		}

		while (finalDealerTotal < DEALER_MIN_TOTAL && currentDealerCards.length < MAX_CARDS) {
			const newCard = dealRandomCard();
			newCard!.isFaceUp = true;
			currentDealerCards.push(newCard);
			finalDealerTotal += getCardValue(newCard!.rank);
		}



		setDealerCards(currentDealerCards);
		setDealerTotal(finalDealerTotal);

		setAnteCard(prev => prev ? { ...prev, isFaceUp: true } : null);
		setSpotCards(prev => prev.map(card => card ? { ...card, isFaceUp: true } : null));

		const playerTotal = calculateFinalTotal();
		console.log("player total" + playerTotal);

		const outcome = determineGameOutcome(playerTotal, finalDealerTotal);

		setLastBet(anteBet);

		if (outcome === 'win') {
			setBalance(prev => prev + bet * 2);
			alert("Player wins!");
			// Return bet plus winnings
		} else if (outcome === 'bust') {
			setBalance(prev => prev + Math.floor(bet * 0.5));  // Return half bet
			alert("Both bust!");

		}
		else if (outcome === 'tie') {
			setBalance(prev => prev + bet);  // Return bet
			alert("Tie!");

		} else
			alert("Dealer wins!");


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
		console.log("spot total = " + spotTotal + " ante value = " + anteValue);

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

	const startGame = () => {
		if (bet <= 0) return false;

		setAnteCard(dealRandomCard());
		let newCard = dealRandomCard();
		newCard!.isFaceUp = true;
		setDealerCard(newCard);
		setDealerTotal(getCardValue(newCard!.rank));
		setGameState('playing');
		setCurrentSpotIndex(0);
		return true;
	};

	const handlePlayerAction = (action: PlayerAction) => {
		if (currentSpotIndex >= 4) {
			handleGameOver();
			return;
		}

		switch (action) {
			case 'stand':
				handleGameOver();
				break;
			case 'faceUp':
			case 'faceDown':
				if (balance >= anteBet) {
					const newCard = dealRandomCard();
					if (action === 'faceUp') {
						newCard!.isFaceUp = true;
					}

					setSpotCards(prev => {
						const newCards = [...prev];
						newCards[currentSpotIndex] = newCard;
						return newCards;
					});

					setSpotBets(prev => {
						const newBets = [...prev];
						newBets[currentSpotIndex] = {
							...newBets[currentSpotIndex],
							[action === 'faceUp' ? 'faceUp' : 'faceDown']: anteBet
						};
						return newBets;
					});

					setBalance(prev => prev - anteBet);
					setBet(prev => prev + anteBet);
					setCurrentSpotIndex(prev => prev + 1);

					if (currentSpotIndex === 3) {
						handleGameOver();
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
		startNewGame
	};
};
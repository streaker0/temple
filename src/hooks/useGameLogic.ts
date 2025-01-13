// src/hooks/useGameLogic.ts
import { useState, useCallback } from 'react';
import { GameState, PlayerAction, SpotCard, SpotBet } from '../types/game.types';
import { dealRandomCard, getCardValue } from '../utils/cardUtils';
import { determineGameOutcome } from '../utils/gameEndUtils';
import { MAX_BET, DEALER_MIN_TOTAL, MAX_CARDS, NUM_SPOTS } from '../constants/game.constants';

// Types
interface ChipState {
  selectedDenomination: number;
  showChipButtons: boolean;
}

interface BettingState {
  bet: number;
  anteBet: number;
  frontBet: number;
  backBet: number;
  lastBet: number;
}

interface GameBoard {
  anteCard: SpotCard;
  dealerCard: SpotCard;
  spotCards: SpotCard[];
  spotBets: SpotBet[];
  dealerCards: SpotCard[];
  dealerTotal: number;
}

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const useGameLogic = (initialBalance :number, setFirestoreBalance: (newBalance: number) => Promise<void>) => {
  // Core game state
  const [balance, setLocalBalance] = useState(initialBalance);
  const [gameState, setGameState] = useState<GameState>('betting');
  const [currentSpotIndex, setCurrentSpotIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isEndingGame, setIsEndingGame] = useState(false);
  const [message, setMessage] = useState('');
  const [gameOutcome, setGameOutcome] = useState<'win' | 'lose' | 'tie' | 'bust' | null>(null);
  

  // Game state
  const [chipState, setChipState] = useState<ChipState>({
	selectedDenomination: 10,
	showChipButtons: false
  });

  const [bettingState, setBettingState] = useState<BettingState>({
	bet: 0,
	anteBet: 0,
	frontBet: 0,
	backBet: 0,
	lastBet: 0
  });

  const [board, setBoard] = useState<GameBoard>({
	anteCard: null,
	dealerCard: null,
	spotCards: Array(NUM_SPOTS).fill(null),
	spotBets: Array(NUM_SPOTS).fill({ faceUp: 0, faceDown: 0 }),
	dealerCards: [],
	dealerTotal: 0
  });

  // Game state management
  const startNewGame = useCallback(() => {
	if(isEndingGame || isAnimating) return;
	setGameState('betting');
	setCurrentSpotIndex(0);
	setIsAnimating(false);
	setMessage('');
	setGameOutcome(null);
	
	setBettingState({
	  bet: 0,
	  anteBet: 0,
	  frontBet: 0,
	  backBet: 0,
	  lastBet: 0
	});

	setBoard({
	  anteCard: null,
	  dealerCard: null,
	  spotCards: Array(NUM_SPOTS).fill(null),
	  spotBets: Array(NUM_SPOTS).fill({ faceUp: 0, faceDown: 0 }),
	  dealerCards: [],
	  dealerTotal: 0
	});
  }, []);

  // Betting functions
  const placeBet = useCallback(async (amount: number) => {
	if (gameState !== 'betting') return;

	const newBet = bettingState.bet + amount;
	const newBalance = balance - amount;

	if (newBet <= MAX_BET && newBalance >= 0) {
	  setBettingState(prev => ({
		...prev,
		bet: newBet,
		anteBet: newBet
	  }));
	  setFirestoreBalance(newBalance);
	}
  }, [balance, bettingState.bet, gameState]);

  // Card placement logic
  const placeCard = useCallback(async (action: PlayerAction) => {
	const newCard = { ...dealRandomCard()!, isFaceUp: action === 'faceUp' };
	
	const finalCards = [...board.spotCards];
	finalCards[currentSpotIndex] = newCard;
	
	const finalBets = [...board.spotBets];
	finalBets[currentSpotIndex] = {
	  ...finalBets[currentSpotIndex],
	  [action === 'faceUp' ? 'faceUp' : 'faceDown']: bettingState.anteBet
	};
	
	setBoard(prev => ({
	  ...prev,
	  spotCards: finalCards,
	  spotBets: finalBets
	}));
	
	setBettingState(prev => ({
	  ...prev,
	  [action === 'faceUp' ? 'frontBet' : 'backBet']: prev[action === 'faceUp' ? 'frontBet' : 'backBet'] + prev.anteBet,
	  bet: prev.bet + prev.anteBet
	}));
	
	setFirestoreBalance(balance - bettingState.anteBet);
	
	return { finalCards, finalBets };
  }, [board.spotCards, board.spotBets, currentSpotIndex, bettingState.anteBet, balance]);

  // Game calculations
  const calculateHandTotal = useCallback(() => {
	const spotTotal = board.spotCards.reduce((total, card) => {
	  if (!card || !card.isFaceUp) return total;
	  return total + getCardValue(card.rank);
	}, 0);

	return spotTotal + (board.anteCard?.isFaceUp ? getCardValue(board.anteCard.rank) : 0);
  }, [board.spotCards, board.anteCard]);

  const calculateFinalTotal = useCallback((cards: SpotCard[]) => {
	const spotTotal = cards.reduce((total, card) => {
	  if (!card) return total;
	  return total + getCardValue(card.rank);
	}, 0);

	return spotTotal + (board.anteCard ? getCardValue(board.anteCard.rank) : 0);
  }, [board.anteCard]);

  // Handle game over state
  const handleGameOver = useCallback(async (updatedSpotCards: SpotCard[], finalBets: SpotBet[]) => {

	try{
	await sleep(500);
	setIsAnimating(true);
	setIsEndingGame(true);
	setGameState('gameOver');
	let currentDealerCards: SpotCard[] = [];
	let finalDealerTotal = board.dealerTotal;

	setMessage("Dealer's turn...");
	if (board.dealerCard) {
	  currentDealerCards = [{ ...board.dealerCard, isFaceUp: true }];
	  setBoard(prev => ({ ...prev, dealerCards: currentDealerCards }));
	  await sleep(1000);
	}

	while (finalDealerTotal < DEALER_MIN_TOTAL && currentDealerCards.length < MAX_CARDS) {
	  setMessage("Dealer draws a card...");
	  await sleep(1000);
	  const newCard = { ...dealRandomCard()!, isFaceUp: true };
	  currentDealerCards.push(newCard);
	  finalDealerTotal += getCardValue(newCard.rank);
	  setBoard(prev => ({
		...prev,
		dealerCards: [...currentDealerCards],
		dealerTotal: finalDealerTotal
	  }));
	  await sleep(1000);
	}

	setMessage("Revealing player's cards...");
	await sleep(1000);

	if (board.anteCard && !board.anteCard.isFaceUp) {
	  setBoard(prev => ({
		...prev,
		anteCard: prev.anteCard ? { ...prev.anteCard, isFaceUp: true } : null
	  }));
	  await sleep(1000);
	}

	if (updatedSpotCards.some(card => card && !card.isFaceUp)) {
	  const newSpotCards = updatedSpotCards.map(card => 
		card && !card.isFaceUp ? { ...card, isFaceUp: true } : card
	  );
	  setBoard(prev => ({ ...prev, spotCards: newSpotCards }));
	  await sleep(1000);
	}

	const playerTotal = calculateFinalTotal(updatedSpotCards);
	const outcome = determineGameOutcome(playerTotal, finalDealerTotal);
	setGameOutcome(outcome);
	await sleep(1000);

	const totalFrontBet = bettingState.frontBet + finalBets[3].faceUp;
	const totalBackBet = bettingState.backBet + finalBets[3].faceDown;
	const totalBet = totalFrontBet + totalBackBet;

	let outcomeMessage = ''
	switch (outcome) {
	  case 'win':
		const winnings = (totalFrontBet * 2) + (totalBackBet * 3);
		setFirestoreBalance(balance + winnings);
		outcomeMessage = `Congratulations! You won $${winnings.toFixed(2)}!`;
		break;
	  case 'lose':
		outcomeMessage = `Sorry, you lost $${totalBet.toFixed(2)}.`;
		break;
	  case 'tie':
		setFirestoreBalance(balance + totalBet);
		outcomeMessage = "It's a tie! Your bet has been returned.";
		break;
	  case 'bust':
		setFirestoreBalance(balance + (totalBet * 0.5));
		outcomeMessage = `Both Bust!! You lost $${(totalBet * 0.5).toFixed(2)}.`;
		break;
	  default:
		outcomeMessage = "Dealer wins. Better luck next time!";
	}

	setBettingState(prev => ({ ...prev, lastBet: prev.anteBet }));
	setMessage(outcomeMessage);
	await sleep(2000);
	setIsAnimating(false);
  

	}catch (error) {
		console.error('Error in handleGameOver:', error);
		setMessage('An error occurred. Please try again.');
	} finally{
		setIsAnimating(false);
		setIsEndingGame(false);
	}
	
}, [bettingState.frontBet, bettingState.backBet, board, calculateFinalTotal]);

  // Handle player actions
  const handlePlayerAction = useCallback(async (action: PlayerAction) => {
	if (isAnimating || isEndingGame) return;

	switch (action) {
	  case 'stand':
		await handleGameOver(board.spotCards, board.spotBets);
		break;
		
	  case 'faceUp':
	  case 'faceDown':
		if (balance >= bettingState.anteBet && currentSpotIndex < NUM_SPOTS) {
		  setIsAnimating(true);
		  
		  try {
			const { finalCards, finalBets } = await placeCard(action);
			
			if (currentSpotIndex === NUM_SPOTS - 1) {
			  setCurrentSpotIndex(NUM_SPOTS);
			  await handleGameOver(finalCards, finalBets);
			} else {
			  setCurrentSpotIndex(prev => prev + 1);
			  setIsAnimating(false);
			}
		  } catch (error) {
			console.error('Error in handlePlayerAction:', error);
			setIsAnimating(false);
		  }
		}
		break;
	}
  }, [isAnimating, balance, bettingState.anteBet, currentSpotIndex, handleGameOver, placeCard, board.spotCards, board.spotBets]);

  // Start game
  const startGame = useCallback(async () => {
	if (bettingState.bet <= 0) return false;
	
	setBettingState(prev => ({
	  ...prev,
	  backBet: prev.backBet + prev.anteBet
	}));
	
	setMessage("Dealing cards...");
	setIsAnimating(true);

	const newAnteCard = dealRandomCard();
	setBoard(prev => ({ ...prev, anteCard: newAnteCard }));
	await sleep(1000);

	const newDealerCard = { ...dealRandomCard()!, isFaceUp: true };
	setBoard(prev => ({ 
	  ...prev, 
	  dealerCard: newDealerCard,
	  dealerTotal: getCardValue(newDealerCard.rank)
	}));
	setMessage("Dealer's card...");
	await sleep(1000);

	setGameState('playing');
	setCurrentSpotIndex(0);
	setIsAnimating(false);
	return true;
  }, [bettingState.bet]);

  return {
	// Game state
	balance,
	gameState,
	currentSpotIndex,
	isAnimating,
	message,
	gameOutcome,
	isEndingGame,

	// Betting state
	...bettingState,
	
	// Chip state
	...chipState,
	setChipState: (state: Partial<ChipState>) => setChipState(prev => ({ ...prev, ...state })),

	// Board state
	...board,

	// Game functions
	calculateHandTotal,
	placeBet,
	clearBet: useCallback(() => {
	  if (gameState !== 'betting') return;
	  setFirestoreBalance(balance + bettingState.bet);
	  setBettingState(prev => ({ ...prev, bet: 0, anteBet: 0 }));
	}, [gameState, bettingState.bet]),
	startGame,
	handlePlayerAction,
	startNewGame,
	setBalance:setLocalBalance,
	handleRebet: useCallback(() => {
	  if (gameState !== 'betting' || bettingState.lastBet === 0 || balance < bettingState.lastBet) return;
	  
	  const newBalance = balance - bettingState.lastBet;
	  if (newBalance >= 0) {
		setFirestoreBalance(newBalance);
		setBettingState(prev => ({
		  ...prev,
		  bet: prev.lastBet,
		  anteBet: prev.lastBet
		}));
	  }
	}, [balance, bettingState.lastBet, gameState])
  };
};
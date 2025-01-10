import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BettingControls } from '../components/BettingPage/BettingControls';
import { GameState } from '../types/game.types';

describe('BettingControls', () => {
	const defaultProps = {
		gameState: 'betting' as GameState,
		balance: 1000,
		bet: 0,
		lastBet: 50,
		onRebet: vi.fn(),
		onClearBet: vi.fn(),
		onToggleChips: vi.fn(),
		selectedDenomination: 10,
		onDeal: vi.fn(),
		onStand: vi.fn(),
		onFaceUp: vi.fn(),
		onFaceDown: vi.fn(),
		onNewGame: vi.fn(),
		isAnimating: false
	};

	it('disables Deal button when bet is 0', () => {
		render(<BettingControls {...defaultProps} bet={0} />);

		const dealButton = screen.getByText('Deal');
		expect(dealButton).toBeDisabled();
	});

	it('enables Deal button when bet is greater than 0', () => {
		render(<BettingControls {...defaultProps} bet={10} />);

		const dealButton = screen.getByText('Deal');
		expect(dealButton).not.toBeDisabled();
	});

	it('displays correct chip denomination', () => {
		render(<BettingControls {...defaultProps} selectedDenomination={25} />);

		expect(screen.getByText('Chip Selector ($25)')).toBeInTheDocument();
	});

	it('disables Face Up/Down buttons when balance is less than bet', () => {
		render(<BettingControls {...defaultProps} gameState="playing" balance={5} bet={10} />);

		const faceUpButton = screen.getByText('Face Up');
		const faceDownButton = screen.getByText('Face Down');
		expect(faceUpButton).toBeDisabled();
		expect(faceDownButton).toBeDisabled();
	});

	it('enables Face Up/Down buttons when balance is sufficient', () => {
		render(<BettingControls {...defaultProps} gameState="playing" balance={50} bet={10} />);

		const faceUpButton = screen.getByText('Face Up');
		const faceDownButton = screen.getByText('Face Down');
		expect(faceUpButton).not.toBeDisabled();
		expect(faceDownButton).not.toBeDisabled();
	});

	it('calls onClearBet when Clear Bet button is clicked', () => {
		render(<BettingControls {...defaultProps} bet={50} />);

		fireEvent.click(screen.getByText('Clear Bet'));
		expect(defaultProps.onClearBet).toHaveBeenCalled();
	});

	it('disables Clear Bet button when bet is 0', () => {
		render(<BettingControls {...defaultProps} bet={0} />);

		const clearBetButton = screen.getByText('Clear Bet');
		expect(clearBetButton).toBeDisabled();
	});

	it('calls onToggleChips when Chip Selector is clicked', () => {
		render(<BettingControls {...defaultProps} />);

		fireEvent.click(screen.getByText(/Chip Selector/));
		expect(defaultProps.onToggleChips).toHaveBeenCalled();
	});

	it('calls onStand when Stand button is clicked in playing state', () => {
		render(<BettingControls {...defaultProps} gameState="playing" />);

		fireEvent.click(screen.getByText('Stand'));
		expect(defaultProps.onStand).toHaveBeenCalled();
	});

	it('renders correct controls based on game state transitions', () => {
		const { rerender } = render(<BettingControls {...defaultProps} gameState="betting" />);
		expect(screen.getByText('Deal')).toBeInTheDocument();

		// Transition to playing state
		rerender(<BettingControls {...defaultProps} gameState="playing" />);
		expect(screen.getByText('Stand')).toBeInTheDocument();
		expect(screen.queryByText('Deal')).not.toBeInTheDocument();

		// Transition to gameOver state
		rerender(<BettingControls {...defaultProps} gameState="gameOver" />);
		expect(screen.getByText('New Game')).toBeInTheDocument();
		expect(screen.queryByText('Stand')).not.toBeInTheDocument();
	});

	it('calls onNewGame when New Game button is clicked in gameOver state', () => {
		render(<BettingControls {...defaultProps} gameState="gameOver" />);

		fireEvent.click(screen.getByText('New Game'));
		expect(defaultProps.onNewGame).toHaveBeenCalled();
	});
	
	it('formats balance and bet values with two decimal places', () => {
		render(<BettingControls {...defaultProps} balance={100.5} bet={25.75} />);
		
		expect(screen.getByText('$100.50')).toBeInTheDocument();
		expect(screen.getByText('$25.75')).toBeInTheDocument();
	  });

	it('renders betting controls when in betting state', () => {
		render(<BettingControls {...defaultProps} />);

		expect(screen.getByText('Rebet')).toBeInTheDocument();
		expect(screen.getByText('Clear Bet')).toBeInTheDocument();
		expect(screen.getByText('Deal')).toBeInTheDocument();
	});

	it('displays correct balance and bet amounts', () => {
		render(<BettingControls {...defaultProps} balance={500} bet={100} />);

		expect(screen.getByText('$500.00')).toBeInTheDocument();
		expect(screen.getByText('$100.00')).toBeInTheDocument();
	});

	it('disables buttons when animating', () => {
		render(<BettingControls {...defaultProps} isAnimating={true} />);

		const buttons = screen.getAllByRole('button');
		buttons.forEach(button => {
			expect(button).toBeDisabled();
		});
	});

	it('shows playing controls when in playing state', () => {
		render(<BettingControls {...defaultProps} gameState="playing" />);

		expect(screen.getByText('Stand')).toBeInTheDocument();
		expect(screen.getByText('Face Up')).toBeInTheDocument();
		expect(screen.getByText('Face Down')).toBeInTheDocument();
	});

	it('calls onRebet when Rebet button is clicked', () => {
		render(<BettingControls {...defaultProps} />);

		fireEvent.click(screen.getByText('Rebet'));
		expect(defaultProps.onRebet).toHaveBeenCalled();
	});

	it('disables Rebet button when balance is less than last bet', () => {
		render(<BettingControls {...defaultProps} balance={20} lastBet={50} />);

		const rebetButton = screen.getByText('Rebet');
		expect(rebetButton).toBeDisabled();
	});

	it('shows new game button in gameOver state', () => {
		render(<BettingControls {...defaultProps} gameState="gameOver" />);

		expect(screen.getByText('New Game')).toBeInTheDocument();
	});
});
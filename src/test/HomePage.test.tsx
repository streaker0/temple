import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import TemplePage from '../components/HomePage/HomePage';
import { useGame } from '../context/GameContext';
import { useNavigate } from 'react-router-dom';

// Mock the context and router hooks
vi.mock('../context/GameContext');
vi.mock('react-router-dom');

describe('HomePage', () => {
    const mockNavigate = vi.fn();
    const mockSetBalance = vi.fn();
    
    beforeEach(() => {
        vi.clearAllMocks();
        (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
        (useGame as jest.Mock).mockReturnValue({
            balance: 1000,
            setBalance: mockSetBalance
        });
    });

    it('renders welcome message with player name', () => {
        render(<TemplePage />);
        expect(screen.getByText('Welcome, Player1')).toBeInTheDocument();
    });

    it('displays correct initial balance', () => {
        render(<TemplePage />);
        expect(screen.getByText('$1000.00')).toBeInTheDocument();
    });

    it('handles deposit correctly', () => {
        render(<TemplePage />);
        const input = screen.getByPlaceholderText('Enter amount');
        const depositButton = screen.getByText('Deposit');

        fireEvent.change(input, { target: { value: '500' } });
        fireEvent.click(depositButton);

        expect(mockSetBalance).toHaveBeenCalledWith(1500);
    });

    it('handles withdraw correctly', () => {
        render(<TemplePage />);
        const input = screen.getByPlaceholderText('Enter amount');
        const withdrawButton = screen.getByText('Withdraw');

        fireEvent.change(input, { target: { value: '300' } });
        fireEvent.click(withdrawButton);

        expect(mockSetBalance).toHaveBeenCalledWith(700);
    });

    it('disables withdraw when amount exceeds balance', () => {
        render(<TemplePage />);
        const input = screen.getByPlaceholderText('Enter amount');
        const withdrawButton = screen.getByText('Withdraw');

        fireEvent.change(input, { target: { value: '1500' } });
        expect(withdrawButton).toBeDisabled();
    });

    it('ignores invalid input amounts', () => {
        render(<TemplePage />);
        const input = screen.getByPlaceholderText('Enter amount');
        const depositButton = screen.getByText('Deposit');

        fireEvent.change(input, { target: { value: '-100' } });
        fireEvent.click(depositButton);

        expect(mockSetBalance).not.toHaveBeenCalled();
    });

    it('navigates to play page when Play Now is clicked', () => {
        render(<TemplePage />);
        const playButton = screen.getByText('Play Now');

        fireEvent.click(playButton);
        expect(mockNavigate).toHaveBeenCalledWith('/play');
    });

    it('formats balance with two decimal places', () => {
        (useGame as jest.Mock).mockReturnValue({
            balance: 1000.5,
            setBalance: mockSetBalance
        });

        render(<TemplePage />);
        expect(screen.getByText('$1000.50')).toBeInTheDocument();
    });
});
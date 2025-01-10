import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MessageDisplay } from '../components/Modal/MessageDisplay';

describe('MessageDisplay', () => {
    it('renders message when provided', () => {
        render(<MessageDisplay message="Test message" isAnimating={false} />);
        expect(screen.getByText('Test message')).toBeInTheDocument();
    });

    it('applies animation class when isAnimating is true', () => {
        render(<MessageDisplay message="Test message" isAnimating={true} />);
        const messageElement = screen.getByText('Test message').closest('.message-display');
        expect(messageElement).toHaveClass('animating');
    });

    it('does not apply animation class when isAnimating is false', () => {
        render(<MessageDisplay message="Test message" isAnimating={false} />);
        const messageElement = screen.getByText('Test message').closest('.message-display');
        expect(messageElement).not.toHaveClass('animating');
    });

    it('returns null when no message is provided', () => {
        const { container } = render(<MessageDisplay message="" isAnimating={false} />);
        expect(container).toBeEmptyDOMElement();
    });

    it('maintains message content during animation', () => {
        const { rerender } = render(<MessageDisplay message="Test message" isAnimating={false} />);
        const initialMessage = screen.getByText('Test message');
        
        rerender(<MessageDisplay message="Test message" isAnimating={true} />);
        const animatingMessage = screen.getByText('Test message');
        
        expect(initialMessage).toEqual(animatingMessage);
    });
});
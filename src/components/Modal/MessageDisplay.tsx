import React from 'react';
import './MessageDisplay.css';

interface MessageDisplayProps {
    message: string;
    isAnimating: boolean;
}

export const MessageDisplay: React.FC<MessageDisplayProps> = ({ message, isAnimating }) => {
    if (!message) return null;

    return (
        <div className={`message-display ${isAnimating ? 'animating' : ''}`}>
            <div className="message-content">
                <div className="message-text">{message}</div>
            </div>
        </div>
    );
};
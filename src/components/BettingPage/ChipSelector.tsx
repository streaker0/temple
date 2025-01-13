import React, { useRef, useEffect }  from 'react';
import { CHIP_DENOMINATIONS } from '../../constants/game.constants';
import { MAX_BET } from '../../constants/game.constants';

interface ChipSelectorProps {
    show: boolean;
    selectedDenomination: number;
    onSelect: (value: number) => void;
	onClickOutside: () => void;
	currentBet: number;
	currentBalance: number;
    gameState: 'betting' | 'playing' | 'gameOver';
}

const chipDenominations = CHIP_DENOMINATIONS;

export const ChipSelector: React.FC<ChipSelectorProps> = ({
    show,
    selectedDenomination,
    onSelect,
	onClickOutside,
	currentBet,
	currentBalance,
    gameState
}) => {
    const chipSelectorRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (chipSelectorRef.current && !chipSelectorRef.current.contains(event.target as Node)) {
                onClickOutside();
            }
        };

        if (show) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [show, onClickOutside]);

	const isChipDisabled = (chipValue: number) => {
        const potentialBet = currentBet + chipValue;
		const potentialBalance = currentBalance - chipValue;
        return gameState !== 'betting' || potentialBet > MAX_BET || potentialBalance < 0;
    };

    if (!show) return null;

    return (
        <div ref={chipSelectorRef} className="chip-denominations">
            {chipDenominations.map((value) => (
                <button
                    key={value}
                    className={`chip-button ${selectedDenomination === value ? 'selected' : ''} 
                              ${isChipDisabled(value) ? 'disabled' : ''}`}
                    onClick={() => !isChipDisabled(value) && onSelect(value)}
                    disabled={isChipDisabled(value)}
                >
                    ${value}
                </button>
            ))}
        </div>
    );
};
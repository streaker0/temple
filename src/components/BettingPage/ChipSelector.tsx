import React from 'react';
import { CHIP_DENOMINATIONS } from '../../constants/game.constants';

interface ChipSelectorProps {
    show: boolean;
    selectedDenomination: number;
    onSelect: (value: number) => void;
}

const chipDenominations = CHIP_DENOMINATIONS;

export const ChipSelector: React.FC<ChipSelectorProps> = ({
    show,
    selectedDenomination,
    onSelect
}) => {
    if (!show) return null;

    return (
        <div className="chip-denominations">
            {chipDenominations.map((value) => (
                <button
                    key={value}
                    className={`chip-button ${selectedDenomination === value ? 'selected' : ''}`}
                    onClick={() => onSelect(value)}
                >
                    ${value}
                </button>
            ))}
        </div>
    );
};
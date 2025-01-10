import React, { useRef, useEffect }  from 'react';
import { CHIP_DENOMINATIONS } from '../../constants/game.constants';

interface ChipSelectorProps {
    show: boolean;
    selectedDenomination: number;
    onSelect: (value: number) => void;
	onClickOutside: () => void;
}

const chipDenominations = CHIP_DENOMINATIONS;

export const ChipSelector: React.FC<ChipSelectorProps> = ({
    show,
    selectedDenomination,
    onSelect,
	onClickOutside
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

    if (!show) return null;

    return (
        <div ref={chipSelectorRef} className="chip-denominations">
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
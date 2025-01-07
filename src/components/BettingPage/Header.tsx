import React from 'react';
import { MIN_BET, MAX_BET } from '../../constants/game.constants';
import { ChevronLeft} from 'lucide-react'
import {RulesModal} from '../Modal/RulesModal';

interface HeaderProps {
    onHomeClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onHomeClick }) => {
    return (
        <div className="top-section">
			<ChevronLeft
			onClick={onHomeClick}
			className="w-38 h-38 bg-gradient-to-b from-emerald-900 via-emerald-800 to-emerald-900"/>
            <RulesModal/>

            <div className="header">TEMPLE</div>
            <div className="bet-limits">
                <p>Bet limit:</p>
                <p>Min: ${MIN_BET}</p>
                <p>Max: ${MAX_BET}</p>
            </div>
        </div>
    );
};
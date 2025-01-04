import React from 'react';
import { MIN_BET, MAX_BET } from '../../constants/game.constants';
import {RulesModal} from '../Modal/RulesModal';

export const Header: React.FC = () => {
    return (
        <div className="top-section">
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
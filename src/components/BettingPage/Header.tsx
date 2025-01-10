import React from 'react';
import { ChevronLeft } from 'lucide-react';
import RulesModal from '../Modal/RulesModal';

interface HeaderProps {
	onHomeClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onHomeClick }) => {
	return (
		<div className="w-full flex items-center justify-between mb-6 relative">
			{/* Left side with chevron and rules */}
			<div className="flex flex-col items-center gap-2">
				<ChevronLeft
					className="h-12 w-12 text-white hover:text-yellow-400 cursor-pointer transition-colors"
					onClick={onHomeClick}
				/>
				<RulesModal />
			</div>

			{/* Centered title */}
			<div className="absolute left-1/2 -translate-x-1/2 text-center">
				<h1 className="text-4xl font-bold text-white drop-shadow-glow mb-2">
					Temple of Fortune
				</h1>
				<div className="text-lg text-yellow-400 font-semibold">
					High Card Game
				</div>
			</div>

			{/* Right side spacer to maintain layout */}
			<div className="w-24" />
			<div className="absolute top-4 right-4 z-20 bg-black/80 text-yellow-400 px-4 py-2 rounded-lg border border-yellow-600 shadow-lg">
				<div className="text-sm font-semibold">Betting Limits</div>
				<div className="text-xs mt-1">Min: $1 | Max: $1000</div>
			</div>
		</div>
	);
};
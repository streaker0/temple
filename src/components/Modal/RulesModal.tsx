import { X } from 'lucide-react';
import { useState } from 'react';

export const RulesModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  const Trigger = () => (
    <button
      className="px-4 py-2 bg-black/80 text-white border border-yellow-600 rounded hover:bg-black hover:border-yellow-400 transition-all text-sm"
      onClick={() => setIsOpen(true)}
    >
      Rules
    </button>
  );

  if (!isOpen) return <Trigger />;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-b from-[#1a472a] to-[#2a6e2a] rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto border-2 border-yellow-600 shadow-xl">
        {/* Header */}
        <div className="bg-black/50 p-6 border-b border-yellow-600/50 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-yellow-400 drop-shadow-glow">Temple of Fortune Rules</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="text-white hover:text-yellow-400 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          <div className="bg-black/30 p-4 rounded-lg border border-yellow-600/30">
            <h3 className="font-bold mb-2 text-yellow-400">Game Objective</h3>
            <p className="text-white">
              Get closer to 20 than the dealer without going over. Face cards (J,Q,K) = 0, Ace = 1, 
              and number cards = face value. The game combines strategy in choosing face-up or face-down cards.
            </p>
          </div>

          <div className="bg-black/30 p-4 rounded-lg border border-yellow-600/30">
            <h3 className="font-bold mb-2 text-yellow-400">Game Flow</h3>
            <div className="space-y-2 text-white">
              <p>1. Place your ante bet</p>
              <p>2. Receive your ante card and view the dealer's up card</p>
              <p>3. Make decisions for up to 4 additional spots:</p>
              <ul className="list-disc pl-8 text-sm space-y-1">
                <li>Face-Up: See your card immediately (1:1 payout)</li>
                <li>Face-Down: Higher risk but higher reward (2:1 payout)</li>
                <li>Each spot requires matching your ante bet</li>
              </ul>
              <p>4. Stand when ready to end your turn</p>
            </div>
          </div>

          <div className="bg-black/30 p-4 rounded-lg border border-yellow-600/30">
            <h3 className="font-bold mb-2 text-yellow-400">Winning & Payouts</h3>
            <div className="space-y-2 text-white">
              <p>• Win (Player closer to 20 than dealer):</p>
              <ul className="list-disc pl-8 text-sm space-y-1">
                <li>Face-Up spots pay 1:1</li>
                <li>Face-Down spots pay 2:1</li>
              </ul>
              <p>• Lose (Dealer closer to 20 or player over 20): Lose all bets</p>
              <p>• Tie (Equal totals): All bets returned</p>
              <p>• Both Bust (Both over 20): Lose half of all bets</p>
            </div>
          </div>

          <div className="bg-black/30 p-4 rounded-lg border border-yellow-600/30">
            <h3 className="font-bold mb-2 text-yellow-400">Special Rules</h3>
            <div className="space-y-2 text-white">
              <p>• Dealer must draw till its total is at least 15</p>
              <p>• Face-down cards are only revealed at the end of the game</p>
              <p>• The same bet amount must be used for all spots</p>
              <p>• You can rebet your last bet amount if you have sufficient balance</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-black/50 p-6 border-t border-yellow-600/50 flex justify-end">
          <button
            onClick={() => setIsOpen(false)}
            className="px-6 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-500 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default RulesModal;
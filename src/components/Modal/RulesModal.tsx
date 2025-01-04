import React, { useState } from 'react';

export const RulesModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  if (!isOpen) {
    return (
      <button
        className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
        onClick={() => setIsOpen(true)}
      >
        RULES
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Temple Card Game Rules</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <div className="space-y-6">
          <div className="bg-gray-100 p-4 rounded-lg">
            <h3 className="font-bold mb-2">Game Objective</h3>
            <p>Get closer to 20 than the dealer without going over. Face cards (J,Q,K) = 0, Ace = 1, number cards = face value.</p>
          </div>

          <div className="bg-gray-100 p-4 rounded-lg">
            <h3 className="font-bold mb-2">Game Flow</h3>
            <div className="space-y-2">
              <p>1. Place your ante bet (minimum $1, maximum $1000)</p>
              <p>2. Receive your ante card and see dealer's first card</p>
              <p>3. Place additional bets in up to 4 spots, either face-up or face-down</p>
              <p>4. Stand to end your turn and reveal dealer's cards</p>
            </div>
          </div>

          <div className="bg-gray-100 p-4 rounded-lg">
            <h3 className="font-bold mb-2">Winning & Payouts</h3>
            <div className="space-y-2">
              <p>• Win: Player closer to 20 than dealer - 2:1 payout</p>
              <p>• Lose: Dealer closer to 20 or player over 20 - Lose bet</p>
              <p>• Tie: Equal totals - Bet returned</p>
              <p>• Both Bust: Both over 20 - Half bet returned</p>
            </div>
          </div>

          <div className="bg-gray-100 p-4 rounded-lg">
            <h3 className="font-bold mb-2">Special Rules</h3>
            <div className="space-y-2">
              <p>• Dealer must draw to at least 15</p>
              <p>• Maximum 5 cards per hand</p>
              <p>• Face-down cards are revealed at the end of the game</p>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={() => setIsOpen(false)}
            className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default RulesModal;
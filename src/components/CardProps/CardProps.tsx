import React, { useState, useEffect } from 'react';
type CardProps = {
	suit?: string;
	rank?: string;
	isFaceUp?: boolean;
	className?: string;
	isDealt?: boolean;
	isWinning?: boolean;
	isLosing?: boolean;
  };
  
  const Card: React.FC<CardProps> = ({ 
	suit = 'spade', 
	rank = 'ace', 
	isFaceUp = true,
	className = '',
	isDealt = false,
	isWinning = false,
	isLosing = false
  }) => {
	const [showCard, setShowCard] = useState(false);

  useEffect(() => {
    // Add a small delay before showing the card to trigger animation
    const timer = setTimeout(() => {
      setShowCard(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // Get the dynamic import for the card image
  const getCardImage = () => {
    if (!isFaceUp) {
      return new URL(`../../assets/cards/face-down.jpg`, import.meta.url).href;
    }
    
    // Convert rank and suit to match naming scheme
    const cardName = `${rank.toLowerCase()}-${suit.toLowerCase()}`;
    const url = "../../assets/cards/"+cardName+".jpg"
    return new URL(`${url}`, import.meta.url).href;
  };

  // Combine animation classes
  const cardClasses = [
    className,
    showCard && isDealt ? 'card-dealt' : '',
    isWinning ? 'winning-hand' : '',
    isLosing ? 'losing-hand' : '',
  ].filter(Boolean).join(' ');

  return (
    <div className={cardClasses}>
      <img 
        src={getCardImage()} 
        alt={isFaceUp ? `${rank} of ${suit}` : 'Face down card'} 
        className="card-image"
      />
    </div>
  );
};

export default Card;
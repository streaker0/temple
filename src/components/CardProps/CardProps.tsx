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

// Configure your S3 bucket URL
const S3_BUCKET_URL = 'https://temple-of-fortune-assets.s3.amazonaws.com/cards';

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

  // Get the S3 URL for the card image
  const getCardImage = () => {
    if (!isFaceUp) {
      return `${S3_BUCKET_URL}/face-down.jpg`;
    }
    
    // Convert rank and suit to match naming scheme
    const cardName = `${rank.toLowerCase()}-${suit.toLowerCase()}`;
    return `${S3_BUCKET_URL}/${cardName}.jpg`;
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
        onError={(e) => {
          console.error(`Failed to load card image: ${(e.target as HTMLImageElement).src}`);
          // Optionally set a fallback image
          // (e.target as HTMLImageElement).src = '${S3_BUCKET_URL}/fallback.jpg';
        }}
      />
    </div>
  );
};

export default Card;
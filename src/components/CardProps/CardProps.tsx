import React from 'react';
type CardProps = {
	suit?: string;
	rank?: string;
	isFaceUp?: boolean;
	className?: string;
  };
  
  const Card: React.FC<CardProps> = ({ 
	suit = 'spade', 
	rank = 'ace', 
	isFaceUp = true,
	className = ''
  }) => {
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
  
	return (
	  <div className={`${className}`}>
		<img 
		  src={getCardImage()} 
		  alt={isFaceUp ? `${rank} of ${suit}` : 'Face down card'} 
		  className="card-image"
		/>
	  </div>
	);
  };

export default Card;
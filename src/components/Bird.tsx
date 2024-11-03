import React from 'react';
import { useGame } from '../context/GameContext';
import { GAME_CONFIG } from '../config/gameConfig';
import { Bird as BirdIcon } from 'lucide-react';

export const Bird: React.FC = () => {
  const { birdPosition, velocity } = useGame();
  
  const rotation = Math.min(Math.max(velocity * 4, -40), 40);

  return (
    <div
      className="absolute transition-transform"
      style={{
        transform: `translate(${birdPosition.x}px, ${birdPosition.y}px) rotate(${rotation}deg)`,
        width: `${GAME_CONFIG.BIRD_WIDTH}px`,
        height: `${GAME_CONFIG.BIRD_HEIGHT}px`
      }}
    >
      <BirdIcon
        className="w-full h-full text-yellow-400"
        strokeWidth={2.5}
      />
    </div>
  );
};
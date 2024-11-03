import React from 'react';
import { useGame } from '../context/GameContext';
import { GAME_CONFIG, COLORS } from '../config/gameConfig';

export const Pipe: React.FC = () => {
  const { pipePosition } = useGame();

  return (
    <>
      {/* Upper Pipe */}
      <div
        className="absolute"
        style={{
          left: `${pipePosition.x}px`,
          top: 0,
          width: `${GAME_CONFIG.PIPE_WIDTH}px`,
          height: `${pipePosition.height}px`,
          backgroundColor: COLORS.PIPE
        }}
      />
      {/* Lower Pipe */}
      <div
        className="absolute"
        style={{
          left: `${pipePosition.x}px`,
          top: `${pipePosition.height + GAME_CONFIG.PIPE_GAP}px`,
          width: `${GAME_CONFIG.PIPE_WIDTH}px`,
          height: `${GAME_CONFIG.CANVAS_HEIGHT - pipePosition.height - GAME_CONFIG.PIPE_GAP}px`,
          backgroundColor: COLORS.PIPE
        }}
      />
    </>
  );
};
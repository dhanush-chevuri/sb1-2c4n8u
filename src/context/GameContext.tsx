import React, { createContext, useContext, useState, useEffect } from 'react';
import { GAME_CONFIG } from '../config/gameConfig';

interface GameContextType {
  score: number;
  gameOver: boolean;
  birdPosition: { x: number; y: number };
  pipePosition: { x: number; height: number };
  velocity: number;
  startGame: () => void;
  jump: () => void;
  updateGame: () => void;
}

const GameContext = createContext<GameContextType | null>(null);

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) throw new Error('useGame must be used within GameProvider');
  return context;
};

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [velocity, setVelocity] = useState(0);
  const [birdPosition, setBirdPosition] = useState({
    x: GAME_CONFIG.BIRD_INITIAL_X,
    y: GAME_CONFIG.BIRD_INITIAL_Y
  });
  const [pipePosition, setPipePosition] = useState({
    x: GAME_CONFIG.PIPE_SPAWN_X,
    height: Math.random() * (GAME_CONFIG.CANVAS_HEIGHT - GAME_CONFIG.PIPE_GAP - 100) + 50
  });

  const startGame = () => {
    setScore(0);
    setGameOver(false);
    setVelocity(0);
    setBirdPosition({
      x: GAME_CONFIG.BIRD_INITIAL_X,
      y: GAME_CONFIG.BIRD_INITIAL_Y
    });
    setPipePosition({
      x: GAME_CONFIG.PIPE_SPAWN_X,
      height: Math.random() * (GAME_CONFIG.CANVAS_HEIGHT - GAME_CONFIG.PIPE_GAP - 100) + 50
    });
  };

  const jump = () => {
    if (!gameOver) {
      setVelocity(GAME_CONFIG.JUMP_STRENGTH);
    }
  };

  const updateGame = () => {
    if (gameOver) return;

    // Update bird position
    const newY = birdPosition.y + velocity;
    setBirdPosition(prev => ({ ...prev, y: newY }));
    setVelocity(prev => prev + GAME_CONFIG.GRAVITY);

    // Update pipe position
    setPipePosition(prev => ({
      ...prev,
      x: prev.x - GAME_CONFIG.PIPE_SPEED
    }));

    // Check for collisions
    const birdRect = {
      left: birdPosition.x,
      right: birdPosition.x + GAME_CONFIG.BIRD_WIDTH,
      top: newY,
      bottom: newY + GAME_CONFIG.BIRD_HEIGHT
    };

    const upperPipeRect = {
      left: pipePosition.x,
      right: pipePosition.x + GAME_CONFIG.PIPE_WIDTH,
      top: 0,
      bottom: pipePosition.height
    };

    const lowerPipeRect = {
      left: pipePosition.x,
      right: pipePosition.x + GAME_CONFIG.PIPE_WIDTH,
      top: pipePosition.height + GAME_CONFIG.PIPE_GAP,
      bottom: GAME_CONFIG.CANVAS_HEIGHT
    };

    // Check if bird hits pipes or goes out of bounds
    if (
      newY < 0 ||
      newY + GAME_CONFIG.BIRD_HEIGHT > GAME_CONFIG.CANVAS_HEIGHT ||
      (birdRect.right > upperPipeRect.left &&
        birdRect.left < upperPipeRect.right &&
        birdRect.top < upperPipeRect.bottom) ||
      (birdRect.right > lowerPipeRect.left &&
        birdRect.left < lowerPipeRect.right &&
        birdRect.bottom > lowerPipeRect.top)
    ) {
      setGameOver(true);
      return;
    }

    // Reset pipe and increment score
    if (pipePosition.x < -GAME_CONFIG.PIPE_WIDTH) {
      setPipePosition({
        x: GAME_CONFIG.PIPE_SPAWN_X,
        height: Math.random() * (GAME_CONFIG.CANVAS_HEIGHT - GAME_CONFIG.PIPE_GAP - 100) + 50
      });
      setScore(prev => prev + 1);
    }
  };

  return (
    <GameContext.Provider
      value={{
        score,
        gameOver,
        birdPosition,
        pipePosition,
        velocity,
        startGame,
        jump,
        updateGame
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
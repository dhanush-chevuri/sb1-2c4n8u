import React, { useEffect, useRef } from 'react';
import Webcam from 'react-webcam';
import { useGame } from '../context/GameContext';
import { Bird } from './Bird';
import { Pipe } from './Pipe';
import { GAME_CONFIG, COLORS } from '../config/gameConfig';
import { initializeHandDetection, detectHand } from '../utils/handDetection';

export const Game: React.FC = () => {
  const { score, gameOver, startGame, jump, updateGame } = useGame();
  const webcamRef = useRef<Webcam>(null);
  const requestRef = useRef<number>();

  useEffect(() => {
    initializeHandDetection();
  }, []);

  useEffect(() => {
    const gameLoop = () => {
      if (webcamRef.current?.video) {
        const isHandClosed = detectHand(webcamRef.current.video);
        if (isHandClosed) {
          if (gameOver) {
            startGame();
          } else {
            jump();
          }
        }
      }
      
      updateGame();
      requestRef.current = requestAnimationFrame(gameLoop);
    };

    requestRef.current = requestAnimationFrame(gameLoop);
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [gameOver, jump, startGame, updateGame]);

  return (
    <div className="relative w-screen h-screen bg-gray-900 flex items-center justify-center">
      <div
        className="relative overflow-hidden bg-sky-300"
        style={{
          width: GAME_CONFIG.CANVAS_WIDTH,
          height: GAME_CONFIG.CANVAS_HEIGHT
        }}
      >
        <Bird />
        <Pipe />
        
        <div className="absolute top-4 left-4 text-2xl font-bold" style={{ color: COLORS.SCORE }}>
          Score: {score}
        </div>

        {gameOver && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-4" style={{ color: COLORS.GAME_OVER }}>
                Game Over!
              </h2>
              <p className="text-white text-xl">Close your hand to restart</p>
            </div>
          </div>
        )}
      </div>

      <Webcam
        ref={webcamRef}
        className="absolute top-4 right-4 w-48 h-36 rounded-lg"
        mirrored
      />
    </div>
  );
};
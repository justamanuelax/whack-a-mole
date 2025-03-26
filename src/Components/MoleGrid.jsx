import { useState, useEffect, useContext, useCallback, useRef } from 'react';
import Mole from './Components/Mole.jsx';
import GameStats from './GameStats';
import GameControls from './GameControls';
import GameSettings from './Components/GameSettings.jsx';
import { GameContext } from '../Context/GameContext';
import '../Styles/Components/MoleGrid.css';
import GameResult from './GameResult';

const MoleGrid = () => {
  const { state, dispatch } = useContext(GameContext);
  const { status, difficulty, timer, score } = state;
  
  // Track which moles are currently active
  const [activeMoles, setActiveMoles] = useState(Array(9).fill(false));
  
  // Game configuration based on difficulty
  const difficultySettings = {
    easy: { 
      moleShowTime: 1500, // ms
      moleAppearanceRate: 2000, // ms
      maxActiveMoles: 2
    },
    medium: { 
      moleShowTime: 1200,
      moleAppearanceRate: 1500,
      maxActiveMoles: 3
    },
    hard: { 
      moleShowTime: 800,
      moleAppearanceRate: 1000,
      maxActiveMoles: 4
    }
  };

  // Get current settings based on difficulty
  const currentSettings = difficultySettings[difficulty];
  
  // Function to handle whacking a mole
  const handleWhack = useCallback((index) => {
    if (status === 'playing') {
      // Update score when a mole is whacked
      dispatch({ type: 'INCREMENT_SCORE', payload: 1 });
      
      // Deactivate the whacked mole
      setActiveMoles(prev => {
        const newActiveMoles = [...prev];
        newActiveMoles[index] = false;
        return newActiveMoles;
      });
    }
  }, [dispatch, status]);
  
  const moleAppearanceInterval = useRef(null);
  const timerInterval = useRef(null);
  const gameStartSoundRef = useRef(null);
  const gameEndSoundRef = useRef(null);
  const [isNewHighScore, setIsNewHighScore] = useState(false);

  const loadHighScores = useCallback(() => {
    const storedHighScores = localStorage.getItem('highScores');
    if (storedHighScores) {
      dispatch({ type: 'SET_HIGH_SCORES', payload: JSON.parse(storedHighScores) });
    }
  }, [dispatch]);

  useEffect(() => {
    loadHighScores();
  }, [loadHighScores]);

  useEffect(() => {
    if (status === 'ended') {
      // Check if current score is a new high score
      const currentHighScores = [...state.highScores];
      const isHighScore = currentHighScores.length < 5 || score > currentHighScores[4]?.score || 0;

      if (isHighScore) {
        setIsNewHighScore(true);
        const newScore = { score: score };
        currentHighScores.push(newScore);
        currentHighScores.sort((a, b) => b.score - a.score);
        const topFiveScores = currentHighScores.slice(0, 5);

        dispatch({ type: 'SET_HIGH_SCORES', payload: topFiveScores });
        localStorage.setItem('highScores', JSON.stringify(topFiveScores));
      } else {
        setIsNewHighScore(false);
      }
    }
  }, [status, score, state.highScores, dispatch]);

  // Start game with a time limit
  useEffect(() => {
    if (status === 'playing' && timer === 0) {
      dispatch({ type: 'SET_TIMER', payload: state.gameDuration });
    }
    
    if (status === 'playing' && timer > 0) {
      timerInterval.current = setInterval(() => {
        dispatch({ type: 'DECREMENT_TIMER' });
        if (timer === 1) {
          dispatch({ type: 'END_GAME' });
          if (gameEndSoundRef.current) {
            gameEndSoundRef.current.play();
          }
        }
      }, 1000);

      if (gameStartSoundRef.current) {
        gameStartSoundRef.current.play();
      }
    } else {
      clearInterval(timerInterval.current);
    }
    
    return () => clearInterval(timerInterval.current);
  }, [status, timer, dispatch, state.gameDuration]);
  
  // Control mole appearances
  useEffect(() => {
    if (status !== 'playing') {
      setActiveMoles(Array(9).fill(false));
      clearInterval(moleAppearanceInterval.current);
      return;
    }
    
    moleAppearanceInterval.current = setInterval(() => {
      setActiveMoles(prev => {
        const newActiveMoles = [...prev];
        const activeCount = newActiveMoles.filter(Boolean).length;
        
        // Don't exceed max active moles for current difficulty
        if (activeCount >= currentSettings.maxActiveMoles) return newActiveMoles;
        
        // Find available holes (no active mole)
        const availableHoles = newActiveMoles
          .map((active, index) => ({ active, index }))
          .filter(hole => !hole.active)
          .map(hole => hole.index);
        
        if (availableHoles.length > 0) {
          // Pick a random available hole
          const randomIndex = Math.floor(Math.random() * availableHoles.length);
          const selectedHole = availableHoles[randomIndex];
          newActiveMoles[selectedHole] = true;
          
          // Schedule the mole to disappear after a time
          setTimeout(() => {
            setActiveMoles(current => {
              const updated = [...current];
              updated[selectedHole] = false;
              return updated;
            });
          }, currentSettings.moleShowTime);
        }
        
        return newActiveMoles;
      });
    }, currentSettings.moleAppearanceRate);
    
    return () => clearInterval(moleAppearanceInterval.current);
  }, [status, currentSettings]);
  
  // Show game result when game ends
  const renderGameResult = () => {
    if (status === 'ended') {
      return (
        <GameResult score={score} highScores={state.highScores} isNewHighScore={isNewHighScore} />
      );
    }
    return null;
  };
  
  return (
    <div className="game-container">
      <GameStats score={score} timer={timer}/>
      
      <div className="mole-grid">
        {Array(9).fill().map((_, index) => (
          <Mole 
            key={index}
            moleIndex={index}
            isActive={activeMoles[index]}
            onWhack={handleWhack}
          />
        ))}
      </div>
      
      {renderGameResult()}
      <GameControls />
      <GameSettings />
      <audio ref={gameStartSoundRef} src="/src/assets/start.wav" preload="auto"></audio>
      <audio ref={gameEndSoundRef} src="/src/assets/end.wav" preload="auto"></audio>
    </div>
  );
};

export default MoleGrid;

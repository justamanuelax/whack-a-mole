import { useState, useEffect, useContext, useCallback, useRef, useMemo } from 'react';
import Mole from './Mole';
import GameStats from './GameStats.jsx';
import GameControls from './GameControls.jsx';
import { GameContext } from '../Context/GameContextDefinition';
import '../Styles/Components/MoleGrid.css';
import GameResult from './GameResult.jsx';
import MusicBackground from '../Hooks/GameLogic.jsx';

const MoleGrid = () => {
  const { state, dispatch } = useContext(GameContext);
  const { status, difficulty, timer, score } = state;
  const { backgroundMusicRef } = MusicBackground();  
  // Track which moles are currently active - updated from 6 to 9 moles (three rows of 3)
  const [activeMoles, setActiveMoles] = useState(Array(9).fill(false));
  const [isNewHighScore, setIsNewHighScore] = useState(false);
  const [scoreProcessed, setScoreProcessed] = useState(false);
  
  // Game configuration based on difficulty
  const difficultySettings = useMemo(() => ({
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
  }), []);

  // Get current settings based on difficulty
  const currentSettings = useMemo(() => difficultySettings[difficulty], [difficulty, difficultySettings]);
  
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
  const gameEndSoundRef = useRef(new Audio('/assets/sounds/game-over.mp3'));

  // Load high scores from localStorage on component mount
  const loadHighScores = useCallback(() => {
    const storedHighScores = localStorage.getItem('highScores');
    if (storedHighScores) {
      dispatch({ type: 'SET_HIGH_SCORES', payload: JSON.parse(storedHighScores) });
    }
  }, [dispatch]);

  useEffect(() => {
    loadHighScores();
  }, [loadHighScores]);

  // Handle music playback based on game status
  useEffect(() => {
    if (status === 'playing' && backgroundMusicRef.current) {
      backgroundMusicRef.current.play().catch(error => {
        console.error("Error playing background music:", error);
      });
      console.log("Music playing because game started");
    } else if ((status === 'paused' || status === 'ended') && backgroundMusicRef.current) {
      backgroundMusicRef.current.pause();
      console.log("Music paused because game ended or paused");
    }
  }, [status, backgroundMusicRef]);

  // Reset scoreProcessed flag when starting a new game
  useEffect(() => {
    if (status === 'playing') {
      setScoreProcessed(false);
    }
  }, [status]);

  // Process high score when game ends
  useEffect(() => {
    if (status === 'ended' && !scoreProcessed && score > 0) {
      // Get existing high scores from localStorage
      let highScores = [];
      const storedHighScores = localStorage.getItem('highScores');
      
      if (storedHighScores) {
        highScores = JSON.parse(storedHighScores);
      }
      
      // Only set as new high score if it's the highest score (first position)
      // Check if there are no existing scores or if the new score is higher than the current highest
      const isTopScore = highScores.length === 0 || score > (highScores[0]?.score || 0);
      setIsNewHighScore(isTopScore);
      
      // Create a timestamp for the score for sorting ties
      const newScore = { 
        score: score,
        timestamp: Date.now()
      };
      
      highScores.push(newScore);
      // Sort by score (descending) and then by timestamp (ascending) for ties
      highScores.sort((a, b) => b.score === a.score ? 
                                (a.timestamp || 0) - (b.timestamp || 0) : 
                                b.score - a.score);
                                
      // Store all high scores in descending order
      // No slicing to limit the number of scores
      
      // Update state and localStorage
      dispatch({ type: 'SET_HIGH_SCORES', payload: highScores });
      localStorage.setItem('highScores', JSON.stringify(highScores));
      
      // Mark score as processed to prevent duplicate processing
      setScoreProcessed(true);
    }
  }, [status, score, dispatch, scoreProcessed]);

  // Start game with a time limit
  useEffect(() => {
    if (status === 'playing' && timer === 0) {
      // Initialize timer when game starts
      dispatch({ type: 'SET_TIMER', payload: state.gameDuration });
    }
    
    if (status === 'playing' && timer > 0) {
      timerInterval.current = setInterval(() => {
        dispatch({ type: 'DECREMENT_TIMER' });
      }, 1000);
    } else if (status === 'paused') {
      clearInterval(timerInterval.current);
    } else if (status !== 'playing') {
      clearInterval(timerInterval.current);
    }
    
    return () => clearInterval(timerInterval.current);
  }, [status, timer, dispatch, state.gameDuration]);
  
  // Check for timer reaching zero
  useEffect(() => {
    if (status === 'playing' && timer === 0) {
      // End game when timer hits 0
      dispatch({ type: 'END_GAME' });
      
      // Play game over sound
      gameEndSoundRef.current.play().catch(error => {
        console.error("Error playing game-over sound:", error);
      });
      console.log("Game over sound played");
    }
  }, [timer, status, dispatch]);
  
  // Control mole appearances
  useEffect(() => {
    if (status !== 'playing') {
      setActiveMoles(Array(9).fill(false)); // Updated from 6 to 9
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
        {/* Top row (new) */}
        <div className="moles-row-top">
          {Array(3).fill().map((_, index) => (
            <Mole 
              key={index}
              moleIndex={index}
              isActive={activeMoles[index]}
              onWhack={handleWhack}
            />
          ))}
        </div>
        
        {/* Middle row (was top row) */}
        <div className="moles-row-middle">
          {Array(3).fill().map((_, index) => (
            <Mole 
              key={index + 3}
              moleIndex={index + 3}
              isActive={activeMoles[index + 3]}
              onWhack={handleWhack}
            />
          ))}
        </div>
        
        {/* Bottom row */}
        <div className="moles-row">
          {Array(3).fill().map((_, index) => (
            <Mole 
              key={index + 6}
              moleIndex={index + 6}
              isActive={activeMoles[index + 6]}
              onWhack={handleWhack}
            />
          ))}
        </div>
      </div>
      
      {renderGameResult()}
      <GameControls />
    </div>
  );
};

export default MoleGrid;

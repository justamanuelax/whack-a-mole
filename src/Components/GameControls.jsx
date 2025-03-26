import { useContext } from 'react';
import { GameContext } from '../Context/GameContext';
import '../Styles/Components/GameControls.css';

const GameControls = () => {
  const { state, dispatch } = useContext(GameContext);
  const { status, difficulty } = state;
  
  const handleStartGame = () => {
    if (status === 'ended') {
      dispatch({ type: 'RESET_GAME' });
    }
    dispatch({ type: 'START_GAME' });
  };
  
  const handlePauseGame = () => {
    if (status === 'playing') {
      dispatch({ type: 'PAUSE_GAME' });
    } else if (status === 'paused') {
      dispatch({ type: 'START_GAME' });
    }
  };
  
  const handleDifficultyChange = (e) => {
    dispatch({ type: 'SET_DIFFICULTY', payload: e.target.value });
  };
  
  return (
    <div className="game-controls">
      <div className="buttons">
        <button 
          onClick={handleStartGame}
          disabled={status === 'playing'}
        >
          {status === 'ended' ? 'Play Again' : 'Start Game'}
        </button>
        
        <button 
          onClick={handlePauseGame}
          disabled={status === 'ended'}
        >
          {status === 'paused' ? 'Resume' : 'Pause'}
        </button>
      </div>
      
      <div className="difficulty-controls">
        <label htmlFor="difficulty">Difficulty:</label>
        <select 
          id="difficulty"
          value={difficulty}
          onChange={handleDifficultyChange}
          disabled={status === 'playing'}
        >
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
      </div>
    </div>
  );
};

export default GameControls;

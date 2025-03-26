import '../Styles/Components/GameStats.css';

const GameStats = ({ score, timer }) => {
  return (
    <div className="game-stats">
      <div className="stat-item">
        <div className="stat-label">Score</div>
        <div className="stat-value">{score}</div>
      </div>
      
      <div className="stat-item">
        <div className="stat-label">Time Left</div>
        <div className="stat-value">{timer}s</div>
      </div>
    </div>
  );
};

export default GameStats;

import React from 'react';
import '../Styles/Components/GameResult.css';

const GameResult = ({ score, highScores, isNewHighScore }) => {
    return (
        <div className="game-result">
            <h2>Game Over!</h2>
            <div className="result-message">Your final score:</div>
            <div className="final-score">{score}</div>

            {isNewHighScore && (
                <div className="new-high-score">
                    🎉 New High Score! 🎉
                </div>
            )}

            <h3>High Scores</h3>
            <ol className="high-scores-list">
                {highScores.map((highScore, index) => (
                    <li key={index}>
                        {highScore.score}
                    </li>
                ))}
            </ol>
        </div>
    );
};

export default GameResult;

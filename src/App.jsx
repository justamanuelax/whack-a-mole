import { GameProvider } from './Context/GameContext';
import MoleGrid from './Components/MoleGrid';
import './Styles/WhackAMole.css';
import { useEffect, useRef } from 'react';

function App() {
  const backgroundMusicRef = useRef(null);

    useEffect(() => {
        backgroundMusicRef.current = new Audio('/src/assets/background.mp3');
        backgroundMusicRef.current.loop = true;

        const playMusic = () => {
            backgroundMusicRef.current.play().catch(error => {
                console.error("Playback failed:", error);
            });
        };

        const handleVisibilityChange = () => {
            if (document.hidden) {
                backgroundMusicRef.current.pause();
            } else {
                playMusic();
            }
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);

        playMusic();

        return () => {
            document.removeEventListener("visibilitychange", handleVisibilityChange);
            backgroundMusicRef.current.pause();
        };
    }, []);

  return (
    <GameProvider>
      <div className="whack-a-mole-game">
        <h1>Whack-a-Mole</h1>
        <MoleGrid />
      </div>
    </GameProvider>
  )
}

export default App

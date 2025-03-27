import { GameProvider } from './Context/GameContext';
import MoleGrid from './components/MoleGrid';
import './Styles/WhackAMole.css';
import { useEffect, useState, useCallback, useRef } from 'react';

function App() {
  const backgroundMusicRef = useRef(new Audio('./assets/sounds/music.mp3'));
  const [hasInteracted, setHasInteracted] = useState(false);

  const playMusic = useCallback(() => {
    const audio = backgroundMusicRef.current;
    if (audio) {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            console.log("Playback started!");
          })
          .catch(error => {
            console.error("Playback failed:", error);
            console.warn("Ensure the audio file is correctly loaded and the browser supports the format.");
          });
      } else {
        console.warn("play() method not supported by this browser.");
      }
    }
  }, []);

  useEffect(() => {
    const audio = backgroundMusicRef.current;
    audio.loop = true; // Enable looping

    const handleVisibilityChange = () => {
      if (document.hidden) {
        audio.pause();
      } else {
        playMusic();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    // Cleanup the event listener when the component unmounts
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [playMusic]);

  // Start playing when user interacts (e.g., on first click)
  const handleUserInteraction = () => {
    if (!hasInteracted) {
      setHasInteracted(true);
      playMusic();
    }
  };
  return (
    <GameProvider>
      <div className="whack-a-mole-game">
        <h1>Whack-a-Mole</h1>
        <div onClick={handleUserInteraction}>
        <h1>Click here to start the music</h1>
        </div>
        <MoleGrid />
      </div>
    </GameProvider>
  );
}

export default App;

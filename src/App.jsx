import { GameProvider } from './Context/GameContext';
import MoleGrid from './components/MoleGrid';
import './Styles/WhackAMole.css';
import { useEffect, useState, useCallback, useContext } from 'react';
import MusicBackground from './Hooks/GameLogic'; 
import { GameContext } from './Context/GameContextDefinition';
import './index.css';
import Index from './index.jsx';

// Separate internal component to access context
const GameContent = () => {
  const [hasInteracted, setHasInteracted] = useState(false);
  const { state } = useContext(GameContext);
  const { backgroundMusicRef } = MusicBackground();
  
  const playMusic = useCallback(() => {
    // How do I play the music if backgroundMusicRef is null? 
    backgroundMusicRef.current = new Audio('/assets/sounds/music.mp3');
    if (backgroundMusicRef) {
      const playPromise = backgroundMusicRef.current.play();
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
  }, [backgroundMusicRef]);
  
  useEffect(() => {
    if (backgroundMusicRef && backgroundMusicRef.current) {
      // Store the reference to the current audio element at the time the effect is created
      const audioRef = backgroundMusicRef.current;
      audioRef.volume = 0.5;
      
      // Pause the music when the tab is hidden
      const handleVisibilityChange = () => {
        if (document.hidden) {
          if (audioRef) {
            audioRef.pause();
          }
        } else if (hasInteracted && state.status !== 'ended') {
          playMusic();
        }
      };
      
      document.addEventListener('visibilitychange', handleVisibilityChange);
      
      // Cleanup the event listener when the component unmounts
      return () => {
        document.removeEventListener('visibilitychange', handleVisibilityChange);
        if (audioRef) {
          audioRef.pause();
        }
      };
    }
  }, [playMusic, hasInteracted, state.status, backgroundMusicRef]);
  
  // Start playing when user interacts (e.g., on first click)
  const handleUserInteraction = () => {
    if (!hasInteracted) {
      setHasInteracted(true);
      playMusic();
    }
  };
  
  return (
    <div className="whack-a-mole-game">
      <h1>Whack-a-Mole</h1>
      {!hasInteracted && (
        <div onClick={handleUserInteraction}>
          <h1>Click here to start the music</h1>
        </div>
      )}
      <MoleGrid />
    </div>
  );
};

function CursorFollow() {
  const cursor = document.querySelector('.cursor');
  if (!cursor) return;

  const moveCursor = (event) => {
    requestAnimationFrame(() => {
      cursor.style.left = event.pageX + 'px';
      cursor.style.top = event.pageY + 'px';
    });
  };

  const handleMouseOver = (event) => {
    if (event.target.tagName === 'BUTTON' || event.target.classList.contains('clickable') || event.target.textContent.includes('Click here to start the music')) {
      cursor.style.display = 'none';
      document.body.style.cursor = 'pointer';
    } else {
      cursor.style.display = 'block';
      document.body.style.cursor = 'none';
    }
  };

  document.addEventListener('mousemove', moveCursor);
  document.addEventListener('mouseover', handleMouseOver);

  return () => {
    document.removeEventListener('mousemove', moveCursor);
    document.removeEventListener('mouseover', handleMouseOver);
  };
}

function App() {
  useEffect(() => {
    CursorFollow();
  }, []);

  return (
    <GameProvider>
      <GameContent />
      <Index /> {/* Ensure the custom cursor is rendered */}
    </GameProvider>
  );
}

export default App;

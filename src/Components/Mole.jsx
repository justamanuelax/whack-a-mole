import { useState, useEffect, useRef, useContext } from 'react';
import '../Styles/components/Mole.css';
import { GameContext } from '../Context/GameContextDefinition';

const Mole = ({ isActive, onWhack, moleIndex }) => {
  const [status, setStatus] = useState('hidden'); // hidden, visible, whacked
  const whackSoundRef = useRef(null);
  const moleCrySoundRef = useRef(null);
  const { state } = useContext(GameContext);

  useEffect(() => {
    if (isActive && status !== 'whacked') {
      setStatus('visible');
      
      // Play mole cry sound when mole appears
      if (moleCrySoundRef.current) {
        moleCrySoundRef.current.currentTime = 0;
        
        // Set playback rate based on difficulty
        switch(state.difficulty) {
          case 'easy':
            moleCrySoundRef.current.playbackRate = 1.0; // Normal speed
            break;
          case 'medium':
            moleCrySoundRef.current.playbackRate = 2.0; // Double speed
            break;
          case 'hard':
            moleCrySoundRef.current.playbackRate = 3.0; // Triple speed
            break;
          default:
            moleCrySoundRef.current.playbackRate = 1.0;
        }
        
        moleCrySoundRef.current.play().catch(error => {
          console.error("Error playing mole cry sound:", error);
        });
      }
    } else if (!isActive && status !== 'whacked') {
      setStatus('hidden');
    }
  }, [isActive, state.difficulty, status]);

  const handleClick = () => {
    if (status === 'visible') {
      setStatus('whacked');
      onWhack(moleIndex);

      if (whackSoundRef.current) {
          whackSoundRef.current.play();
      }
      
      // Show whacked mole for 4 seconds
      setTimeout(() => {
        if (isActive) {
          setStatus('visible');
        } else {
          setStatus('hidden');
        }
      }, 3000);
    }
  };

  return (
    <div className="mole-container" onClick={handleClick} onTouchStart={handleClick}>
      <div className={`mole ${status}`}></div>
      <div className="mole-hole">
        <audio ref={whackSoundRef} src="/assets/sounds/whack.mp3" preload="auto"></audio>
        <audio ref={moleCrySoundRef} src="/assets/sounds/molecry.mp3" preload="auto"></audio>
      </div>
    </div>
  );
};

export default Mole;

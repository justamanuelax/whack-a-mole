import { useState, useEffect, useRef } from 'react';
import '../Styles/components/Mole.css';

const Mole = ({ isActive, onWhack, moleIndex }) => {
  const [status, setStatus] = useState('hidden'); // hidden, visible, whacked
  const whackSoundRef = useRef(null);

  useEffect(() => {
    if (isActive) {
      setStatus('visible');
    } else {
      setStatus('hidden');
    }
  }, [isActive]);

  const handleClick = () => {
    if (status === 'visible') {
      setStatus('whacked');
      onWhack(moleIndex);

      if (whackSoundRef.current) {
          whackSoundRef.current.play();
      }
      
      // Reset to hidden after a brief period to show the whacked state
      setTimeout(() => {
        if (!isActive) {
          setStatus('hidden');
        }
      }, 300);
    }
  };

  return (
    <div className="mole-container" onClick={handleClick} onTouchStart={handleClick}>
      <div className={`mole ${status}`}>
        <div className="mole-face"></div>
        <div className="mole-body"></div>
      </div>
      <div className="mole-hole">
        <audio ref={whackSoundRef} src="/assets/sounds/whack.mp3" preload="auto"></audio>
      </div>
    </div>
  );
};

export default Mole;

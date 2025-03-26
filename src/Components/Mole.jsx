import { useState, useEffect } from 'react';
import '../Styles/Components/Mole.css';

const Mole = ({ isActive, onWhack, moleIndex }) => {
  const [status, setStatus] = useState('hidden'); // hidden, visible, whacked

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
      
      // Reset to hidden after a brief period to show the whacked state
      setTimeout(() => {
        if (!isActive) {
          setStatus('hidden');
        }
      }, 300);
    }
  };

  return (
    <div className="mole-container" onClick={handleClick}>
      <div className={`mole ${status}`}>
        <div className="mole-face"></div>
        <div className="mole-body"></div>
      </div>
      <div className="mole-hole"></div>
    </div>
  );
};

export default Mole;

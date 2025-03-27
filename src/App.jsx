import { GameProvider } from './Context/GameContext';
import MoleGrid from './components/MoleGrid';
import './Styles/WhackAMole.css';
import { useEffect} from 'react';
import './index.css';
import Index from './index.jsx';

// Separate internal component to access context
const GameContent = () => {
  
  return (
    <div className="whack-a-mole-game">
      <h1>Whack-a-Mole</h1>
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

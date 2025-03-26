import { GameProvider } from './Context/GameContext';
import MoleGrid from './Components/MoleGrid';
import './Styles/WhackAMole.css';

function App() {
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

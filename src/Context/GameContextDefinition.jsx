import { createContext } from 'react';
import { initialState } from './GameConstants';

// Create a context to store game state
export const GameContext = createContext(initialState);
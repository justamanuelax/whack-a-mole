import React, { createContext, useReducer } from 'react';

// ...existing code...

// Define game state initial values
const initialState = {
    score: 0,
    status: 'paused', // could be 'playing', 'paused', 'ended'
    timer: 0,
    difficulty: 'easy' // could be 'easy', 'medium', 'hard'
};

// Create a context to store game state
export const GameContext = createContext(initialState);

// Reducer to handle state transitions based on actions
function gameReducer(state, action) {
    switch (action.type) {
        case 'START_GAME':
            return { ...state, status: 'playing', timer: 0, score: 0 };
        case 'PAUSE_GAME':
            return { ...state, status: 'paused' };
        case 'END_GAME':
            return { ...state, status: 'ended' };
        case 'INCREMENT_SCORE':
            return { ...state, score: state.score + action.payload };
        case 'DECREMENT_TIMER':
            return { ...state, timer: state.timer - 1 };
        case 'SET_DIFFICULTY':
            return { ...state, difficulty: action.payload };
        default:
            return state;
    }
}

// Provider component wrapping the app and managing state
export const GameProvider = ({ children }) => {
    const [state, dispatch] = useReducer(gameReducer, initialState);

    // ...existing code...
    return (
        <GameContext.Provider value={{ state, dispatch }}>
            {children}
        </GameContext.Provider>
    );
};

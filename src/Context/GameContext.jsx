import React, { createContext, useReducer } from 'react';

// Define game state initial values
const initialState = {
    score: 0,
    status: 'waiting', // 'waiting', 'playing', 'paused', 'ended'
    timer: 0,
    difficulty: 'easy', // 'easy', 'medium', 'hard'
    gameDuration: 60 // default game duration in seconds
};

// Create a context to store game state
export const GameContext = createContext(initialState);

// Reducer to handle state transitions based on actions
function gameReducer(state, action) {
    switch (action.type) {
        case 'START_GAME':
            return { 
                ...state, 
                status: 'playing', 
                timer: state.timer > 0 ? state.timer : state.gameDuration, 
                score: 0 
            };
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
        case 'SET_TIMER':
            return { ...state, timer: action.payload };
        case 'SET_GAME_DURATION':
            return { ...state, gameDuration: action.payload };
        case 'RESET_GAME':
            return initialState;
        default:
            return state;
    }
}

// Provider component wrapping the app and managing state
export const GameProvider = ({ children }) => {
    const [state, dispatch] = useReducer(gameReducer, initialState);

    return (
        <GameContext.Provider value={{ state, dispatch }}>
            {children}
        </GameContext.Provider>
    );
};

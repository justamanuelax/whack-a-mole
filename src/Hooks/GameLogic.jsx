import { createContext } from "react";

export const initialState = {
    score: 0,
    status: 'waiting', // 'waiting', 'playing', 'paused', 'ended'
    timer: 0,
    difficulty: 'easy', // 'easy', 'medium', 'hard'
    gameDuration: 60, // default game duration in seconds
    highScores: []
};
export const GameContext = createContext(initialState);

import { useRef, useEffect } from "react";

export default function MusicBackground() {
    const backgroundMusicRef = useRef(null);
    
    useEffect(() => {
        // Initialize audio in the useEffect to avoid re-creating on each render
        if (!backgroundMusicRef.current) {
            backgroundMusicRef.current = new Audio('/assets/sounds/music.mp3');
        }
        
        return () => {
            // Cleanup when component unmounts
            if (backgroundMusicRef.current) {
                backgroundMusicRef.current.pause();
                backgroundMusicRef.current = null;
            }
        };
    }, []);
    
    return { backgroundMusicRef };
}
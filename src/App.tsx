import React, { useState, useEffect, useCallback } from 'react';
import { Play, Pause, RefreshCw, Volume2, VolumeX } from 'lucide-react';

const colors = ['red', 'blue', 'green', 'yellow'];

function App() {
  const [sequence, setSequence] = useState<string[]>([]);
  const [playerSequence, setPlayerSequence] = useState<string[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isMuted, setIsMuted] = useState(false);

  const speak = useCallback((text: string) => {
    if ('speechSynthesis' in window && !isMuted) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.7; // Slow down the speech rate
      utterance.pitch = 1.2; // Slightly increase pitch for clarity
      window.speechSynthesis.speak(utterance);
    }
  }, [isMuted]);

  const addToSequence = useCallback(() => {
    const newColor = colors[Math.floor(Math.random() * colors.length)];
    setSequence((prevSequence) => [...prevSequence, newColor]);
  }, []);

  const playSequence = useCallback(() => {
    sequence.forEach((color, index) => {
      setTimeout(() => {
        const button = document.querySelector(`[data-color="${color}"]`) as HTMLButtonElement;
        button.classList.add('active');
        speak(color);
        setTimeout(() => button.classList.remove('active'), 500);
      }, (index + 1) * 1200); // Increased delay between colors
    });
  }, [sequence, speak]);

  const handleColorClick = (color: string) => {
    if (!isPlaying) return;

    const newPlayerSequence = [...playerSequence, color];
    setPlayerSequence(newPlayerSequence);
    speak(color);

    if (newPlayerSequence[newPlayerSequence.length - 1] !== sequence[newPlayerSequence.length - 1]) {
      setGameOver(true);
      setIsPlaying(false);
      speak("Game Over");
    } else if (newPlayerSequence.length === sequence.length) {
      setScore(score + 1);
      setPlayerSequence([]);
      setTimeout(() => {
        addToSequence();
      }, 1500); // Increased delay before adding new color
    }
  };

  const startGame = () => {
    setSequence([]);
    setPlayerSequence([]);
    setGameOver(false);
    setScore(0);
    setIsPlaying(true);
    addToSequence();
    speak("Game started");
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  useEffect(() => {
    if (sequence.length > 0 && isPlaying) {
      setTimeout(() => {
        playSequence();
      }, 1000); // Delay before starting the sequence
    }
  }, [sequence, isPlaying, playSequence]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-8">Simon Says</h1>
      <div className="grid grid-cols-2 gap-4 mb-8">
        {colors.map((color) => (
          <button
            key={color}
            data-color={color}
            className={`w-32 h-32 rounded-full ${color === 'red' ? 'bg-red-500' : color === 'blue' ? 'bg-blue-500' : color === 'green' ? 'bg-green-500' : 'bg-yellow-500'} transition-all duration-200 hover:opacity-80 active:opacity-100`}
            onClick={() => handleColorClick(color)}
            disabled={!isPlaying || gameOver}
          />
        ))}
      </div>
      <div className="flex space-x-4 mb-4">
        <button
          className="bg-indigo-600 text-white px-4 py-2 rounded-md flex items-center"
          onClick={startGame}
          disabled={isPlaying}
        >
          <Play className="mr-2" size={20} />
          Start Game
        </button>
        <button
          className="bg-red-600 text-white px-4 py-2 rounded-md flex items-center"
          onClick={() => setIsPlaying(false)}
          disabled={!isPlaying || gameOver}
        >
          <Pause className="mr-2" size={20} />
          Pause
        </button>
        <button
          className="bg-green-600 text-white px-4 py-2 rounded-md flex items-center"
          onClick={() => setIsPlaying(true)}
          disabled={isPlaying || gameOver}
        >
          <RefreshCw className="mr-2" size={20} />
          Resume
        </button>
        <button
          className="bg-gray-600 text-white px-4 py-2 rounded-md flex items-center"
          onClick={toggleMute}
        >
          {isMuted ? <VolumeX className="mr-2" size={20} /> : <Volume2 className="mr-2" size={20} />}
          {isMuted ? 'Unmute' : 'Mute'}
        </button>
      </div>
      <p className="mt-4 text-xl">Score: {score}</p>
      {gameOver && <p className="mt-4 text-2xl text-red-600">Game Over!</p>}
    </div>
  );
}

export default App;
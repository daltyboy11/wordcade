'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { WordScrambleQuestion } from '@/lib/word-scramble';
import { dataFetcher } from '@/lib/data/data-fetcher';

export default function WordScramble() {
  const router = useRouter();
  const [pageState, setPageState] = useState('pregame');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedTiles, setSelectedTiles] = useState<string[]>([]);
  const [scrambledTiles, setScrambledTiles] = useState<string[]>([]);
  const [data, setData] = useState<WordScrambleQuestion[]>([]);
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    const fetchGameData = async () => {
      if (data.length === 0) {
        const fetchedData = await dataFetcher.fetch('word-scramble');
        setData(fetchedData);
      }
    };
    fetchGameData();
  }, [data, dataFetcher]);

  useEffect(() => {
    if (data.length > 0) {
      setScrambledTiles(data[currentQuestion].scrambled.split(''));
    }
  }, [data, currentQuestion]);

  useEffect(() => {
    if (data.length === 0) return;
    if (selectedTiles.length === data[currentQuestion].word.length) {
      const formedWord = selectedTiles.join('');
      if (formedWord === data[currentQuestion].word) {
        if (currentQuestion < data.length - 1) {
          setCurrentQuestion(currentQuestion + 1);
          setSelectedTiles([]);
          setScrambledTiles(data[currentQuestion + 1].scrambled.split(''));
        } else {
          setPageState('postgame');
        }
      }
    }
  }, [selectedTiles, data, currentQuestion]);

  useEffect(() => {
    if (pageState === 'ingame' && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (pageState === 'ingame' && timeLeft === 0) {
      setPageState('postgame');
    }
  }, [pageState, timeLeft]);

  const handleStartGame = () => {
    setPageState('ingame');
    setCurrentQuestion(0);
    setSelectedTiles([]);
    setTimeLeft(300); // Reset the timer to 30 seconds
  };

  const handleSlotClick = (index: number) => {
    const tile = selectedTiles[index];
    if (tile) {
      setScrambledTiles([...scrambledTiles, tile]);
      const newSelectedTiles = selectedTiles.filter((_, i) => i !== index);
      setSelectedTiles(newSelectedTiles);
    }
  };

  const handleTileClick = (index: number) => {
    const tile = scrambledTiles[index];
    setSelectedTiles([...selectedTiles, tile]);
    setScrambledTiles(scrambledTiles.filter((_, i) => i !== index));
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gradient-to-r from-purple-500 to-pink-500 text-white">
      <button
        onClick={() => router.push('/')}
        className="absolute top-4 left-4 px-4 py-2 bg-purple-700 rounded-lg hover:bg-purple-800"
      >
        Back to Arcade
      </button>
      {pageState === 'pregame' && (
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Word Scramble Game</h1>
          <p className="text-xl mb-8 max-w-xl mx-auto text-left">
            Unscramble the word by clicking on the tiles. You have 30 seconds to
            unscramble as many words as you can.
          </p>
          <button
            onClick={handleStartGame}
            style={{ minWidth: '200px' }}
            className="px-6 py-3 bg-purple-700 rounded-lg hover:bg-purple-800"
          >
            Start
          </button>
        </div>
      )}

      {pageState === 'ingame' && (
        <div className="text-center">
          <div className="mb-4">
            <h1 className="text-4xl font-bold">{timeLeft}</h1>
          </div>
          <div className="flex justify-center mb-6">
            {Array(data[currentQuestion].word.length)
              .fill(null)
              .map((_, index) => (
                <div
                  key={index}
                  onClick={() => handleSlotClick(index)}
                  className="w-10 h-10 border-2 border-white mx-1 flex items-center justify-center bg-purple-700 rounded-lg cursor-pointer"
                >
                  {selectedTiles[index] || ''}
                </div>
              ))}
          </div>
          <div className="flex gap-4 justify-center min-h-20">
            {scrambledTiles.map((tile, index) => (
              <button
                key={index}
                onClick={() => handleTileClick(index)}
                className="w-10 h-10 bg-purple-700 rounded-lg hover:bg-purple-800 flex items-center justify-center"
              >
                {tile}
              </button>
            ))}
          </div>
        </div>
      )}

      {pageState === 'postgame' && (
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Game Over</h1>
          <p className="text-xl mb-8">
            Your score:{' '}
            {selectedTiles.join('') === data[currentQuestion].word ? 1 : 0}
          </p>
          <button
            onClick={handleStartGame}
            className="mt-8 px-6 py-3 bg-purple-700 rounded-lg hover:bg-purple-800"
          >
            Play Again
          </button>
        </div>
      )}
    </main>
  );
}

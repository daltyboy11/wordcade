'use client';

import { Button } from '@/components';
import { useGame } from '@/hooks/use-game';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function WordScramble() {
  const router = useRouter();
  const [selectedTiles, setSelectedTiles] = useState<(string | null)[]>([]);
  const [scrambledTiles, setScrambledTiles] = useState<(string | null)[]>([]);
  const [scrambledTilePositions, setScrambledTilePositions] = useState<
    (string | null)[]
  >([]);
  const {
    currentState,
    previousState,
    data,
    startGame,
    answerQuestion,
    timeLeft,
    score,
    currentQuestion,
    answers,
  } = useGame('word-scramble');

  useEffect(() => {
    if (data && data.length > 0) {
      const scrambled = data[currentQuestion].scrambled.split('');
      setScrambledTiles(scrambled);
      setScrambledTilePositions(scrambled.map((tile) => tile));
      setSelectedTiles(Array(scrambled.length).fill(null));
    }
  }, [data, currentQuestion]);

  useEffect(() => {
    if (!data || data.length === 0) return;
    if (
      selectedTiles.filter((tile) => tile !== null).length ===
      data[currentQuestion].word.length
    ) {
      const formedWord = selectedTiles.join('');
      answerQuestion(formedWord);
      setSelectedTiles(Array(data[currentQuestion].word.length).fill(null));
      if (currentQuestion < data.length - 1) {
        const nextScrambled = data[currentQuestion + 1].scrambled.split('');
        setScrambledTiles(nextScrambled);
        setScrambledTilePositions(nextScrambled.map((tile) => tile));
      }
    }
  }, [selectedTiles, data, currentQuestion]);

  const handleSlotClick = (index: number) => {
    const tile = selectedTiles[index];
    if (tile) {
      const scrambledIndex = scrambledTilePositions.findIndex(
        (t) => t === null
      );
      if (scrambledIndex !== -1) {
        setScrambledTiles((prev) => {
          const newScrambled = [...prev];
          newScrambled[scrambledIndex] = tile;
          return newScrambled;
        });
        setScrambledTilePositions((prev) => {
          const newPositions = [...prev];
          newPositions[scrambledIndex] = tile;
          return newPositions;
        });
        const newSelectedTiles = [...selectedTiles];
        newSelectedTiles[index] = null;
        setSelectedTiles(newSelectedTiles);
      }
    }
  };

  const handleTileClick = (index: number) => {
    const tile = scrambledTiles[index];
    setSelectedTiles((prev) => {
      const newSelected = [...prev];
      const emptyIndex = newSelected.findIndex((t) => t === null);
      if (emptyIndex !== -1) {
        newSelected[emptyIndex] = tile;
      }
      return newSelected;
    });
    setScrambledTiles((prev) => {
      const newScrambled: (string | null)[] = [...prev];
      newScrambled[index] = null;
      return newScrambled;
    });
    setScrambledTilePositions((prev) => {
      const newPositions = [...prev];
      newPositions[index] = null;
      return newPositions;
    });
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gradient-to-r from-purple-500 to-pink-500 text-white">
      <button
        onClick={() => router.push('/')}
        className="absolute top-4 left-4 px-4 py-2 bg-purple-700 rounded-lg hover:bg-purple-800"
      >
        Back to Arcade
      </button>
      {(currentState === 'pregame' ||
        (currentState === 'loading-ingame' && previousState === 'pregame')) && (
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Word Scramble</h1>
          <p className="text-xl mb-8 max-w-xl mx-auto text-left">
            Unscramble the word by clicking on the tiles.
          </p>
          <Button
            onClick={startGame}
            isLoading={currentState === 'loading-ingame'}
            loadingText="Claude is creating a game"
          >
            Start
          </Button>
        </div>
      )}

      {currentState === 'ingame' && data && (
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

      {(currentState === 'postgame' ||
        (currentState === 'loading-ingame' && previousState === 'postgame')) &&
        data && (
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Game Over</h1>
            <p className="text-xl mb-8">Your score: {score}</p>
            <h2 className="text-2xl mb-4 text-left">Your Answers:</h2>
            <ul className="list-disc list-inside text-left">
              {answers.map(({ isCorrect, rawAnswer }, index) => {
                const question = data[index];
                const correctAnswer = question.word;
                return (
                  <li key={index} className="mb-2 italic">
                    {question.scrambled}{' '}
                    {isCorrect ? (
                      <span className="text-green-500 not-italic">
                        <b>+1</b> {rawAnswer}
                      </span>
                    ) : (
                      <span className="text-orange-300 not-italic">
                        <b>-1</b> {rawAnswer} (Correct: {correctAnswer})
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>
            <Button
              onClick={startGame}
              isLoading={currentState === 'loading-ingame'}
              loadingText="Claude is creating a game"
            >
              Play Again
            </Button>
          </div>
        )}
    </main>
  );
}

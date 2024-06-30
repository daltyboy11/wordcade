'use client';

import { useGame } from '@/hooks/use-game';
import { WordScrambleQuestion } from '@/lib/word-scramble';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ClipLoader } from 'react-spinners';

const validateWordScrambleAnswer = (
  question: WordScrambleQuestion,
  answer: string
) => {
  return question.word === answer;
};

export default function WordScramble() {
  const router = useRouter();
  const [selectedTiles, setSelectedTiles] = useState<string[]>([]);
  const [scrambledTiles, setScrambledTiles] = useState<string[]>([]);
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
  } = useGame('word-scramble', validateWordScrambleAnswer);

  useEffect(() => {
    if (data && data.length > 0) {
      setScrambledTiles(data[currentQuestion].scrambled.split(''));
    }
  }, [data, currentQuestion]);

  useEffect(() => {
    if (!data || data.length === 0) return;
    if (selectedTiles.length === data[currentQuestion].word.length) {
      const formedWord = selectedTiles.join('');
      answerQuestion(formedWord);
      setSelectedTiles([]);
      if (currentQuestion < data.length - 1) {
        setScrambledTiles(data[currentQuestion + 1].scrambled.split(''));
      }
    }
  }, [selectedTiles, data, currentQuestion]);

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
      {(currentState === 'pregame' ||
        (currentState === 'loading-ingame' && previousState === 'pregame')) && (
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Word Scramble Game</h1>
          <p className="text-xl mb-8 max-w-xl mx-auto text-left">
            Unscramble the word by clicking on the tiles. You have 30 seconds to
            unscramble as many words as you can.
          </p>
          <button
            onClick={startGame}
            style={{ minWidth: '200px' }}
            className="px-6 py-3 bg-purple-700 rounded-lg hover:bg-purple-800"
          >
            {currentState === 'loading-ingame' ? (
              <ClipLoader color="#fff" size={16} />
            ) : (
              'Start'
            )}
          </button>
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
                        ✅ {rawAnswer}
                      </span>
                    ) : (
                      <span className="text-orange-300 not-italic">
                        ❌ {rawAnswer} (Correct: {correctAnswer})
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>
            <button
              onClick={startGame}
              style={{ minWidth: '200px' }}
              className="mt-8 px-6 py-3 bg-purple-700 rounded-lg hover:bg-purple-800"
            >
              {currentState === 'loading-ingame' ? (
                <ClipLoader color="#fff" size={16} />
              ) : (
                'Play Again'
              )}
            </button>
          </div>
        )}
    </main>
  );
}

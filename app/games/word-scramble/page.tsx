'use client';

import { Button, PreGameHeader } from '@/components';
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
    questions,
    startGame,
    answerQuestion,
    playCorrectSound,
    playWrongSound,
    timeLeft,
    score,
    currentQuestion,
    answers,
  } = useGame('word-scramble');
  const [intermediateState, setIntermediateState] = useState<
    'correct' | 'incorrect' | null
  >(null);

  const handleAnswer = (answer: { guess: string; scrambled: string }) => {
    const isCorrect = answerQuestion(answer);
    setIntermediateState(isCorrect ? 'correct' : 'incorrect');
    if (isCorrect) {
      playCorrectSound();
    } else {
      playWrongSound();
    }
    setTimeout(() => {
      setIntermediateState(null);
    }, 400); // Duration of the intermediate state
  };

  const scrambleWord = (word: string): string[] => {
    if (word.length < 2) {
      return word.split('');
    }

    let scrambled = word.split('');

    // Helper function to shuffle an array
    const shuffleArray = (array: string[]): string[] => {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    };

    // Shuffle until the scrambled word is different from the original word
    do {
      scrambled = shuffleArray(word.split(''));
    } while (scrambled.join('') === word);

    return scrambled;
  };

  useEffect(() => {
    if (questions && questions.length > 0) {
      const scrambled = scrambleWord(questions[currentQuestion].word);
      setScrambledTiles(scrambled);
      setScrambledTilePositions(scrambled.map((tile) => tile));
      setSelectedTiles(Array(scrambled.length).fill(null));
    }
  }, [questions, currentQuestion]);

  useEffect(() => {
    if (!questions || questions.length === 0) return;
    if (
      selectedTiles.filter((tile) => tile !== null).length ===
      questions[currentQuestion].word.length
    ) {
      const formedWord = selectedTiles.join('');
      const answer = {
        guess: formedWord,
        scrambled: scrambledTiles.join(''),
      };
      handleAnswer(answer);
      setSelectedTiles(
        Array(questions[currentQuestion].word.length).fill(null)
      );
      if (currentQuestion < questions.length - 1) {
        const nextScrambled = scrambleWord(questions[currentQuestion + 1].word);
        setScrambledTiles(nextScrambled);
        setScrambledTilePositions(nextScrambled.map((tile) => tile));
      }
    }
  }, [selectedTiles, questions, currentQuestion]);

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
        <PreGameHeader
          title="Word Scramble"
          description="Unscramble the word by clicking on the tiles."
          isLoading={currentState === 'loading-ingame'}
          onClick={startGame}
        />
      )}

      {currentState === 'ingame' && questions && (
        <div className="text-center">
          <div className="mb-4">
            <h1 className="text-4xl font-bold">{timeLeft}</h1>
          </div>
          <div className="flex justify-center mb-6 w-full flex-nowrap">
            {intermediateState ? (
              <h2
                className={`text-2xl mb-6 font-bold transition-colors duration-300 ${intermediateState === 'correct' ? 'text-green-500' : 'text-orange-400'}`}
              >
                {intermediateState === 'correct' ? 'Correct' : 'Incorrect'}
              </h2>
            ) : (
              Array(questions[currentQuestion].word.length)
                .fill(null)
                .map((_, index) => (
                  <div
                    key={index}
                    onClick={() => handleSlotClick(index)}
                    className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 border-2 border-white mx-1 flex items-center justify-center bg-purple-700 rounded-lg cursor-pointer"
                  >
                    {selectedTiles[index] || ''}
                  </div>
                ))
            )}
          </div>
          <div className="flex gap-2 justify-center min-h-20 flex-wrap">
            {scrambledTiles.map((tile, index) => (
              <button
                key={index}
                onClick={() => handleTileClick(index)}
                className={`w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 bg-purple-700 rounded-lg active:bg-purple-800 flex items-center justify-center ${
                  intermediateState
                    ? `${intermediateState === 'correct' ? 'bg-gray-400' : 'bg-orange-600'} cursor-not-allowed`
                    : ''
                }`}
                disabled={!!intermediateState}
              >
                {intermediateState ? '' : tile}
              </button>
            ))}
          </div>
        </div>
      )}

      {(currentState === 'postgame' ||
        (currentState === 'loading-ingame' && previousState === 'postgame')) &&
        questions && (
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Game Over</h1>
            <p className="text-xl text-left mb-2">Score: {score}</p>
            <p className="text-xl mb-4 text-left">
              You answered {answers.length}/{questions.length} questions
            </p>
            <h2 className="text-2xl mb-4 text-left">Answers:</h2>
            <div className="bg-white text-black rounded-lg p-4 shadow-lg max-w-md mx-auto">
              <ol className="list-decimal list-inside text-left">
                {answers.map(({ isCorrect, rawAnswer }, index) => {
                  const { guess, scrambled } = rawAnswer;
                  const question = questions[index];
                  const correctAnswer = question.word;
                  return (
                    <li key={index} className="mb-2 italic">
                      {scrambled}{' '}
                      {isCorrect ? (
                        <span className="text-green-500 not-italic">
                          {guess}
                        </span>
                      ) : (
                        <span className="text-orange-400 not-italic">
                          {guess} (Correct: {correctAnswer})
                        </span>
                      )}
                    </li>
                  );
                })}
              </ol>
            </div>
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

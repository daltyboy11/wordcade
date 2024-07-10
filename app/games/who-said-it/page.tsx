'use client';

import { useRouter } from 'next/navigation';
import { useGame } from '@/hooks/use-game';
import { Button } from '@/components';
import { useState } from 'react';

export default function WhoSaidIt() {
  const router = useRouter();
  const {
    currentState,
    previousState,
    questions,
    startGame,
    answerQuestion,
    timeLeft,
    score,
    currentQuestion,
    answers,
    playCorrectSound,
    playWrongSound,
  } = useGame('who-said-it');
  const [intermediateState, setIntermediateState] = useState<
    'correct' | 'incorrect' | null
  >(null);

  const handleAnswer = (index: number) => {
    const isCorrect = answerQuestion(index);
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
          <h1 className="text-4xl font-bold mb-4">Who Said It?</h1>
          <p className="text-xl mb-8 max-w-xl mx-auto text-left">
            Guess the author of the quote.
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

      {currentState === 'ingame' && questions && (
        <div className="text-center" style={{ minWidth: '300px' }}>
          <div className="mb-4">
            <h1 className="text-4xl font-bold" style={{ minWidth: '200px' }}>
              {timeLeft}
            </h1>
          </div>
          <p
            className={`text-xl mb-6 max-w-xl mx-auto h-24 italic transition-colors duration-300 ${
              intermediateState === 'correct'
                ? 'font-bold not-italic text-green-500'
                : intermediateState === 'incorrect'
                  ? 'font-bold not-italic text-orange-400'
                  : ''
            }`}
          >
            {intermediateState
              ? intermediateState === 'correct'
                ? 'Correct'
                : 'Incorrect'
              : `${questions[currentQuestion].quote}`}
          </p>
          <div className="flex flex-col items-center gap-4">
            {questions[
              intermediateState ? currentQuestion - 1 : currentQuestion
            ].options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(index)}
                className={`px-6 py-3 rounded-lg transition-colors duration-400 ${
                  intermediateState
                    ? `${intermediateState === 'correct' ? 'bg-gray-400' : 'bg-orange-600'} cursor-not-allowed`
                    : 'bg-purple-700 active:bg-purple-800 hover:bg-purple-800'
                } w-64`}
                disabled={!!intermediateState}
              >
                {option}
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
                  const question = questions[index];
                  const answer = question.options[rawAnswer];
                  const correctAnswer = question.options[question.answer];
                  return (
                    <li key={index} className="mb-2 italic">
                      {question.quote}{' '}
                      {isCorrect ? (
                        <span className="text-green-500 not-italic">
                          {answer}
                        </span>
                      ) : (
                        <span className="text-orange-400 not-italic">
                          {answer} (Correct: {correctAnswer})
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

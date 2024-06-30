'use client';

import { useRouter } from 'next/navigation';
import { WhoSaidItQuestion } from '@/lib/who-said-it';
import { useGame } from '@/hooks/use-game';
import { ClipLoader } from 'react-spinners';

const validateWhoSaidItAnswer = (
  question: WhoSaidItQuestion,
  answerIndex: number
) => {
  return question.answer === answerIndex;
};

export default function WhoSaidIt() {
  const router = useRouter();
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
  } = useGame('who-said-it', validateWhoSaidItAnswer);

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
            Guess the originator of the quote. You have 30 seconds to answer as
            many as you can.
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
        <div className="text-center" style={{ minWidth: '300px' }}>
          <div className="mb-4">
            <h1 className="text-4xl font-bold" style={{ minWidth: '200px' }}>
              {timeLeft}
            </h1>
          </div>
          <p className="text-xl mb-6 max-w-xl mx-auto h-24 italic">
            {data[currentQuestion].quote}
          </p>
          <div className="flex flex-col items-center gap-4">
            {data[currentQuestion].options.map((option, index) => (
              <button
                key={index}
                onClick={() => answerQuestion(index)}
                className="px-6 py-3 bg-purple-700 rounded-lg hover:bg-purple-800 w-64"
              >
                {option}
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
                const answer = question.options[rawAnswer];
                const correctAnswer = question.options[question.answer];
                return (
                  <li key={index} className="mb-2 italic">
                    {question.quote}{' '}
                    {isCorrect ? (
                      <span className="text-green-500 not-italic">
                        ✅ {answer}
                      </span>
                    ) : (
                      <span className="text-orange-300 not-italic">
                        ❌ {answer} (Correct: {correctAnswer})
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>
            <button
              onClick={startGame}
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

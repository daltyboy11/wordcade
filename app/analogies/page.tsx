'use client';

import { useGame } from '@/hooks/use-game';
import { AnalogyQuestion } from '@/lib/analogies';
import { useRouter } from 'next/navigation';
import { ClipLoader } from 'react-spinners';

const validateAnalogyAnswer = (
  question: AnalogyQuestion,
  answerIndex: number
): boolean => {
  return question.options[answerIndex].isCorrect;
};

export default function Analogies() {
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
  } = useGame('analogies', validateAnalogyAnswer);

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
          <h1 className="text-4xl font-bold mb-4">Analogies Game</h1>
          <p className="text-xl mb-8 max-w-xl mx-auto text-left">
            Determine the relationship between the given pair of words and
            choose the option that has a similar relationship. You have 30
            seconds to answer as many as you can.
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
          <h2 className="text-2xl mb-6">
            {data[currentQuestion].prompt.A} ={'>'}
            {data[currentQuestion].prompt.B}
          </h2>
          <div className="grid gap-4">
            {data[currentQuestion].options.map((option, index) => (
              <button
                key={index}
                onClick={() => answerQuestion(index)}
                className="px-6 py-3 bg-purple-700 rounded-lg hover:bg-purple-800"
              >
                {option.optionText}
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
              {answers.map((isCorrect, index) => {
                const question = data[index];
                return (
                  <li key={index} className="mb-2">
                    {question.prompt.A} ={'>'} {question.prompt.B}:{' '}
                    {isCorrect ? (
                      <span className="text-green-500">
                        ✅{' '}
                        {
                          question.options.find((option) => option.isCorrect)
                            ?.optionText
                        }
                      </span>
                    ) : (
                      <span className="text-orange-700">
                        ❌{' '}
                        {
                          question.options.find((option) => !option.isCorrect)
                            ?.optionText
                        }{' '}
                        (Correct:{' '}
                        {
                          question.options.find((option) => option.isCorrect)
                            ?.optionText
                        }
                        )
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

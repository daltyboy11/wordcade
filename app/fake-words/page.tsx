'use client';

import { useGame } from '@/hooks/use-game';
import { FakeWordQuestion } from '@/lib/fake-words';
import { useRouter } from 'next/navigation';
import { ClipLoader } from 'react-spinners';

const validateFakeWordAnswer = (question: FakeWordQuestion, real: boolean) => {
  return question.real === real;
};

export default function FakeWords() {
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
  } = useGame('fake-words', validateFakeWordAnswer);

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
          <h1 className="text-4xl font-bold mb-4">Fake Words Game</h1>
          <p className="text-xl mb-8 max-w-xl mx-auto text-left">
            Determine if the word and its definition are real or fake. A correct
            answer is +1 point. A wrong answer is -1 point. You have 30 seconds
            to answer as many as you can.
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
          <h2 className="text-2xl mb-6">{data[currentQuestion].word}</h2>
          <p className="text-xl mb-6 max-w-xl mx-auto h-24">
            {data[currentQuestion].definition}
          </p>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => answerQuestion(true)}
              className="px-6 py-3 bg-purple-700 rounded-lg hover:bg-purple-800 w-32"
            >
              Real
            </button>
            <button
              onClick={() => answerQuestion(false)}
              className="px-6 py-3 bg-purple-700 rounded-lg hover:bg-purple-800 w-32"
            >
              Fake
            </button>
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
                return (
                  <li key={index} className="mb-2">
                    {question.word}:{' '}
                    {isCorrect ? (
                      <span className="text-green-500">
                        ✅ {question.real ? 'Real' : 'Fake'}
                      </span>
                    ) : (
                      <span className="text-orange-700">
                        ❌ {rawAnswer ? 'Real' : 'Fake'} (Correct:{' '}
                        {question.real ? 'Real' : 'Fake'})
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

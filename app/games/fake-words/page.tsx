'use client';

import { Button } from '@/components';
import { useGame } from '@/hooks/use-game';
import { useRouter } from 'next/navigation';

export default function FakeWords() {
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
  } = useGame('fake-words');

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
          <h1 className="text-4xl font-bold mb-4">Fake Words</h1>
          <p className="text-xl mb-8 max-w-xl mx-auto text-left">
            Determine if the word is real or fake.
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
          <h2 className="text-2xl mb-6">{questions[currentQuestion].word}</h2>
          <p className="text-xl mb-6 max-w-xl mx-auto h-24">
            {questions[currentQuestion].definition}
          </p>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => answerQuestion(true)}
              className="px-6 py-3 bg-purple-700 rounded-lg active:bg-purple-800 w-32"
            >
              Real
            </button>
            <button
              onClick={() => answerQuestion(false)}
              className="px-6 py-3 bg-purple-700 rounded-lg active:bg-purple-800 w-32"
            >
              Fake
            </button>
          </div>
        </div>
      )}

      {(currentState === 'postgame' ||
        (currentState === 'loading-ingame' && previousState === 'postgame')) &&
        questions && (
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Game Over</h1>
            <p className="text-xl text-left">Your score: {score}</p>
            <p className="text-xl mb-2 text-left">
              Your answered {answers.length}/{questions.length} questions
            </p>
            <h2 className="text-2xl mb-4 text-left">Your Answers:</h2>
            <ul className="list-disc list-inside text-left">
              {answers.map(({ isCorrect, rawAnswer }, index) => {
                const question = questions[index];
                return (
                  <li key={index} className="mb-2">
                    {question.word}:{' '}
                    {isCorrect ? (
                      <span className="text-green-500">
                        <b>+1</b> {question.real ? 'Real' : 'Fake'}
                      </span>
                    ) : (
                      <span className="text-orange-300">
                        <b>-1</b> {rawAnswer ? 'Real' : 'Fake'} (Correct:{' '}
                        {question.real ? 'Real' : 'Fake'})
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

'use client';

import { Button } from '@/components';
import { useGame } from '@/hooks/use-game';
import { useRouter } from 'next/navigation';

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
  } = useGame('analogies');

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
          <h1 className="text-4xl font-bold mb-4">Analogies</h1>
          <p className="text-xl mb-8 max-w-xl mx-auto text-left">
            Determine the relationship between the pair of words and choose the
            option that most closely matches that relationship.
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
        <div className="text-center" style={{ minWidth: '300px' }}>
          <div className="mb-4">
            <h1 className="text-4xl font-bold" style={{ minWidth: '200px' }}>
              {timeLeft}
            </h1>
          </div>
          <h2 className="text-2xl mb-6">
            {data[currentQuestion].prompt.A} ={'> '}
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
            <p className="text-xl text-left">Your score: {score}</p>
            <p className="text-xl mb-2 text-left">
              Your answered {answers.length}/{data.length} questions
            </p>
            <h2 className="text-2xl mb-4 text-left">Your Answers:</h2>
            <ul className="list-disc list-inside text-left">
              {answers.map(({ isCorrect, rawAnswer }, index) => {
                const question = data[index];
                const answerText = question.options[rawAnswer].optionText;
                const correctAnswerText = question.options.find(
                  (option) => option.isCorrect
                )?.optionText;
                return (
                  <li key={index} className="mb-2">
                    {question.prompt.A} ={'>'} {question.prompt.B}:{' '}
                    {isCorrect ? (
                      <span className="text-green-500">
                        <b>+1</b> {answerText}
                      </span>
                    ) : (
                      <span className="text-orange-300">
                        <b>-1</b> {answerText} (Correct: {correctAnswerText})
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

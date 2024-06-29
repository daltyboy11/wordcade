'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import sampleData from '../../lib/analogies/example.json';

type Analogy = {
  prompt: {
    A: string;
    B: string;
  };
  options: { optionText: string; isCorrect: boolean }[];
  explanation: string;
};

export default function Analogies() {
  const router = useRouter();
  const [pageState, setPageState] = useState('pregame');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [data, setData] = useState<Analogy[]>([]);

  useEffect(() => {
    // TODO - fetch data from Claude
    if (data.length === 0) {
      setData(sampleData);
    }
  }, []);

  useEffect(() => {
    if (pageState === 'ingame' && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setPageState('postgame');
    }
  }, [pageState, timeLeft]);

  const handleStartGame = () => {
    setPageState('ingame');
    setCurrentQuestion(0);
    setScore(0);
    setTimeLeft(30);
    setAnswers([]);
  };

  const handleAnswer = (isCorrect: boolean) => {
    setAnswers([...answers, isCorrect]);
    if (isCorrect) {
      setScore(score + 1);
    } else {
      setScore(score - 1);
    }
    if (currentQuestion < data.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setPageState('postgame');
    }
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
          <h1 className="text-4xl font-bold mb-4">Analogies Game</h1>
          <p className="text-xl mb-8 max-w-xl mx-auto text-left">
            Determine the relationship between the given pair of words and
            choose the option that has a similar relationship. You have 30
            seconds to answer as many as you can.
          </p>
          <button
            onClick={handleStartGame}
            className="px-6 py-3 bg-purple-700 rounded-lg hover:bg-purple-800"
          >
            Start Game
          </button>
        </div>
      )}

      {pageState === 'ingame' && (
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
                onClick={() => handleAnswer(option.isCorrect)}
                className="px-6 py-3 bg-purple-700 rounded-lg hover:bg-purple-800"
              >
                {option.optionText}
              </button>
            ))}
          </div>
        </div>
      )}

      {pageState === 'postgame' && (
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

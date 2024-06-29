'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

const data = [
  { word: 'blateration', definition: 'the act of incessantly babbling or chattering', real: true },
  { word: 'quizzacious', definition: 'full of questions; inquisitive', real: false },
  { word: 'flibbertigibbet', definition: 'a frivolous, flighty, or excessively talkative person', real: true },
  { word: 'snollygoster', definition: 'a shrewd, unprincipled person, especially a politician', real: true },
  { word: 'gobbledygook', definition: 'language that is meaningless or hard to understand; nonsense', real: true },
  { word: 'widdershins', definition: 'in a direction contrary to the sun\'s course; counterclockwise', real: true },
  { word: 'mugwump', definition: 'a person who remains aloof or independent, especially from party politics', real: true },
  { word: 'absquatulate', definition: 'to leave abruptly; to decamp', real: true },
  { word: 'rambunctious', definition: 'uncontrollably exuberant; boisterous', real: true },
  { word: 'fudgel', definition: 'pretending to work when you\'re not actually doing anything at all', real: false },
];

export default function FakeWords() {
  const router = useRouter();
  const [pageState, setPageState] = useState('pregame');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [answers, setAnswers] = useState<boolean[]>([]);

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

  const handleAnswer = (isReal: boolean) => {
    setAnswers([...answers, isReal]);
    if (isReal === data[currentQuestion].real) {
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
          <h1 className="text-4xl font-bold mb-4">Fake Words Game</h1>
          <p className="text-xl mb-8 max-w-xl mx-auto text-left">
             Determine if the word and its definition are real or fake. You have 30 seconds to answer as many as you can.
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
          <h2 className="text-2xl mb-6">{data[currentQuestion].word}</h2>
          <p className="text-xl mb-6">{data[currentQuestion].definition}</p>
          <div className="grid gap-4">
            <button
              onClick={() => handleAnswer(true)}
              className="px-6 py-3 bg-purple-700 rounded-lg hover:bg-purple-800"
            >
              Real
            </button>
            <button
              onClick={() => handleAnswer(false)}
              className="px-6 py-3 bg-purple-700 rounded-lg hover:bg-purple-800"
            >
              Fake
            </button>
          </div>
        </div>
      )}

      {pageState === 'postgame' && (
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Game Over</h1>
          <p className="text-xl mb-8">Your score: {score}</p>
          <h2 className="text-2xl mb-4">Your Answers:</h2>
          <ul className="list-disc list-inside text-left">
            {answers.map((answer, index) => {
              const question = data[index];
              const isCorrect = answer === question.real;
              return (
                <li key={index} className="mb-2">
                  {question.word}: {isCorrect ? (
                    <span className="text-green-500">✅ {question.real ? 'Real' : 'Fake'}</span>
                  ) : (
                    <span className="text-orange-700">
                      ❌ {answer ? 'Real' : 'Fake'} (Correct: {question.real ? 'Real' : 'Fake'})
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

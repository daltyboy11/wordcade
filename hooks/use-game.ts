import { useState, useEffect, useCallback } from 'react';
import { Game, GameQuestion, dataFetcher } from '@/lib/data/data-fetcher';

type GameState = 'pregame' | 'loading-ingame' | 'ingame' | 'postgame';

interface UseGameReturnType<T extends Game> {
  currentState: GameState;
  previousState?: GameState;
  data?: GameQuestion[T][];
  fetchData: () => Promise<void>;
  startGame: () => void;
  answerQuestion: (answer: any) => void; // Modified to accept a flexible answer type
  timeLeft: number;
  score: number;
  currentQuestion: number;
  answers: boolean[];
}

export function useGame<T extends Game>(
  gameType: T,
  validateAnswer: (question: GameQuestion[T], answer: any) => boolean
): UseGameReturnType<T> {
  const [pageState, setPageState] = useState<{
    prev?: GameState;
    current: GameState;
  }>({ current: 'pregame' });
  const [data, setData] = useState<GameQuestion[T][]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [answers, setAnswers] = useState<boolean[]>([]);

  const fetchData = useCallback(async () => {
    setPageState((prevState) => ({
      prev: prevState.current,
      current: 'loading-ingame',
    }));

    const fetchedData = await dataFetcher.fetch(gameType);
    setData(fetchedData);
    setCurrentQuestion(0);
    setScore(0);
    setTimeLeft(30);
    setAnswers([]);
    setPageState((prevState) => ({
      prev: prevState.current,
      current: 'ingame',
    }));
  }, [gameType]);

  const startGame = useCallback(() => {
    fetchData();
  }, [fetchData]);

  const answerQuestion = useCallback(
    (answer: any) => {
      const isCorrect = validateAnswer(data[currentQuestion], answer);
      setAnswers((prevAnswers) => [...prevAnswers, isCorrect]);
      setScore((prevScore) => (isCorrect ? prevScore + 1 : prevScore - 1));
      if (currentQuestion < data.length - 1) {
        setCurrentQuestion((prevQuestion) => prevQuestion + 1);
      } else {
        setPageState((prevState) => ({
          prev: prevState.current,
          current: 'postgame',
        }));
      }
    },
    [currentQuestion, data, validateAnswer]
  );

  useEffect(() => {
    if (pageState.current === 'ingame' && timeLeft > 0) {
      const timer = setTimeout(
        () => setTimeLeft((prevTime) => prevTime - 1),
        1000
      );
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setPageState((prevState) => ({
        prev: prevState.current,
        current: 'postgame',
      }));
    }
  }, [pageState.current, timeLeft]);

  return {
    currentState: pageState.current,
    previousState: pageState.prev,
    data,
    fetchData,
    startGame,
    answerQuestion,
    timeLeft,
    score,
    currentQuestion,
    answers,
  };
}

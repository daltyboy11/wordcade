import { useState, useEffect, useCallback } from 'react';
import { Game, GameQuestion } from '@/lib/data/data-fetcher';
import { AnalogyQuestion } from '@/lib/analogies';
import { AntonymQuestion } from '@/lib/antonyms';
import { FakeWordQuestion } from '@/lib/fake-words';
import { SynonymQuestion } from '@/lib/synonyms';
import { WhoSaidItQuestion } from '@/lib/who-said-it';
import { WordScrambleQuestion } from '@/lib/word-scramble';
import useSound from 'use-sound';

type GameState = 'pregame' | 'loading-ingame' | 'ingame' | 'postgame';

interface UseGameReturnType<T extends Game> {
  currentState: GameState;
  previousState?: GameState;
  questions?: GameQuestion[T][];
  fetchData: () => Promise<void>;
  startGame: () => void;
  answerQuestion: (answer: any) => boolean;
  timeLeft: number;
  score: number;
  currentQuestion: number;
  answers: { isCorrect: boolean; rawAnswer: any }[];
  playCorrectSound: () => void;
  playWrongSound: () => void;
}

const validators = {
  analogies: (question: AnalogyQuestion, answerIndex: number): boolean =>
    question.options[answerIndex].isCorrect,
  antonyms: (question: AntonymQuestion, answerIndex: number): boolean =>
    question.answer === answerIndex,
  'fake-words': (question: FakeWordQuestion, real: boolean): boolean =>
    question.real === real,
  synonyms: (question: SynonymQuestion, answerIndex: number): boolean =>
    question.answer === answerIndex,
  'who-said-it': (question: WhoSaidItQuestion, answerIndex: number): boolean =>
    question.answer === answerIndex,
  'word-scramble': (
    question: WordScrambleQuestion,
    answer: { guess: string; scrambled: string }
  ): boolean => question.word === answer.guess,
};

function getValidator<T extends Game>(
  gameType: T
): (question: GameQuestion[T], answer: any) => boolean {
  return validators[gameType] as (
    question: GameQuestion[T],
    answer: any
  ) => boolean;
}

export function useGame<T extends Game>(gameType: T): UseGameReturnType<T> {
  const [pageState, setPageState] = useState<{
    prev?: GameState;
    current: GameState;
  }>({ current: 'pregame' });
  const [questions, setQuestions] = useState<GameQuestion[T][]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [answers, setAnswers] = useState<
    { isCorrect: boolean; rawAnswer: any }[]
  >([]);
  const [_playCorrectSound] = useSound('/sounds/correct-answer-tone.wav');
  const [_playWrongSound] = useSound('/sounds/wrong-answer-tone.wav');

  // Maintain a history of the conversation, to be passed to the messages API on game replays,
  // in the hopes of Claude being less repetitive in his responses.
  const [history, setHistory] = useState<string[]>([]);

  const fetchData = useCallback(async () => {
    setPageState((prevState) => ({
      prev: prevState.current,
      current: 'loading-ingame',
    }));

    try {
      const response = await fetch('/games', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ game: gameType, history }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch game data');
      }

      const { gameData } = await response.json();
      setQuestions(gameData);
      setCurrentQuestion(0);
      setScore(0);
      setTimeLeft(30);
      setAnswers([]);
      const newHistory = [...history, JSON.stringify(gameData)];
      setHistory(newHistory);
      setPageState((prevState) => ({
        prev: prevState.current,
        current: 'ingame',
      }));
    } catch (error) {
      console.error('Error fetching game data:', error);
      setPageState((prevState) => ({
        prev: prevState.current,
        current: 'pregame',
      }));
    }
  }, [gameType, history]);

  const startGame = useCallback(() => {
    fetchData();
  }, [fetchData]);

  const answerQuestion = useCallback(
    (answer: any) => {
      const validator = getValidator(gameType);
      const isCorrect = validator(questions[currentQuestion], answer);
      setAnswers((prevAnswers) => [
        ...prevAnswers,
        { isCorrect, rawAnswer: answer },
      ]);
      setScore((prevScore) => (isCorrect ? prevScore + 1 : prevScore));
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion((prevQuestion) => prevQuestion + 1);
      } else {
        setPageState((prevState) => ({
          prev: prevState.current,
          current: 'postgame',
        }));
      }
      return isCorrect;
    },
    [currentQuestion, questions, gameType]
  );

  useEffect(() => {
    if (pageState.current !== 'ingame') return;
    if (timeLeft > 0) {
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
    questions,
    fetchData,
    startGame,
    answerQuestion,
    timeLeft,
    score,
    currentQuestion,
    answers,
    playCorrectSound: () => _playCorrectSound(),
    playWrongSound: () => _playWrongSound(),
  };
}

import sampleData from './example.json';

export type AnalogyQuestion = {
  prompt: {
    A: string;
    B: string;
  };
  options: { optionText: string; isCorrect: boolean }[];
  explanation: string;
};

export const analogySampleData = sampleData;

import sampleData from './example.json';

export type WhoSaidItQuestion = {
  quote: string;
  options: string[];
  answer: number;
};

export const whoSaidItSampleData = sampleData;

export type AnalogyQuestion = {
  prompt: {
    A: string;
    B: string;
  };
  options: { optionText: string; isCorrect: boolean }[];
  explanation: string;
};

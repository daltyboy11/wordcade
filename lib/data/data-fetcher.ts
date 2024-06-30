import Anthropic from '@anthropic-ai/sdk';
import { AnalogyQuestion, analogySampleData } from '../analogies';
import { AntonymQuestion, antonymsSampleData } from '../antonyms';
import { FakeWordQuestion, fakeWordSampleData } from '../fake-words';
import { SynonymQuestion, synonymSampleData } from '../synonyms';
import { WhoSaidItQuestion, whoSaidItSampleData } from '../who-said-it';
import { WordScrambleQuestion, wordScrambleSampleData } from '../word-scramble';

export type Game =
  | 'analogies'
  | 'antonyms'
  | 'fake-words'
  | 'synonyms'
  | 'who-said-it'
  | 'word-scramble';

export type GameQuestion = {
  analogies: AnalogyQuestion;
  antonyms: AntonymQuestion;
  'fake-words': FakeWordQuestion;
  synonyms: SynonymQuestion;
  'who-said-it': WhoSaidItQuestion;
  'word-scramble': WordScrambleQuestion;
};

interface GameDataFetcher {
  fetch<T extends Game>(game: T): Promise<GameQuestion[T][]>;
}

class SampleDataFetcher implements GameDataFetcher {
  async fetch<T extends Game>(game: T): Promise<GameQuestion[T][]> {
    // Simulate a delay of half a second
    await new Promise((resolve) => setTimeout(resolve, 500));

    switch (game) {
      case 'analogies':
        return analogySampleData as GameQuestion[T][];
      case 'antonyms':
        return antonymsSampleData as GameQuestion[T][];
      case 'fake-words':
        return fakeWordSampleData as GameQuestion[T][];
      case 'synonyms':
        return synonymSampleData as GameQuestion[T][];
      case 'who-said-it':
        return whoSaidItSampleData as GameQuestion[T][];
      case 'word-scramble':
        return wordScrambleSampleData as GameQuestion[T][];
      default:
        throw new Error(`Unsupported game: ${game}`);
    }
  }
}

const systemPrompt = `
You are the brain behind a virtual arcade called Wordcade. Wordcade is filled with many mini games, all word related. Some example games are:

1. Synonyms: The user is presented with a word and three potential synonyms, and the goal is to choose the true synonym from the options. Choosing the true synonym awards you one point. Choosing the wrong option deducts one point. The user aims to make as many correct choices as possible in 30 seconds.

2. Fake words: The user is presented with a word and the word's definition, but the word may or may not be real! The goal is to choose if the word is fake or real. Again, the user answers as many as possible in 30 seconds.

These are just two examples, but Wordcade is filled with many more. It would be a huge burden for the developer of Wordcade to maintain a repository of words for each game, and continuously update that repository to keep things fresh and interesting. That's where you come in. Your task is to generate data for an instance of a Wordcade minigame when asked, and to produce this data in the right format. The schemas are presented below:

analogies

synonyms
\`\`\`
{
    "word": "ubiquitous",
    "options": ["rare", "omnipresent", "unseen"],
    "answer": 1
}
\`\`\`

fake-words
\`\`\`
{
    "word": "blateration",
    "definition": "the act of incessantly babbling or chattering",
    "real": true
}
\`\`\`

You will be asked to generate arrays of elements for the minigame. The prompt might look something like "Give me an array of 15 elements for a Fake Words minigame".
`;

const prompts: Record<Game, string> = {
  analogies:
    'Give me an array of 10 elements for an analogies minigame, gradually increasing in difficulty from the beginning of the array to the end of the arra from the beginning of the array to the end of the array.',
  antonyms: 'bleh',
  'fake-words': 'bleh',
  synonyms: 'blah',
  'who-said-it': 'whoa',
  'word-scramble': "let's go",
};

class ClaudeDataFetcher implements GameDataFetcher {
  constructor(private readonly api: Anthropic) {}

  async fetch<T extends Game>(game: T): Promise<GameQuestion[T][]> {
    const msg = await this.api.messages.create({
      max_tokens: 4096,
      model: 'claude-3-haiku-20240307',
      system: systemPrompt,
      messages: [{ role: 'user', content: prompts[game] }],
    });
    return [];
  }
}

const sampleDataFetcher = () => new SampleDataFetcher();

const claudeDataFetcher = (apiKey: string) =>
  new ClaudeDataFetcher(
    new Anthropic({
      apiKey,
    })
  );

export const dataFetcher =
  process.env.DATA_SOURCE === 'claude' && !!process.env.ANTHROPIC_API_KEY
    ? claudeDataFetcher(process.env.ANTHROPIC_API_KEY)
    : sampleDataFetcher();

import Anthropic from '@anthropic-ai/sdk';
import { AnalogyQuestion, analogySampleData } from '../analogies';
import { AntonymQuestion, antonymsSampleData } from '../antonyms';
import { FakeWordQuestion, fakeWordSampleData } from '../fake-words';
import { SynonymQuestion, synonymSampleData } from '../synonyms';
import { WhoSaidItQuestion, whoSaidItSampleData } from '../who-said-it';
import { WordScrambleQuestion, wordScrambleSampleData } from '../word-scramble';
import {
  analogiesPrompt,
  antonymsPrompt,
  fakeWordsPrompt,
  synonymsPrompt,
  systemPrompt,
  whoSaidItPrompt,
  wordScramblePrompt,
} from './prompts';

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
    // Simulate delay of 5 seconds... that's how long Claude takes :'()
    await new Promise((resolve) => setTimeout(resolve, 5000));

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

const maperoni: Record<Game, string> = {
  analogies: analogiesPrompt,
  antonyms: antonymsPrompt,
  'fake-words': fakeWordsPrompt,
  synonyms: synonymsPrompt,
  'who-said-it': whoSaidItPrompt,
  'word-scramble': wordScramblePrompt,
};

class ClaudeDataFetcher implements GameDataFetcher {
  constructor(private readonly api: Anthropic) {}

  async fetch<T extends Game>(game: T): Promise<GameQuestion[T][]> {
    const message = await this.api.messages.create({
      max_tokens: 4096,
      model: 'claude-3-haiku-20240307',
      temperature: 1.0,
      system: systemPrompt,
      messages: [{ role: 'user', content: maperoni[game] }],
    });
    if (message.content.length > 0 && message.content[0].type === 'text') {
      // console.log({ claudeResponseText: message.content[0].text })
      const data = JSON.parse(message.content[0].text);
      // console.log({ claudeResponseJson: data })
      return data;
    } else {
      return [];
    }
  }
}

const sampleDataFetcher = () => new SampleDataFetcher();

const claudeDataFetcher = (apiKey: string) =>
  new ClaudeDataFetcher(
    new Anthropic({
      apiKey,
    })
  );

const useClaudeDataSource =
  process.env.DATA_SOURCE === 'claude' && !!process.env.ANTHROPIC_API_KEY;

export const dataFetcher = useClaudeDataSource
  ? claudeDataFetcher(process.env.ANTHROPIC_API_KEY!)
  : sampleDataFetcher();

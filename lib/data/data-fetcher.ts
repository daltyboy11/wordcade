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
import { MessageParam } from '@anthropic-ai/sdk/resources/messages.mjs';

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
  fetch<T extends Game>(game: T, history: string[]): Promise<GameQuestion[T][]>;
}

class SampleDataFetcher implements GameDataFetcher {
  async fetch<T extends Game>(
    game: T,
    history: string[]
  ): Promise<GameQuestion[T][]> {
    // Add delay so it's more realistic (Claude can take up to 5 seconds to generate a game)
    await new Promise((resolve) => setTimeout(resolve, 2000));

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

  async fetch<T extends Game>(
    game: T,
    history: string[]
  ): Promise<GameQuestion[T][]> {
    // Interleave the user prompts with the history
    const messages = history.flatMap((claudeResponse) => {
      const userMessage: MessageParam = {
        role: 'user',
        content: maperoni[game],
      };
      const claudeMessage: MessageParam = {
        role: 'assistant',
        content: claudeResponse,
      };
      return [userMessage, claudeMessage];
    });
    messages.push({
      role: 'user',
      content: maperoni[game],
    });
    console.log('Sending messages to Claude');
    console.log({ messages });
    const message = await this.api.messages.create(
      {
        max_tokens: 4096,
        model: 'claude-3-5-sonnet-20240620',
        temperature: 1.0,
        system: systemPrompt,
        messages,
      },
      { timeout: 30000 } // 30 second timeout. The default 10 seconds didn't seem to be enough
    );
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

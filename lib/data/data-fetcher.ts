import { AnalogyQuestion, analogySampleData } from '../analogies';
import { AntonymQuestion, antonymsSampleData } from '../antonyms';
import { FakeWordQuestion, fakeWordSampleData } from '../fake-words';
import { SynonymQuestion, synonymSampleData } from '../synonyms';
import { WhoSaidItQuestion, whoSaidItSampleData } from '../who-said-it';
import { WordScrambleQuestion, wordScrambleSampleData } from '../word-scramble';

type Game =
  | 'analogies'
  | 'antonyms'
  | 'fake-words'
  | 'synonyms'
  | 'who-said-it'
  | 'word-scramble';

type GameQuestion = {
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

const sampleDataFetcher = new SampleDataFetcher();

// TODO - swap out sampleDataFetcher for Claude data fetcher based on the DATA_SOURCE env var
export const dataFetcher = sampleDataFetcher;

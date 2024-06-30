type Game =
  | 'analogies'
  | 'antonyms'
  | 'fake-words'
  | 'synonyms'
  | 'who-said-it'
  | 'word-scramble';

type GameQuestion = {
  analogies: {};
  antonyms: {};
  'fake-words': {};
  synonyms: {};
  'who-said-it': {};
  'word-scramble': {};
};

interface GameDataFetcher {
  fetch<T extends Game>(game: T): Promise<GameQuestion[T][]>;
}

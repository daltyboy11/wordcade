'use client';

import { useRouter } from 'next/navigation';

const games = [
  {
    href: '/synonyms',
    title: 'Synonyms',
    description: 'Choose the correct synonym and score points!',
  },
  {
    href: '/fake-words',
    title: 'Fake Words',
    description: 'Determine if the word is real or fake!',
  },
  {
    href: '/antonyms',
    title: 'Antonyms',
    description: 'Choose the correct antonym and score points!',
  },
  {
    href: '/analogies',
    title: 'Analogies',
    description: 'Solve the analogy and score points!',
  },
  {
    href: '/word-scramble',
    title: 'Word Scramble',
    description: 'Unscramble the word!',
  },
  {
    href: '/who-said-it',
    title: 'Who Said It?',
    description: 'Identify the quote author!',
  },
];

export default function Home() {
  const router = useRouter();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gradient-to-r from-purple-500 to-pink-500 text-white">
      <h1 className="text-6xl font-bold mb-4">Wordcade</h1>
      <p className="text-xl mb-12 text-center max-w-2xl">
        Welcome to Wordcade! Dive into a world of word-based mini games and
        challenge your vocabulary skills.
      </p>

      <div className="grid gap-8 text-center lg:grid-cols-2 lg:text-left">
        {games.map((game, index) => (
          <a
            key={index}
            href={game.href}
            className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-white hover:bg-purple-700"
          >
            <h2 className="mb-3 text-2xl font-semibold">
              {game.title}{' '}
              <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                -&gt;
              </span>
            </h2>
            <p className="m-0 max-w-[30ch] text-sm opacity-80">
              {game.description}
            </p>
          </a>
        ))}
      </div>
    </main>
  );
}

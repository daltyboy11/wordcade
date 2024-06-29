import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gradient-to-r from-purple-500 to-pink-500 text-white">
      <h1 className="text-6xl font-bold mb-4">Wordcade</h1>
      <p className="text-xl mb-12 text-center max-w-2xl">
        Welcome to Wordcade! Dive into a world of word-based mini games and challenge your vocabulary skills.
      </p>

      <div className="grid gap-8 text-center lg:grid-cols-2 lg:text-left">
        <a
          href="/synonyms"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-white hover:bg-purple-700"
        >
          <h2 className="mb-3 text-2xl font-semibold">
            Synonyms{" "}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className="m-0 max-w-[30ch] text-sm opacity-80">
            Choose the correct synonym and score points!
          </p>
        </a>

        <a
          href="/fake-words"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-white hover:bg-purple-700"
        >
          <h2 className="mb-3 text-2xl font-semibold">
            Fake Words{" "}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className="m-0 max-w-[30ch] text-sm opacity-80">
            Determine if the word is real or fake!
          </p>
        </a>

        <a
          href="/antonyms"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-white hover:bg-purple-700"
        >
          <h2 className="mb-3 text-2xl font-semibold">
            Antonyms{" "}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className="m-0 max-w-[30ch] text-sm opacity-80">
            Choose the correct antonym and score points!
          </p>
        </a>

        <a
          href="/analogies"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-white hover:bg-purple-700"
        >
          <h2 className="mb-3 text-2xl font-semibold">
            Analogies{" "}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className="m-0 max-w-[30ch] text-sm opacity-80">
            Solve the analogy and score points!
          </p>
        </a>
      </div>
    </main>
  );
}

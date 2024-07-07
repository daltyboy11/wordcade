# Wordcade
Wordcade is a set of word-based mini-games designed to test your English and vocabulary skills. The minigames are powered by Anthropic's LLM, [Claude](https://www.anthropic.com/claude). It uses Claude to generate the data for each instance of a mini-game, keeping the content fresh, fun, and unique for every time you play.

# How to play
## Hosted version
You can try out my hosted Wordcade at https://wordcade.vercel.app/. Please be mindful of usage. I don't have unlimited API credits ;).

## Locally with your own API key.
Running Wordcade locally is straightforwad. Once you have an API key, simply clone this repo and add a `.env.local` file to the root directory with the following
```
DATA_SOURCE="claude"
ANTHROPIC_API_KEY="my-api-key"
```

Then to start
```
yarn install
yarn dev
```
You can play on http://localhost:3000/

# How it works

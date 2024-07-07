# Wordcade

Wordcade is a set of word-based minigames designed to test your English and vocabulary skills. The minigames are powered by Anthropic's LLM, [Claude](https://www.anthropic.com/claude). It uses Claude to generate the data for game instance, keeping the content fresh, fun, and unique every time you play.

# How to play

## Hosted version

You can try out my hosted Wordcade at https://wordcade.vercel.app/. Please be mindful of usage. I don't have unlimited API credits 🙏.

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

## The Game Lifecycle

The lifecycle of a minigame is illustrated by this diagram
![Game Lifecycle](/public/images/game-lifecycle.png)

The user chooses a game from the Home Page. If a game is selected from the Home Page then its conversation history is empty.

When a game is selected from the Home Page, the app will fetch the data for that game from Claude using a custom prompt. It waits for Claude's response.

The game begins as soon as Claude provides the game data. The user will play the game until they've answered all the questions or the thirty second timer finishes, whichever comes first.

On the _Game Finished_ screen the user has the option to play again or return to the Home Page. If they return to the Home Page then the conversation history is cleared and they begin anew. If they play again, then the conversation history is retained. This helps Claude generate unique data for the next game and avoid any repeat questions or answers.

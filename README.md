# Wordcade

Wordcade is a set of word-based minigames designed to test your English and vocabulary skills. The minigames are powered by Anthropic's LLM, [Claude](https://www.anthropic.com/claude). It uses Claude to generate data for each game instance, keeping the content fresh, fun, and unique every time you play.

# How To Play

## Hosted Version

You can try out my hosted Wordcade at https://wordcade.vercel.app/. Please be mindful of usage. I don't have unlimited API credits 🙏.

## Locally with your own API key.

Running Wordcade locally is straightforward. Once you have an API key, simply clone this repo and add a `.env.local` file to the root directory with the following:

```
DATA_SOURCE="claude"
ANTHROPIC_API_KEY="my-api-key"
```

Then, to start:

```
yarn install
yarn dev
```

You can play on http://localhost:3000/.

# How It Works

## The Game Lifecycle

The lifecycle of a game is illustrated by the following diagram:

![Game Lifecycle](/public/images/game-lifecycle.png)

1. **Game Selection:** The user chooses a game from the Home Page. If a game is selected from the Home Page, its conversation history is empty.

2. **Data Fetching:** Once a game is selected, the app fetches the game data from Claude using a custom prompt. The app waits for Claude's response.

3. **Game Play:** The game begins as soon as Claude provides the game data. The user will play the game until they have answered all the questions or the thirty-second timer finishes, whichever comes first.

4. **Game Conclusion:** On the _Game Finished_ screen, the user has the option to play again or return to the Home Page. If they return to the Home Page, the conversation history is cleared, and they can start a new game. If they choose to play again, the conversation history is retained, helping Claude generate unique data for the next game and avoiding repeat questions or answers.

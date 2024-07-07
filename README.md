# Wordcade

Wordcade is a set of word-based minigames designed to test your English and vocabulary skills. The minigames are powered by Anthropic's LLM, [Claude](https://www.anthropic.com/claude). It uses Claude to generate data for each game instance, keeping the content fresh, fun, and unique every time you play.

# How To Play

## Hosted Version

You can try out my hosted Wordcade at https://wordcade.vercel.app/. Please be mindful of usage, as I have limited API credits 🙏.

## Locally with your own API key

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

## Prompts

The prompting strategy is a combination of a system prompt explaining the role of Claude as the data generator, and a user prompt for each game. My prompts were crafted based on Anthropic's [prompt engineering guide](https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview). Prompts can be found at [prompts.ts](./lib/data/prompts.ts).

### System Prompt

Much of the contextual information Claude needed to complete its task was offloaded to the system prompt. This included

- Describing what Wordcade is, and providing a description of each minigame with examples
- Explaining to Claude what its role in Wordcade is, namely data generation, and why Claude is well suited to fulfill that role.
- Outlining Claude's goals when performing a task.

### User (Game) Prompts

By offloading much of the details and context to the system prompt, the game prompts became straightforward. Each game prompt asks for an array of elements to use for a game instance, and tells Claude the schema to use. The prompts include a reminder to return the data and nothing else.

While experimenting, I found that reminding Claude to keep the data unique and interesting improved task output. An example reminder in the fake-words prompt:

```
Avoid recycling words that you used in previous prompts for this minigame.
Your goal is to make every game unique, fun, and interesting.
```

Sometimes it was helpful to insert game-specific requests in a prompt. For word scramble, the difficulty scale of Claude's responses improved when I added this to the prompt:

```
Start easy with words that are only 4 letters long and progress
to a word with 10 or more letters for the final one.
```

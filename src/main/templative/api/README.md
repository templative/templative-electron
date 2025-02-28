# Templative JS API

This directory contains the JavaScript implementation of the Templative API, converted from the original Python codebase.

## Structure

The API is organized into several command groups:

- `create`: Commands for creating game components
- `produce`: Commands for producing game assets
- `manage`: Commands for managing game projects
- `distribute`: Commands for distributing games

## Usage

### In Node.js Applications

```javascript
const templative = require('templative-js');

// Use the API programmatically
async function createPokerDeck() {
  await templative.create.deck.poker({
    name: 'MyPokerDeck',
    input: './my-game-project'
  });
}
```

### Command Line Interface

The API is also available through the command line interface:

```bash
# Create a new poker deck
templative create deck poker -n MyPokerDeck -i ./my-game-project

# Produce game assets
templative produce --name MyComponent --input ./my-game-project

# Preview a specific component piece
templative preview --component MyComponent --piece MyPiece --input ./my-game-project
```

## Implementation Notes

- The JavaScript implementation uses the Commander.js library for CLI functionality
- All async Python functions have been converted to JavaScript async/await functions
- The library dependencies have been updated to point to the JavaScript implementations in `src/lib` 
# Magic the Gathering: Archenemy Deck Builder

Welcome to the **Magic the Gathering: Archenemy Deck Builder** app! This application allows players to build and manage their Archenemy decks, enhancing the gameplay experience with user-friendly features.

## Current Downloadable Version
[Download Here](https://expo.dev/accounts/ztamoa/projects/mtg-archenemy-deckbuilder/builds/78ffbee2-9e25-4f90-a5e9-d5a6e9030df9)

**Dated:** 16/11/24

## Features
- Save and load Archenemy decks for easy access
- Play mode. Stores ongoing cards for later use/discard.

## Installation
To run this application locally, you will need to have [Node.js](https://nodejs.org/) and [Expo CLI](https://docs.expo.dev/get-started/installation/) installed. After that, you can clone the repository and start the app:

```bash
git clone https://github.com/yourusername/mtg-archenemy-deckbuilder.git
cd mtg-archenemy-deckbuilder
npm install
npx expo start
```

## Todo List

### Known bugs
- Too long of a deck name will cause UI element overlap in saved decks.
- Adding/removing a card in the builder, that would force a resize of the new deck container at the top, AND
  quickly scrolling to the bottom, will make the UI glitch out.
- Splashscreen not staying on until all data is prefetched

### Features to Implement
- Swipe gestures for revealing / discarding cards / zoom in/out on deck lists
- Add user authentication
- Implement multiplayer deck sharing
- Integrate card pricing information

### UI/UX Improvements
- Change display of saved decks in Decks / Playmode

### Testing
- Write unit tests for core components
- Perform usability testing with target audience

## Acknowledgements
- A special thanks to [Scryfall](https://scryfall.com/) for providing the Magic: The Gathering card database API that powers this app.
- Inspired by the creativity and strategy of the Archenemy format!

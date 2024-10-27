import { SavedDeck } from "@/store/store";

export const cardShuffler = (deck: SavedDeck): SavedDeck => {
  // deep copy the deck
  const copiedDeck = JSON.parse(JSON.stringify(deck));
  // Fisher-Yates shuffle
  for (let i = copiedDeck.cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copiedDeck.cards[i], copiedDeck.cards[j]] = [copiedDeck.cards[j], copiedDeck.cards[i]];
  }
  return copiedDeck;
};

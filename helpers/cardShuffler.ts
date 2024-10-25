import { ScryfallCard } from "@scryfall/api-types";

export const cardShuffler = (deck: ScryfallCard.Scheme[]): ScryfallCard.Scheme[] => {
  // deep copy the deck
  const copiedDeck = JSON.parse(JSON.stringify(deck));
  // Fisher-Yates shuffle
  for (let i = copiedDeck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copiedDeck[i], copiedDeck[j]] = [copiedDeck[j], copiedDeck[i]];
  }
  return copiedDeck;
};

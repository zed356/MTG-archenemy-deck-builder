import { create } from "zustand";
import { ScryfallCard } from "@scryfall/api-types";

export type SavedDeck = { deckName: string; cards: ScryfallCard.Scheme[] };

interface NewDeckState {
  cardsInNewDeck: ScryfallCard.Scheme[];
  addCardToNewDeck: (card: ScryfallCard.Scheme) => void;
  removeCardFromNewDeck: (card: ScryfallCard.Scheme) => void;
  clearNewDeck: () => void;
}

interface SavedDeckState {
  savedDecksInState: SavedDeck[];
  saveDeckToState: (deck: SavedDeck) => void;
  removeDeckFromState: (deck: SavedDeck) => void;
  loadDecksFromStorageIntoState: (decks: SavedDeck[]) => void;
  clearDecks: () => void;
}

export const useNewDeckStore = create<NewDeckState>((set) => ({
  cardsInNewDeck: [],
  addCardToNewDeck: (card) => set((state) => ({ cardsInNewDeck: [...state.cardsInNewDeck, card] })),
  removeCardFromNewDeck: (card) =>
    set((state) => ({
      cardsInNewDeck: state.cardsInNewDeck.filter((el) => el.name !== card.name),
    })),
  clearNewDeck: () => set({ cardsInNewDeck: [] }),
}));

export const useSavedDeckStore = create<SavedDeckState>((set) => ({
  savedDecksInState: [],
  loadDecksFromStorageIntoState: (decks) => set({ savedDecksInState: decks }),
  saveDeckToState: (deck) =>
    set((state) => ({ savedDecksInState: [...state.savedDecksInState, deck] })),
  removeDeckFromState: (deck) =>
    set((state) => ({ savedDecksInState: state.savedDecksInState.filter((el) => el !== deck) })),
  clearDecks: () => set({ savedDecksInState: [] }),
}));

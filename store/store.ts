import { create } from "zustand";
import { ScryfallCard } from "@scryfall/api-types";

export type SavedDeck = { deckName: string; cards: ScryfallCard.Scheme[] };

interface CardsInStore {
  cardsInStore: ScryfallCard.Scheme[];
  loadCardsIntoStore: (cards: ScryfallCard.Scheme[]) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  error: string | null;
  setError: (error: string | null) => void;
}

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
  updateDeckInState: (deck: SavedDeck, newDeckName?: string) => void;
  clearDecks: () => void;
}

export const useNewDeckStore = create<NewDeckState>((set) => ({
  cardsInNewDeck: [],
  addCardToNewDeck: (card) =>
    set((state) => ({ cardsInNewDeck: [...state.cardsInNewDeck, card] })),
  removeCardFromNewDeck: (card) =>
    set((state) => ({
      cardsInNewDeck: state.cardsInNewDeck.filter(
        (el) => el.name !== card.name,
      ),
    })),
  clearNewDeck: () => set({ cardsInNewDeck: [] }),
}));

export const useSavedDeckStore = create<SavedDeckState>((set) => ({
  savedDecksInState: [],
  loadDecksFromStorageIntoState: (decks) => set({ savedDecksInState: decks }),
  saveDeckToState: (deck) =>
    set((state) => ({ savedDecksInState: [...state.savedDecksInState, deck] })),
  removeDeckFromState: (deck) =>
    set((state) => ({
      savedDecksInState: state.savedDecksInState.filter((el) => el !== deck),
    })),
  updateDeckInState: (deck, newDeckName) =>
    set((state) => {
      if (newDeckName && newDeckName.trim().length > 0) {
        const updatedDeck = { deckName: newDeckName, cards: deck.cards };
        return {
          savedDecksInState: state.savedDecksInState.map((el) =>
            el.deckName === deck.deckName ? updatedDeck : el,
          ),
        };
      } else {
        return {
          savedDecksInState: state.savedDecksInState.map((el) =>
            el.deckName === deck.deckName ? deck : el,
          ),
        };
      }
    }),

  clearDecks: () => set({ savedDecksInState: [] }),
}));

export const useCardStore = create<CardsInStore>((set) => ({
  cardsInStore: [],
  loadCardsIntoStore: (cards: ScryfallCard.Scheme[]) =>
    set({ cardsInStore: cards }),
  loading: false,
  setLoading: (loading) => set({ loading }),
  error: null,
  setError: (error) => set({ error }),
}));

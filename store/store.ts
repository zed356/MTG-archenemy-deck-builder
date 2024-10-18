import { create } from "zustand";
import { ScryfallCard } from "@scryfall/api-types";

interface NewDeckState {
  cardsInNewDeck: ScryfallCard.Scheme[];
  addCardToNewDeck: (card: ScryfallCard.Scheme) => void;
  removeCardFromNewDeck: (card: ScryfallCard.Scheme) => void;
  clearNewDeck: () => void;
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

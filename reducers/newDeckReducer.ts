import { ScryfallCard } from "@scryfall/api-types";

export enum NewDeckActionKind {
  ADD = "ADD",
  REMOVE = "REMOVE",
  CLEAR = "CLEAR",
}
export interface NewDeckAction {
  type: NewDeckActionKind;
  payload?: ScryfallCard.Scheme;
}
export interface NewDeckState {
  newDeck: ScryfallCard.Scheme[];
}

export const newDeckReducer = (state: NewDeckState, action: NewDeckAction) => {
  const { type, payload } = action;

  switch (type) {
    case NewDeckActionKind.ADD:
      if (payload) return { ...state, newDeck: [...state.newDeck, payload] };
      return state;
    case NewDeckActionKind.REMOVE:
      if (payload) {
        const targetIndex = state.newDeck.findIndex(
          (el) => el.multiverse_ids == payload!.multiverse_ids
        );
        return { ...state, newDeck: state.newDeck.toSpliced(targetIndex, 1) };
      }
      return state;
    case NewDeckActionKind.CLEAR:
      return { ...state, newDeck: [] };
    default:
      return state;
  }
};

export const initialReducerState: NewDeckState = { newDeck: [] };

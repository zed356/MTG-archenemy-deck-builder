import { SavedDeck } from "@/store/store";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const saveDeckToStorage = async (deck: SavedDeck) => {
  try {
    const currentDecks = await loadDecksFromStorage();
    if (currentDecks != null) {
      const newDecks = [...currentDecks, deck];
      await AsyncStorage.setItem("saved-decks", JSON.stringify(newDecks));
    } else {
      await AsyncStorage.setItem("saved-decks", JSON.stringify([deck]));
    }
  } catch (e) {
    console.log(e);
  }
};

export const loadDecksFromStorage = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem("saved-decks");
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    console.log(e);
  }
};

export const removeDeckFromStorage = async (deck: SavedDeck) => {
  try {
    const currentDecks = await loadDecksFromStorage();
    if (currentDecks != null) {
      const newDecks = currentDecks.filter((el: SavedDeck) => el.deckName !== deck.deckName);
      await AsyncStorage.setItem("saved-decks", JSON.stringify(newDecks));
    }
  } catch (e) {
    console.log(e);
  }
};

export const updateDeckInStorage = async (deck: SavedDeck, newDeckName?: string) => {
  try {
    const currentDecks = await loadDecksFromStorage();
    if (currentDecks != null) {
      let newDeck;
      if (newDeckName && newDeckName.trim().length > 0) {
        const updatedDeck = { deckName: newDeckName, cards: deck.cards };
        newDeck = currentDecks.map((el: SavedDeck) =>
          el.deckName === deck.deckName ? updatedDeck : el
        );
      } else {
        newDeck = currentDecks.map((el: SavedDeck) => (el.deckName === deck.deckName ? deck : el));
      }

      await AsyncStorage.setItem("saved-decks", JSON.stringify(newDeck));
    }
  } catch (e) {
    console.log(e);
  }
};

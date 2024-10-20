import { SavedDeck } from "@/store/store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ScryfallCard } from "@scryfall/api-types";

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

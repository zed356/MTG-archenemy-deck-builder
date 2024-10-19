import { defaultColors } from "@/constants/Colors";
import { View, Text } from "react-native";
import { StyleSheet } from "react-native";
import { globalStyles } from "@/constants/styles";
import { Link } from "expo-router";
import CustomButton from "../button/CustomButton";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSavedDeckStore } from "@/store/store";
import { Fragment, useEffect } from "react";
import { loadDecksFromStorage } from "@/helpers/savedDeckManager";

const SavedDecks: React.FC = () => {
  const { savedDecksInState, loadDecksFromStorageIntoState, clearDecks } = useSavedDeckStore();

  // load decks from local storage if any exist
  useEffect(() => {
    const fetchCards = async () => {
      const decks = await loadDecksFromStorage();
      if (decks != null) {
        loadDecksFromStorageIntoState(decks);
      }
    };
    fetchCards();
  }, []);

  const handleClearDecks = () => {
    AsyncStorage.removeItem("saved-decks");
    clearDecks();
  };

  const content =
    savedDecksInState.length > 0 ? (
      savedDecksInState.map((deck) => (
        <Text key={Math.random()} style={[globalStyles.text, styles.emptyDeckText]}>
          Cards: {deck.length}
        </Text>
      ))
    ) : (
      <Link href="/(tabs)/deckbuilder">
        <Text style={[globalStyles.text, styles.emptyDeckText]}>Create a new deck</Text>
      </Link>
    );

  return (
    <View style={styles.container}>
      <View style={styles.deckContainer}>{content}</View>
      {savedDecksInState.length > 0 && (
        <CustomButton text="Clear decks" type="negative" onPress={handleClearDecks} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  deckContainer: {
    width: "90%",
    minHeight: "20%",
    borderColor: defaultColors.gold,
    borderRadius: 20,
    borderWidth: 1,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyDeckText: {
    color: defaultColors.gold,
    fontSize: 25,
  },
});

export default SavedDecks;

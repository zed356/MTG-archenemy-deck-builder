import { defaultColors } from "@/constants/Colors";
import { View, Text, Pressable } from "react-native";
import { StyleSheet } from "react-native";
import { globalStyles } from "@/constants/styles";
import { Link } from "expo-router";
import CustomButton from "../button/CustomButton";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSavedDeckStore } from "@/store/store";
import { useEffect, useState } from "react";
import { loadDecksFromStorage } from "@/helpers/savedDeckManager";
import { FontAwesome6 } from "@expo/vector-icons";

const SavedDecks: React.FC = () => {
  const { savedDecksInState, loadDecksFromStorageIntoState, clearDecks } = useSavedDeckStore();
  const [currentPage, setCurrentPage] = useState(1);
  const decksPerPage = 4;

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

  const handleNextPage = () => {
    if (currentPage < Math.ceil(savedDecksInState.length / decksPerPage)) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const deckContent =
    savedDecksInState.length > 0 ? (
      savedDecksInState.map((deck, index) => {
        if (index < currentPage * decksPerPage && index >= (currentPage - 1) * decksPerPage) {
          return (
            <Text key={Math.random()} style={[globalStyles.text, styles.emptyDeckText]}>
              Cards: {deck.length}
            </Text>
          );
        }
      })
    ) : (
      <Link href="/(tabs)/deckbuilder">
        <Text style={[globalStyles.text, styles.emptyDeckText]}>Create a new deck</Text>
      </Link>
    );

  const paginationContent = (
    <View style={styles.paginationContainer}>
      <Pressable onPress={handlePreviousPage}>
        <FontAwesome6 name="chevron-left" size={24} color={defaultColors.gold} />
      </Pressable>
      <Text style={[globalStyles.text, styles.emptyDeckText]}>
        {currentPage} / {Math.ceil(savedDecksInState.length / decksPerPage)}
      </Text>
      <Pressable onPress={handleNextPage}>
        <FontAwesome6 name="chevron-right" size={24} color={defaultColors.gold} />
      </Pressable>
    </View>
  );

  return (
    <View style={styles.container}>
      {savedDecksInState.length > 0 && (
        <CustomButton text="Clear decks" type="negative" onPress={handleClearDecks} />
      )}
      <View style={styles.deckContainer}>{deckContent}</View>
      {savedDecksInState.length > 0 && <View>{paginationContent}</View>}
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
    justifyContent: "space-between",
    alignItems: "center",
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "70%",
    marginTop: 10,
  },
  emptyDeckText: {
    color: defaultColors.gold,
    fontSize: 25,
  },
});

export default SavedDecks;

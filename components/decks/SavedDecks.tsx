import { defaultColors } from "@/constants/Colors";
import { globalStyles } from "@/constants/styles";
import { SAVED_DECKS_PER_PAGE } from "@/constants/values";
import { removeDeckFromStorage, updateDeckInStorage } from "@/helpers/savedDeckManager";
import { SavedDeck, useSavedDeckStore } from "@/store/store";
import { FontAwesome6 } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import AnimatedIcon from "../button/AnimatedIcon";
import CustomButton from "../button/CustomButton";
import ConfirmationModal from "../modals/specific-modals/ConfirmationModal";
import SavedDeckModal from "../modals/specific-modals/SavedDeckModal";
import BlurredBackground from "../style-elements/BlurredBackground";
import Spacer from "../style-elements/Spacer";
import TabsIcon from "../style-elements/TabsIcon";

interface SavedDecksProps {
  canDeleteDeck?: boolean;
  canClearDeckList?: boolean;
  onDeckSelectedForPlay?: (deck: SavedDeck) => void;
}

const SavedDecks: React.FC<SavedDecksProps> = ({
  canDeleteDeck = true,
  canClearDeckList = true,
  onDeckSelectedForPlay,
}) => {
  const { savedDecksInState, removeDeckFromState, updateDeckInState, clearDecks } =
    useSavedDeckStore();
  const [deckListModalIsVisible, setDeckListModalIsVisible] = useState(false);
  const [clearDecksConfirmationModalIsVisible, setClearDecksConfirmationModalIsVisible] =
    useState(false);
  const [selectedDeck, setSelectedDeck] = useState<SavedDeck | null>(null);
  const [deckToDelete, setDeckToDelete] = useState<SavedDeck | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const maxPages = Math.ceil(savedDecksInState.length / SAVED_DECKS_PER_PAGE);

  const handleClearDecks = () => {
    AsyncStorage.removeItem("saved-decks");
    clearDecks();
  };

  const handleNextPage = () => {
    if (currentPage < maxPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleDeckListModal = (deck: SavedDeck) => {
    setSelectedDeck(deck);
    setDeckListModalIsVisible((prev) => !prev);
  };

  const handleDeleteDeck = (deck: SavedDeck) => {
    removeDeckFromState(deck);
    removeDeckFromStorage(deck);
  };

  const handleUpdateDeck = (deck: SavedDeck, newDeckName?: string) => {
    updateDeckInState(deck, newDeckName);
    updateDeckInStorage(deck, newDeckName);
  };

  const deckContent =
    savedDecksInState.length > 0 ? (
      savedDecksInState.map((deck, index) => {
        if (
          index < currentPage * SAVED_DECKS_PER_PAGE &&
          index >= (currentPage - 1) * SAVED_DECKS_PER_PAGE
        ) {
          return (
            <View key={Math.random()} style={styles.decksContainer}>
              <BlurredBackground>
                <SavedDeckModal
                  modalVisible={deckListModalIsVisible}
                  setVisible={() => setDeckListModalIsVisible(false)}
                  deck={selectedDeck}
                  updateDeck={handleUpdateDeck}
                />
                <View style={styles.deck}>
                  <Pressable
                    onPress={() => {
                      handleDeckListModal(deck);
                    }}
                  >
                    <Text style={[globalStyles.text, styles.deckText]}>
                      {deck.deckName}
                      {
                        <View>
                          <TabsIcon
                            source={require("../../assets/tab-icons/cards-icon.svg")}
                            focused={true}
                            top={8}
                          />
                        </View>
                      }
                      {deck.cards.length}
                    </Text>
                  </Pressable>
                </View>
                {canDeleteDeck ? (
                  <FontAwesome6
                    name="trash-alt"
                    size={24}
                    color={defaultColors.red}
                    onPress={() => {
                      setDeckToDelete(deck);
                    }}
                  />
                ) : (
                  <CustomButton
                    type="positive"
                    text="Select"
                    onPress={() => {
                      onDeckSelectedForPlay && onDeckSelectedForPlay(deck);
                    }}
                  />
                )}
                <ConfirmationModal
                  isVisible={deckToDelete != null}
                  text={`Are you sure you want to delete ${deckToDelete?.deckName}?`}
                  onConfirm={() => {
                    if (deckToDelete) {
                      handleDeleteDeck(deckToDelete);
                      setDeckToDelete(null);
                    }
                  }}
                  onCancel={() => {
                    setDeckToDelete(null);
                  }}
                />
              </BlurredBackground>
            </View>
          );
        }
        return null;
      })
    ) : (
      // <Link href="/(tabs)/deckbuilder">
      <Pressable onPress={() => router.push("/(tabs)/deckbuilder")}>
        <Text style={[globalStyles.text, styles.emptyDeckText]}>Create a new deck</Text>
      </Pressable>
      // </Link>
    );

  const paginationContent = (
    <View style={styles.paginationContainer}>
      <AnimatedIcon onPress={handlePreviousPage} visible={currentPage > 1}>
        <FontAwesome6 name="chevron-left" size={24} color={defaultColors.gold} />
      </AnimatedIcon>
      <Text style={[globalStyles.text, styles.emptyDeckText]}>
        {currentPage} / {maxPages}
      </Text>
      <AnimatedIcon onPress={handleNextPage} visible={currentPage < maxPages}>
        <FontAwesome6 name="chevron-right" size={24} color={defaultColors.gold} />
      </AnimatedIcon>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.allDecksContainer}>{deckContent}</View>
      {savedDecksInState.length > SAVED_DECKS_PER_PAGE && <View>{paginationContent}</View>}
      <Spacer height={50} />
      {savedDecksInState.length > 0 && canClearDeckList && (
        <CustomButton
          text="Clear decks"
          type="negative"
          onPress={() => setClearDecksConfirmationModalIsVisible(true)}
        />
      )}
      <ConfirmationModal
        isVisible={clearDecksConfirmationModalIsVisible}
        text="Are you sure you want to clear all decks?"
        onConfirm={() => {
          setClearDecksConfirmationModalIsVisible(false);
          handleClearDecks();
        }}
        onCancel={() => setClearDecksConfirmationModalIsVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
    marginBottom: 70,
  },
  allDecksContainer: {
    padding: 10,
    flex: 0.5,
    justifyContent: "center",
    alignItems: "center",
  },
  decksContainer: {
    flex: 0.25,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  deck: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  deckText: {
    color: defaultColors.gold,
    fontSize: 20,
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

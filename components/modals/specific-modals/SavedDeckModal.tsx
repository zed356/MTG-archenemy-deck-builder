import CustomButton from "@/components/button/CustomButton";
import Card from "@/components/card/Card";
import { defaultColors } from "@/constants/Colors";
import { SavedDeck, useCardStore } from "@/store/store";
import { ScryfallCard } from "@scryfall/api-types";
import { Fragment, useEffect, useState } from "react";
import { View, Modal, StyleSheet, ScrollView, Text, TextInput, FlatList } from "react-native";
import { MINIMUM_CARDS_IN_NEW_DECK } from "@/constants/values";
import Filter from "@/components/card/Filter";
import Spacer from "@/components/style-elements/Spacer";

interface InputProps {
  modalVisible: boolean;
  setVisible: (value: boolean) => void;
  deck: SavedDeck | null;
  updateDeck: (deck: SavedDeck, newDeckName?: string) => void;
}

const SavedDeckModal: React.FC<InputProps> = ({ modalVisible, setVisible, deck, updateDeck }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newDeckName, setNewDeckName] = useState<string>("");
  const { cardsInStore } = useCardStore();
  const [deepCopyOfDeck, setDeepCopyOfDeck] = useState<SavedDeck>(JSON.parse(JSON.stringify(deck)));
  const [displayedCards, setDisplayedCards] = useState<ScryfallCard.Scheme[]>(cardsInStore);
  const [deckCardNames, setDeckCardNames] = useState<Set<string>>(new Set());
  const [filteredCards, setFilteredCards] = useState<ScryfallCard.Scheme[]>(cardsInStore);

  const cardsInDeck: number | boolean = deck != null && deepCopyOfDeck.cards.length;
  const correctAmountOfCardsInDeck: boolean = cardsInDeck
    ? cardsInDeck >= MINIMUM_CARDS_IN_NEW_DECK
    : false;

  useEffect(() => {
    if (!deepCopyOfDeck) return;

    const namesOfCardInDeck = new Set(deepCopyOfDeck.cards.map((el) => el.name));
    const namesOfFilteredCards = new Set(filteredCards.map((el) => el.name));
    setDeckCardNames(namesOfCardInDeck);

    // Separate existing and new cards
    const newCards = filteredCards.filter((card) => !namesOfCardInDeck.has(card.name));
    const existingCards = deepCopyOfDeck.cards;
    const fullDeck = [...existingCards, ...newCards];

    // Combine existing and new cards, with new cards appended at the end
    setDisplayedCards(fullDeck.filter((el) => (namesOfFilteredCards.has(el.name) ? el : null)));
  }, [deepCopyOfDeck, cardsInStore, isEditing, filteredCards]);

  const resetDeepCopyOfDeck = () => {
    setDeepCopyOfDeck(JSON.parse(JSON.stringify(deck)));
  };

  const resetDisplayedCards = () => {
    setDisplayedCards(cardsInStore);
  };

  const handleAddCardToDeckWhileEditing = (card: ScryfallCard.Scheme) => {
    setDeepCopyOfDeck((prev) => {
      return { ...prev, cards: [...prev.cards, card] };
    });
  };

  const handleRemoveCardFromDeckWhileEditing = (card: ScryfallCard.Scheme) => {
    setDeepCopyOfDeck((prev) => {
      return { ...prev, cards: prev.cards.filter((el) => el.name !== card.name) };
    });
  };

  const handleEditing = () => {
    updateDeck(deepCopyOfDeck, newDeckName);
    setIsEditing(false);
    setVisible(false);
  };

  const calcCorrectTextColor = () => {
    if (isEditing && correctAmountOfCardsInDeck) {
      return defaultColors.green;
    }
    if (isEditing && !correctAmountOfCardsInDeck) {
      return defaultColors.red;
    }
    return defaultColors.gold;
  };

  const styles = StyleSheet.create({
    centeredView: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0,0,0,0.6)", // Optional: adds a backdrop
    },
    modalContainer: {
      width: "97%", // Modal width
      maxHeight: "80%", // Maximum height to prevent overflow
      backgroundColor: defaultColors.grey,
      borderRadius: 20,
      // padding: 20,
      elevation: 5,
    },
    contentContainer: {
      justifyContent: "center",
      alignItems: "center",
      paddingBottom: 20, // Additional padding at the bottom if needed
    },
    modalView: {
      width: "100%", // Modal width
      backgroundColor: defaultColors.grey,
      borderRadius: 20,
      padding: 20,
      alignItems: "center",
    },
    buttonContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 15,
      width: "100%", // Ensure buttons take full width
    },
    cardCountText: {
      backgroundColor: defaultColors.purple,
      borderRadius: 10,
      paddingLeft: 6, // impossible to center text. its always a bit off to the left.
      color: calcCorrectTextColor(), // Assuming you want white text
      fontSize: 25,
      marginBottom: 10,
    },
    modalInput: {
      borderWidth: 1,
      width: "100%",
      textAlign: "center",
      padding: 5,
      fontFamily: "Beleren",
      fontSize: 20,
      marginBottom: 10,
    },
    deckContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "center",
    },
  });

  const content = deck != null && (
    <Modal
      animationType="none"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        setVisible(false);
      }}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalContainer}>
          <ScrollView contentContainerStyle={styles.contentContainer}>
            <View style={styles.modalView}>
              <View style={styles.buttonContainer}>
                {!isEditing && (
                  <CustomButton type="neutral" text="EDIT" onPress={() => setIsEditing(true)} />
                )}
                {isEditing && (
                  <CustomButton
                    type="positive"
                    text="SAVE"
                    onPress={handleEditing}
                    disabled={!correctAmountOfCardsInDeck}
                  />
                )}

                <CustomButton
                  type="negative"
                  text={isEditing ? "CANCEL" : "CLOSE"}
                  onPress={() => {
                    resetDisplayedCards();
                    if (isEditing) {
                      resetDeepCopyOfDeck();
                      setIsEditing(false);
                    } else {
                      setVisible(false);
                    }
                  }}
                />
              </View>
              <Text style={styles.cardCountText}>
                {`${cardsInDeck}${isEditing ? ` / ${MINIMUM_CARDS_IN_NEW_DECK}` : ""}`}{" "}
              </Text>
              {isEditing && (
                <TextInput
                  style={styles.modalInput}
                  value={newDeckName || deck.deckName}
                  multiline={true}
                  numberOfLines={4}
                  maxLength={80}
                  autoCorrect={false}
                  onChangeText={setNewDeckName}
                />
              )}
              {isEditing && (
                <View style={{ width: "96%", marginBottom: 10 }}>
                  <Filter
                    cards={cardsInStore}
                    setFilteredCards={setFilteredCards}
                    filterIconInactiveColor="white"
                  />
                </View>
              )}
              <View style={styles.deckContainer}>
                {displayedCards.map((card) => {
                  if (deckCardNames.has(card.name) || isEditing) {
                    return (
                      <View key={card.name} style={{ margin: 5 }}>
                        <Card
                          card={card}
                          size="small"
                          showAddRemoveOperator={isEditing}
                          border={false}
                          isOpacityControlled={isEditing}
                          existsInDeck={deckCardNames.has(card.name)}
                          addToDeck={handleAddCardToDeckWhileEditing}
                          removeFromDeck={handleRemoveCardFromDeckWhileEditing}
                        />
                      </View>
                    );
                  }
                  return null;
                })}
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  return <Fragment>{content}</Fragment>;
};

export default SavedDeckModal;

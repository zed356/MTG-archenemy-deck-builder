import CustomButton from "@/components/button/CustomButton";
import Card from "@/components/card/Card";
import { defaultColors } from "@/constants/Colors";
import { SavedDeck, useCardStore } from "@/store/store";
import { ScryfallCard } from "@scryfall/api-types";
import { Fragment, useState } from "react";
import { View, Modal, StyleSheet, ScrollView, Text, TextInput } from "react-native";
import { MINIMUM_CARDS_IN_NEW_DECK } from "@/constants/values";

interface InputProps {
  modalVisible: boolean;
  setVisible: (value: boolean) => void;
  deck: SavedDeck | null;
  updateDeck: (deck: SavedDeck, newDeckName?: string) => void;
}

const DeckListModal: React.FC<InputProps> = ({ modalVisible, setVisible, deck, updateDeck }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newDeckName, setNewDeckName] = useState<string>("");
  const [deepCopyOfDeck, setDeepCopyOfDeck] = useState<SavedDeck>(JSON.parse(JSON.stringify(deck)));
  const { cardsInStore } = useCardStore();

  const cardsInDeck: number | boolean = deck != null && deepCopyOfDeck.cards.length;
  const correctAmountOfCardsInDeck: boolean = cardsInDeck
    ? cardsInDeck >= MINIMUM_CARDS_IN_NEW_DECK
    : false;

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
    scrollContainer: { flex: 1, marginTop: 70 },
    centeredView: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      marginTop: 22,
      position: "absolute",
    },
    modalView: {
      flex: 1,
      width: "90%",
      margin: 20,
      backgroundColor: defaultColors.grey,
      borderRadius: 20,
      padding: 35,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    buttonContainer: {
      flex: 1,
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 15,
    },
    deckContainer: {
      flex: 1,
      flexDirection: "row",
      flexWrap: "wrap",
    },
    cardCountText: {
      backgroundColor: defaultColors.purple,
      borderRadius: 10,
      paddingHorizontal: 5,
      color: calcCorrectTextColor(),
      fontSize: 25,
      alignSelf: "center",
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
  });

  const content = deck != null && (
    <View style={styles.centeredView}>
      <Modal
        animationType="none"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setVisible(false);
        }}
      >
        <ScrollView style={styles.scrollContainer}>
          <View style={styles.modalView}>
            <View style={styles.buttonContainer}>
              {!isEditing && (
                <CustomButton
                  type="neutral"
                  text="EDIT"
                  onPress={() => {
                    setIsEditing(true);
                  }}
                />
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
                text="CLOSE"
                onPress={() => {
                  setVisible(false);
                }}
              />
            </View>
            <Text style={styles.cardCountText}>{`${cardsInDeck}${
              isEditing ? ` / ${MINIMUM_CARDS_IN_NEW_DECK}` : ""
            }`}</Text>
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
            <View style={styles.deckContainer}>
              {cardsInStore.map((card) => {
                if (deepCopyOfDeck.cards.find((el) => el.name === card.name) || isEditing) {
                  return (
                    <Card
                      key={card.name}
                      card={card}
                      size="small"
                      showAddRemoveOperator={isEditing}
                      border={isEditing}
                      isOpacityControlled={isEditing}
                      existsInDeck={
                        deepCopyOfDeck.cards.find((el) => el.name === card.name) ? true : false
                      }
                      addToDeck={handleAddCardToDeckWhileEditing}
                      removeFromDeck={handleRemoveCardFromDeckWhileEditing}
                    />
                  );
                }
              })}
            </View>
          </View>
        </ScrollView>
      </Modal>
    </View>
  );

  return <Fragment>{content}</Fragment>;
};

export default DeckListModal;

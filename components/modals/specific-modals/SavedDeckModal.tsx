import CustomButton from "@/components/button/CustomButton";
import Card from "@/components/card/Card";
import { defaultColors } from "@/constants/Colors";
import { SavedDeck, useCardStore } from "@/store/store";
import { ScryfallCard } from "@scryfall/api-types";
import { Fragment, useState } from "react";
import { View, Modal, StyleSheet, ScrollView, Text, TextInput } from "react-native";
import { MINIMUM_CARDS_IN_NEW_DECK } from "@/constants/values";
import CustomModal from "../CustomModal";

interface InputProps {
  modalVisible: boolean;
  setVisible: (value: boolean) => void;
  deck: SavedDeck | null;
  updateDeck: (deck: SavedDeck, newDeckName?: string) => void;
}

const SavedDeckModal: React.FC<InputProps> = ({ modalVisible, setVisible, deck, updateDeck }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newDeckName, setNewDeckName] = useState<string>("");
  const [deepCopyOfDeck, setDeepCopyOfDeck] = useState<SavedDeck>(JSON.parse(JSON.stringify(deck)));
  const { cardsInStore } = useCardStore();

  const cardsInDeck: number | boolean = deck != null && deepCopyOfDeck.cards.length;
  const correctAmountOfCardsInDeck: boolean = cardsInDeck
    ? cardsInDeck >= MINIMUM_CARDS_IN_NEW_DECK
    : false;

  const resetDeepCopyOfDeck = () => {
    setDeepCopyOfDeck(JSON.parse(JSON.stringify(deck)));
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
      backgroundColor: "rgba(0,0,0,0.2)", // Optional: adds a backdrop
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
      paddingHorizontal: 5,
      color: calcCorrectTextColor(), // Assuming you want white text
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
                    if (isEditing) {
                      resetDeepCopyOfDeck();
                      setIsEditing(false);
                    } else {
                      setVisible(false);
                    }
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
                        existsInDeck={!!deepCopyOfDeck.cards.find((el) => el.name === card.name)}
                        addToDeck={handleAddCardToDeckWhileEditing}
                        removeFromDeck={handleRemoveCardFromDeckWhileEditing}
                      />
                    );
                  }
                  return null; // Return null if the condition is not met
                })}
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  // const content = deck != null && (
  //   <CustomModal
  //     animationType="none"
  //     transparent={true}
  //     visible={modalVisible}
  //     scrollEnabled={true}
  //     setVisible={setVisible}
  //     onRequestClose={() => {
  //       setVisible(false);
  //     }}
  //   >
  //     <View style={styles.buttonContainer}>
  //       {!isEditing && (
  //         <CustomButton type="neutral" text="EDIT" onPress={() => setIsEditing(true)} />
  //       )}
  //       {isEditing && (
  //         <CustomButton
  //           type="positive"
  //           text="SAVE"
  //           onPress={handleEditing}
  //           disabled={!correctAmountOfCardsInDeck}
  //         />
  //       )}
  //       <CustomButton
  //         type="negative"
  //         text={isEditing ? "CANCEL" : "CLOSE"}
  //         onPress={() => {
  //           if (isEditing) {
  //             resetDeepCopyOfDeck();
  //             setIsEditing(false);
  //           } else {
  //             setVisible(false);
  //           }
  //         }}
  //       />
  //     </View>
  //     <Text style={styles.cardCountText}>{`${cardsInDeck}${
  //       isEditing ? ` / ${MINIMUM_CARDS_IN_NEW_DECK}` : ""
  //     }`}</Text>
  //     {isEditing && (
  //       <TextInput
  //         style={styles.modalInput}
  //         value={newDeckName || deck.deckName}
  //         multiline={true}
  //         numberOfLines={4}
  //         maxLength={80}
  //         autoCorrect={false}
  //         onChangeText={setNewDeckName}
  //       />
  //     )}
  //     <View style={styles.deckContainer}>
  //       {cardsInStore.map((card) => {
  //         if (deepCopyOfDeck.cards.find((el) => el.name === card.name) || isEditing) {
  //           return (
  //             <Card
  //               key={card.name}
  //               card={card}
  //               size="small"
  //               showAddRemoveOperator={isEditing}
  //               border={isEditing}
  //               isOpacityControlled={isEditing}
  //               existsInDeck={!!deepCopyOfDeck.cards.find((el) => el.name === card.name)}
  //               addToDeck={handleAddCardToDeckWhileEditing}
  //               removeFromDeck={handleRemoveCardFromDeckWhileEditing}
  //             />
  //           );
  //         }
  //         return null; // Return null if the condition is not met
  //       })}
  //     </View>
  //   </CustomModal>
  // );

  return <Fragment>{content}</Fragment>;
};

export default SavedDeckModal;

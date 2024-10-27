import { StyleSheet, Text, View } from "react-native";
import { useNewDeckStore, useSavedDeckStore } from "@/store/store";
import { defaultBorderRadius, globalStyles } from "@/constants/styles";
import { defaultColors } from "@/constants/Colors";
import Card from "../card/Card";
import { Fragment, useState } from "react";
import CustomButton from "../button/CustomButton";
import { MINIMUM_CARDS_IN_NEW_DECK } from "@/constants/values";
import { saveDeckToStorage } from "@/helpers/savedDeckManager";
import SaveNewDeckModal from "../modals/specific-modals/SaveNewDeckModal";

const NewDeck: React.FC = () => {
  const [confirmationModalVisible, setConfirmationModalVisible] = useState(false);
  const { cardsInNewDeck, addCardToNewDeck, removeCardFromNewDeck, clearNewDeck } =
    useNewDeckStore();
  const { saveDeckToState } = useSavedDeckStore();
  const countOfCardsInNewDeck: number = cardsInNewDeck.length;
  const isMinimumCardsInDeckReached: boolean = countOfCardsInNewDeck >= MINIMUM_CARDS_IN_NEW_DECK;

  const handleClearNewDeck = () => {
    clearNewDeck();
  };

  const handleSaveDeck = (deckName: string) => {
    const payload = { deckName, cards: cardsInNewDeck };
    saveDeckToStorage(payload);
    saveDeckToState(payload);
    clearNewDeck();
    setConfirmationModalVisible(false);
  };

  const styles = StyleSheet.create({
    buttonContainer: {
      flexDirection: "row",
      justifyContent: "space-evenly",
    },
    newDeckContainer: {
      borderWidth: 1,
      borderColor: isMinimumCardsInDeckReached ? defaultColors.green : defaultColors.red,
      borderRadius: defaultBorderRadius,
      margin: 10,
      padding: 5,
    },
    cards: {
      flex: 1,
      flexDirection: "row",
      flexWrap: "wrap",
      padding: 5,
    },
    text: {
      color: countOfCardsInNewDeck < MINIMUM_CARDS_IN_NEW_DECK ? defaultColors.red : "#42b883",
      fontSize: 18,
    },
    invalidButton: {
      backgroundColor: "grey",
    },
  });

  return (
    <Fragment>
      <View style={styles.buttonContainer}>
        <CustomButton
          text="SAVE DECK"
          type={"positive"}
          disabled={!isMinimumCardsInDeckReached}
          onPress={() => setConfirmationModalVisible(true)}
        />
        <CustomButton text="CLEAR DECK" type={"neutral"} onPress={handleClearNewDeck} />
      </View>
      <View style={styles.newDeckContainer}>
        <Text style={[globalStyles.text, styles.text]}>
          {countOfCardsInNewDeck}/{MINIMUM_CARDS_IN_NEW_DECK}
        </Text>
        <View style={styles.cards}>
          {cardsInNewDeck.map((el) => (
            <Card
              key={el.name}
              card={el}
              size={"small"}
              border={false}
              showAddRemoveOperator={true}
              isOpacityControlled={false}
              existsInDeck={true}
              addToDeck={() => addCardToNewDeck(el)}
              removeFromDeck={() => removeCardFromNewDeck(el)}
            />
          ))}
        </View>
        <SaveNewDeckModal
          modalVisible={confirmationModalVisible}
          setVisible={setConfirmationModalVisible}
          confirmSaveDeck={handleSaveDeck}
        />
      </View>
    </Fragment>
  );
};

export default NewDeck;

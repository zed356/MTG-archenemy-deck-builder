import { StyleSheet, Text, View } from "react-native";
import { useNewDeckStore, useSavedDeckStore } from "@/store/store";
import { defaultBorderRadius, globalStyles } from "@/constants/styles";
import { defaultColors } from "@/constants/Colors";

import Card from "../card/Card";
import { Fragment } from "react";
import CustomButton from "../button/CustomButton";
import { MINIMUM_CARDS_IN_DECK } from "@/constants/values";
import { router } from "expo-router";
import { saveDeckToStorage } from "@/helpers/savedDeckManager";

const NewDeck: React.FC = () => {
  const { cardsInNewDeck, clearNewDeck } = useNewDeckStore();
  const countOfCardsInNewDeck: number = cardsInNewDeck.length;
  const isMinimumCardsInDeckReached: boolean = countOfCardsInNewDeck >= MINIMUM_CARDS_IN_DECK;
  const { saveDeckToState } = useSavedDeckStore();

  const handleClearNewDeck = () => {
    clearNewDeck();
  };

  const handleSaveDeck = () => {
    saveDeckToStorage(cardsInNewDeck);
    saveDeckToState(cardsInNewDeck);
    clearNewDeck();
    router.push("/(tabs)/");
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
      color: countOfCardsInNewDeck < MINIMUM_CARDS_IN_DECK ? defaultColors.red : "#42b883",
      fontSize: 18,
    },
    invalidButton: {
      backgroundColor: "grey",
    },
  });

  return (
    <Fragment>
      <View style={styles.buttonContainer}>
        <CustomButton text="CLEAR DECK" type={"neutral"} onPress={handleClearNewDeck} />
        <CustomButton
          text="SAVE DECK"
          type={"positive"}
          disabled={!isMinimumCardsInDeckReached}
          onPress={handleSaveDeck}
        />
      </View>
      <View style={styles.newDeckContainer}>
        <Text style={[globalStyles.text, styles.text]}>
          {countOfCardsInNewDeck}/{MINIMUM_CARDS_IN_DECK}
        </Text>
        <View style={styles.cards}>
          {cardsInNewDeck.map((el) => (
            <Card key={el.name} card={el} size={"small"} border={false} />
          ))}
        </View>
      </View>
    </Fragment>
  );
};

export default NewDeck;

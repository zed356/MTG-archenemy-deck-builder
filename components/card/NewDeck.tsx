import { StyleSheet, Text, View } from "react-native";
import { useNewDeckStore } from "@/store/store";
import { defaultBorderRadius, globalStyles } from "@/styles/styles";
import { defaultColors } from "@/constants/Colors";

import Card from "./Card";
import { Fragment } from "react";
import CustomButton from "../button/CustomButton";

const NewDeck: React.FC = () => {
  const { cardsInNewDeck, clearNewDeck } = useNewDeckStore();
  const countOfCardsInNewDeck: number = cardsInNewDeck.length;
  const isMinimumCardsInDeckReached: boolean = countOfCardsInNewDeck >= 1;

  const handleClearNewDeck = () => {
    clearNewDeck();
  };

  const handleSaveDeck = () => {
    // TODO: add save logic
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
      color: countOfCardsInNewDeck < 10 ? defaultColors.red : "#42b883",
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
        <CustomButton text="SAVE DECK" type={"positive"} disabled={!isMinimumCardsInDeckReached} />
      </View>
      <View style={styles.newDeckContainer}>
        <Text style={[globalStyles.text, styles.text]}>{countOfCardsInNewDeck}/10</Text>
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

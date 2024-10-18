import { Pressable, StyleSheet, Text, View } from "react-native";
import { useNewDeckStore } from "@/store/store";
import { defaultBorderRadius, defaultColors, globalStyles } from "@/styles/styles";
import Card from "./Card";
import { Fragment } from "react";

const NewDeck: React.FC = () => {
  const { cardsInNewDeck, clearNewDeck } = useNewDeckStore();
  const countOfCardsInNewDeck: number = cardsInNewDeck.length;
  const isMinimumCardsInDeckReached: boolean = countOfCardsInNewDeck >= 10;

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
        <Pressable style={globalStyles.neutralActionButton} onPress={() => clearNewDeck()}>
          <Text style={globalStyles.text}>CLEAR DECK</Text>
        </Pressable>
        <Pressable
          disabled={!isMinimumCardsInDeckReached}
          style={[
            globalStyles.positiveActionButton,
            !isMinimumCardsInDeckReached && styles.invalidButton,
          ]}
          onPress={() => clearNewDeck()}
        >
          <Text style={globalStyles.text}>SAVE</Text>
        </Pressable>
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

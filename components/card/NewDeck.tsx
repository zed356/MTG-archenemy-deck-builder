import { ScryfallCard } from "@scryfall/api-types";
import { Dispatch } from "react";
import { StyleSheet, Text, View } from "react-native";
import { NewDeckAction } from "@/reducers/newDeckReducer";
import Card from "./Card";

interface InputProps {
  cardsInNewDeck: ScryfallCard.Scheme[];
  handleCardInNewDeck: Dispatch<NewDeckAction>;
}

const NewDeck: React.FC<InputProps> = ({ cardsInNewDeck, handleCardInNewDeck }) => {
  const countOfCardsInNewDeck = cardsInNewDeck.length;

  const styles = StyleSheet.create({
    mainContainer: {
      borderWidth: 1,
      borderColor: "gold",
    },
    cardContainer: {
      flex: 1,
      flexDirection: "row",
    },
    text: {
      color: countOfCardsInNewDeck < 10 ? "red" : "#42b883",
    },
  });

  return (
    <View style={styles.mainContainer}>
      <Text style={styles.text}>{countOfCardsInNewDeck}/10</Text>
      <View style={styles.cardContainer}>
        {cardsInNewDeck.map((el) => (
          <Card
            key={el.name}
            card={el}
            size={"small"}
            handleCardInNewDeck={handleCardInNewDeck}
            border={false}
            addedToDeck={true}
          />
        ))}
      </View>
    </View>
  );
};

export default NewDeck;

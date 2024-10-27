import Card from "./Card";
import { ScryfallCard } from "@scryfall/api-types";
import FaceDownCard from "./FaceDownCard";
import { useState } from "react";
import { View, StyleSheet } from "react-native";

interface CardInPlayDeckProps {
  card: ScryfallCard.Scheme;
  addToOnGoingSchemes: (card: ScryfallCard.Scheme) => void;
  removeCardFromDeck?: (card: ScryfallCard.Scheme, discardCard: boolean) => void;
}

const CardInPlayDeck: React.FC<CardInPlayDeckProps> = ({
  card,
  addToOnGoingSchemes,
  removeCardFromDeck,
}) => {
  const [cardIsRevealed, setCardIsRevealed] = useState(false);
  const [isPickedUp, setIsPickedUp] = useState(false);
  const [cardIsDiscardedOrOnGoingScheme, setCardIsDiscardedOrOnGoingScheme] = useState(false);

  const handleRevealCard = () => {
    console.log("card revealed!");
    setCardIsRevealed(true);
  };

  const handleLongPress = () => {
    setIsPickedUp(true); // Change state on long press
    console.log("Element picked up!");
  };

  const handlePressOut = () => {
    setIsPickedUp(false); // Reset state when the touch is released
    console.log("Element released!");
  };

  return !cardIsRevealed ? (
    <FaceDownCard revealCard={handleRevealCard} />
  ) : (
    <View>
      <Card
        card={card}
        size={"large"}
        existsInDeck={false}
        isOpacityControlled={false}
        showAddRemoveOperator={false}
        position={"absolute"}
        isInPlayDeck={true}
        onCardInPlayPress={() => {
          if (card.type_line === "Scheme") {
            console.log("im a scheme");
            setCardIsDiscardedOrOnGoingScheme(true);
            removeCardFromDeck && removeCardFromDeck(card, true);
          } else if (card.type_line === "Ongoing Scheme") {
            console.log("im onmgoing");
            addToOnGoingSchemes(card);
            removeCardFromDeck && removeCardFromDeck(card, false);
            setCardIsDiscardedOrOnGoingScheme(true);
          }
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  box: {
    width: 100,
    height: 100,
    backgroundColor: "tomato",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  pickedUp: {
    backgroundColor: "green", // Change color when picked up
  },
  text: {
    color: "white",
    fontWeight: "bold",
  },
});

export default CardInPlayDeck;

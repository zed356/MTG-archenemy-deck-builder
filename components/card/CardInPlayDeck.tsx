import Card from "./Card";
import { ScryfallCard } from "@scryfall/api-types";
import FaceDownCard from "./FaceDownCard";
import { useState } from "react";

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

  const handleRevealCard = () => {
    setCardIsRevealed(true);
  };

  return !cardIsRevealed ? (
    <FaceDownCard revealCard={handleRevealCard} />
  ) : (
    <Card
      card={card}
      size={"large"}
      existsInDeck={false}
      isOpacityControlled={false}
      showAddRemoveOperator={false}
      isInPlayDeck={true}
      position="absolute"
      onCardInPlayPress={() => {
        if (card.type_line === "Scheme") {
          removeCardFromDeck && removeCardFromDeck(card, true);
        } else if (card.type_line === "Ongoing Scheme") {
          addToOnGoingSchemes(card);
          removeCardFromDeck && removeCardFromDeck(card, false);
        }
      }}
    />
  );
};

export default CardInPlayDeck;

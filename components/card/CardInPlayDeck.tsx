import Card from "./Card";
import { ScryfallCard } from "@scryfall/api-types";
import FaceDownCard from "./FaceDownCard";
import { useState } from "react";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { Dimensions } from "react-native";

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
  const scale = useSharedValue(1);
  const translateY = useSharedValue(0);
  const flipAnimation = useSharedValue(0);
  const opacity = useSharedValue(1);
  const screenHeight = Dimensions.get("window").height;

  const animatedStyle = useAnimatedStyle(() => {
    const rotateY = `${flipAnimation.value * 180}deg`; // Flip by 180 degrees
    return {
      opacity: opacity.value,
      transform: [
        { perspective: 1000 }, // Perspective for 3D effect
        { rotateY },
        { scale: scale.value },
        { translateY: translateY.value },
      ],
    };
  });

  const handleRevealCard = () => {
    // Animate the card upwards and scale it up
    scale.value = withTiming(1.15, { duration: 100 });
    translateY.value = withTiming(-90, { duration: 100 });

    // Start the flip animation to 90 degrees (half flip)
    flipAnimation.value = withTiming(0.5, { duration: 300 });

    // Use a timeout to wait for the flip to finish
    setTimeout(() => {
      // Reveal the card once the flip reaches halfway
      setCardIsRevealed(true);

      // Flip to reset position, starting at -90 degrees to correct orientation
      flipAnimation.value = -0.5;

      // Complete the flip back to 0 degrees (to make it right side up)
      flipAnimation.value = withTiming(0, { duration: 300 });

      // Animate back the scale and translate to their original states
      scale.value = withTiming(1, { duration: 500 });
      translateY.value = withTiming(0, { duration: 500 });
    }, 300); // Ensure the timeout matches the first flip animation's duration
  };

  const handleDiscardCard = () => {
    if (card.type_line === "Scheme") {
      translateY.value = withTiming(-300, { duration: 300 });
      opacity.value = withTiming(0, { duration: 400 });
      setTimeout(() => {
        removeCardFromDeck && removeCardFromDeck(card, true);
      }, 300);
    } else if (card.type_line === "Ongoing Scheme") {
      translateY.value = withTiming(-screenHeight * 0.2, { duration: 300 });
      scale.value = withTiming(0.33, { duration: 300 });
      opacity.value = withTiming(0, { duration: 1000 });
      setTimeout(() => {
        addToOnGoingSchemes(card);
        removeCardFromDeck && removeCardFromDeck(card, false);
      }, 300);
    }
  };

  return (
    <Animated.View style={[animatedStyle]}>
      {!cardIsRevealed ? (
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
          onCardInPlayPress={handleDiscardCard}
        />
      )}
    </Animated.View>
  );
};

export default CardInPlayDeck;

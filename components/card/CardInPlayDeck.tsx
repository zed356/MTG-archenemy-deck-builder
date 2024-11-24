import { ScryfallCard } from "@scryfall/api-types";
import _ from "lodash";
import { useMemo, useState } from "react";
import { Dimensions } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import Card from "./Card";
import FaceDownCard from "./FaceDownCard";

interface CardInPlayDeckProps {
  card: ScryfallCard.Scheme;
  addToOnGoingSchemes: (card: ScryfallCard.Scheme) => void;
  removeCardFromDeck?: (card: ScryfallCard.Scheme, discardCard: boolean) => void;
  discardPileLayout: { x: number; y: number; width: number; height: number };
}

interface ICardNextPhaseRevealOrDiscard {
  phase: "reveal" | "discard" | "pause";
}

const CardInPlayDeck: React.FC<CardInPlayDeckProps> = ({
  card,
  addToOnGoingSchemes,
  removeCardFromDeck,
  discardPileLayout,
}) => {
  const [cardIsRevealed, setCardIsRevealed] = useState(false);
  const [cardNextPhaseRevealOrDiscard, setCardBeingRevealedOrDiscardedPhase] =
    useState<ICardNextPhaseRevealOrDiscard>({ phase: "reveal" });
  const scale = useSharedValue(1);
  const translateX = useSharedValue(0);
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
        { translateX: translateX.value },
        { translateY: translateY.value },
      ],
    };
  });

  // Debounce the reveal card function to prevent multiple touches
  const debouncedRevealCard = useMemo(() => {
    return _.debounce(
      () => {
        // Set the next phase to pause: not allowed to reveal or discard the card
        setCardBeingRevealedOrDiscardedPhase({ phase: "pause" });

        // Animate the card upwards and scale it up
        scale.value = withTiming(1.15, { duration: 100 });
        translateY.value = withTiming(-90, { duration: 100 });

        // Start the flip animation to 90 degrees (half flip)
        flipAnimation.value = withTiming(0.5, { duration: 300 });

        // Use a timeout to wait for the flip to finish
        setTimeout(() => {
          // Reveal the card once the flip reaches halfway
          setCardIsRevealed(true);

          // Set the next phase to discard the card: now allowed to discard the card
          setCardBeingRevealedOrDiscardedPhase({ phase: "discard" });

          // Flip to reset position, starting at -90 degrees to correct orientation
          flipAnimation.value = -0.5;

          // Complete the flip back to 0 degrees (to make it right side up)
          flipAnimation.value = withTiming(0, { duration: 300 });

          // Animate back the scale and translate to their original states
          scale.value = withTiming(1, { duration: 300 });
          translateY.value = withTiming(0, { duration: 300 });
        }, 300); // Ensure the timeout matches the first flip animation's duration
      },
      // how long to wait (in ms) before allowing subsequent touches
      1500,
      { leading: true, trailing: false }
    );
  }, [flipAnimation, scale, translateY]);

  const handleRevealCard = () => {
    // check if the next phase is to reveal the card, if not stop execution
    if (cardNextPhaseRevealOrDiscard.phase !== "reveal") {
      return;
    }
    debouncedRevealCard();
  };

  // Debounce the discard card function to prevent multiple touches
  const debouncedDiscardCard = useMemo(() => {
    return _.debounce(
      () => {
        // Set the next phase to pause: not allowed to reveal or discard the card
        setCardBeingRevealedOrDiscardedPhase({ phase: "pause" });

        if (card.type_line === "Scheme") {
          // translateX.value = withTiming(discardPileLayout.x * 2, { duration: 500 });
          translateY.value = withTiming(-300, { duration: 300 });
          // scale.value = withTiming(0.1, { duration: 200 });
          opacity.value = withTiming(0, { duration: 300 });
          setTimeout(() => {
            removeCardFromDeck && removeCardFromDeck(card, true);
            setCardBeingRevealedOrDiscardedPhase({ phase: "reveal" }); // set the phase to allow users to reveal the next card
          }, 400);
        } else if (card.type_line === "Ongoing Scheme") {
          translateY.value = withTiming(-screenHeight * 0.2, { duration: 300 });
          scale.value = withTiming(0.33, { duration: 300 });
          opacity.value = withTiming(0, { duration: 300 });
          setTimeout(() => {
            addToOnGoingSchemes(card);
            removeCardFromDeck && removeCardFromDeck(card, false);
            setCardBeingRevealedOrDiscardedPhase({ phase: "reveal" }); // set the phase to allow users to reveal the next card
          }, 300);
        }
      },
      // how long to wait (in ms) before allowing subsequent touches
      1500,
      { leading: true, trailing: false }
    );
  }, [addToOnGoingSchemes, card, , removeCardFromDeck, scale, translateY, opacity, screenHeight]);

  const handleDiscardCard = () => {
    // check if the next phase is to discard the phase, if not stop execution
    if (cardNextPhaseRevealOrDiscard.phase !== "discard") {
      return;
    }
    debouncedDiscardCard();
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

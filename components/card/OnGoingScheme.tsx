import { ScryfallCard } from "@scryfall/api-types";
import { StyleSheet } from "react-native";
import Card from "./Card";
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from "react-native-reanimated";

interface OnGoingSchemeProps {
  card: ScryfallCard.Scheme;
  removeOnGoingScheme: () => void;
}

const OnGoingScheme: React.FC<OnGoingSchemeProps> = ({ card, removeOnGoingScheme }) => {
  const opacity = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  const handleRemoveOnGoingScheme = () => {
    opacity.value = withTiming(0, { duration: 300 });
    setTimeout(() => {
      removeOnGoingScheme();
    }, 300);
  };

  return (
    <Animated.View key={card.name} style={[animatedStyle, styles.onGoingSchemeCard]}>
      <Card
        card={card}
        alignFlexEnd={true}
        existsInDeck={true}
        border={false}
        isOpacityControlled={false}
        showAddRemoveOperator={false}
        showAddRemoveOperatorOnSelectedCard={true}
        size="small"
        removeFromDeck={handleRemoveOnGoingScheme}
        displayDiscardButtonInsteadOfOperator={true}
      />
    </Animated.View>
  );
};

export default OnGoingScheme;

const styles = StyleSheet.create({
  onGoingSchemeCard: {
    marginHorizontal: 5,
  },
});

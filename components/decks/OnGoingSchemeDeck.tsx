import { ScryfallCard } from "@scryfall/api-types";
import { View, ScrollView, StyleSheet } from "react-native";
import OnGoingScheme from "../card/OnGoingScheme";
import { defaultColors } from "@/constants/Colors";
import { defaultBorderRadius } from "@/constants/styles";

interface OnGoingSchemeDeckProps {
  onGoingSchemes: ScryfallCard.Scheme[];
  removeOnGoingScheme: (card: ScryfallCard.Scheme) => void;
}

const OnGoingSchemeDeck: React.FC<OnGoingSchemeDeckProps> = ({
  onGoingSchemes,
  removeOnGoingScheme,
}) => {
  return (
    <View style={styles.onGoingSchemeContainer}>
      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
        {onGoingSchemes.map((card) => (
          <OnGoingScheme
            key={card.name}
            card={card}
            removeOnGoingScheme={() => removeOnGoingScheme(card)}
          />
        ))}
      </ScrollView>
    </View>
  );
};

export default OnGoingSchemeDeck;

const styles = StyleSheet.create({
  onGoingSchemeContainer: {
    borderWidth: 2,
    borderColor: defaultColors.gold,
    borderRadius: defaultBorderRadius,
    width: "96%",
    paddingVertical: 10,
    marginTop: 30,
    position: "absolute",
    flexDirection: "row",
    alignSelf: "center",
    overflow: "hidden",
  },
});

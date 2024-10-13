import { View, StyleSheet, ActivityIndicator, TouchableWithoutFeedback } from "react-native";
import { ICard } from "@/types/types";
import { Image } from "expo-image";
import FastImage from "react-native-fast-image";
import { useState } from "react";
import { ScryfallCard } from "@scryfall/api-types";

interface InputProps {
  card: ScryfallCard.Scheme;
  isSelected: boolean;
  onCardPress: () => void;
}

const Card: React.FC<CardProps> = ({ card, isSelected, onCardPress }) => {
  const [loading, setLoading] = useState(true);

  const handleImageLoadEnd = () => {
    setLoading(false);
  };

  const styles = StyleSheet.create({
    container: {
      opacity: isSelected ? 1 : 0.8, // 20% less opacity for unselected cards
      paddingTop: 0,
    },
    card: {
      width: isSelected ? 240 : 160, // 50% larger if selected
      height: isSelected ? 345 : 230,
      marginBottom: 10,
      borderRadius: 11,
    },
  });

  return (
    <TouchableWithoutFeedback onPress={onCardPress}>
      <View style={styles.container}>
        {loading && <ActivityIndicator size="large" color="#FFD700" />}
        <Image
          style={styles.card}
          source={
            typeof card.image_uris!.normal === "string"
              ? { uri: card.image_uris!.normal }
              : card.image_uris!.normal
          }
          contentFit="cover"
          transition={1000}
          onError={() => {
            console.log("nx bl" + card.image_uris!.normal);
          }}
          onLoadEnd={handleImageLoadEnd}
        />
      </View>
    </TouchableWithoutFeedback>
  );
};

export default Card;
